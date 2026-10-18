import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.PRETIX_API_TOKEN;
if (!TOKEN) {
  console.error('Missing PRETIX_API_TOKEN environment variable.');
  process.exit(1);
}

const coursesJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('../src/data/courses.json', import.meta.url)), 'utf-8'),
);
const { host, organizer, currency, timezone, locales } = coursesJson.pretix;
const base = `${host}/api/v1/organizers/${organizer}`;

/** Every bookable offer: the term courses, plus any one-off camps. */
const offers = [...coursesJson.courses, ...(coursesJson.camps ?? [])];

const headers = {
  Authorization: `Token ${TOKEN}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`[${res.status}] ${options.method ?? 'GET'} ${path}: ${JSON.stringify(data)}`);
  }
  return data;
}

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function nameEquals(name, expected) {
  return name === expected || (name && name.en === expected);
}

/**
 * The question set for one offer: every shared question, then the offer's own.
 * An offer question that repeats an `identifier` replaces the shared one, so a
 * camp can narrow the age range or add a BuT question without repeating the rest.
 */
function questionsFor(offer) {
  const byIdentifier = new Map(coursesJson.questions.map((q) => [q.identifier, q]));
  for (const q of offer.questions ?? []) byIdentifier.set(q.identifier, q);
  return [...byIdentifier.values()];
}

async function upsertQuestions(slug, itemId, questions) {
  const existing = await request(`/events/${slug}/questions/`);
  for (const q of questions) {
    const question = existing.results.find((e) => e.identifier === q.identifier);
    const body = {
      identifier: q.identifier,
      question: { en: q.en, de: q.de },
      help_text: q.help,
      type: q.type,
      required: q.required,
      items: [itemId],
      valid_number_min: q.valid_number_min,
      valid_number_max: q.valid_number_max,
    };
    if (question) {
      await request(`/events/${slug}/questions/${question.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      console.log(`updated question: ${slug} / ${q.identifier}`);
    } else {
      await request(`/events/${slug}/questions/`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log(`created question: ${slug} / ${q.identifier}`);
    }
  }
}

/**
 * One pretix event per offer.
 *
 * A term course runs for `weeks`; a camp carries an explicit `endDate` instead,
 * because three days is not a number of weeks. A camp may also cap its quota
 * with `capacity` (pretix reads a quota size of 0 as unlimited).
 */
async function upsertEvent(offer) {
  const slug = offer.slug;
  const dateFrom = new Date(`${offer.startDate}T00:00:00Z`).toISOString();
  const dateTo = offer.endDate
    ? new Date(`${offer.endDate}T23:59:59Z`).toISOString()
    : addDays(offer.startDate, offer.weeks * 7);
  const description = offer.description ?? {
    en: `bumble:education course: ${offer.name.en}. Hands-on STEM education. Starts ${offer.startDate}, ${offer.weeks} weeks.`,
    de: `bumble:education-Kurs: ${offer.name.de}. Praktische MINT-Bildung. Start ${offer.startDate}, ${offer.weeks} Wochen.`,
  };

  if (existingSlugs.has(slug)) {
    await request(`/events/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: offer.name,
        date_from: dateFrom,
        date_to: dateTo,
        location: coursesJson.location,
      }),
    });
    console.log(`updated event: ${slug}`);
  } else {
    try {
      await request('/events/', {
        method: 'POST',
        body: JSON.stringify({
          slug,
          name: offer.name,
          live: false,
          testmode: false,
          currency,
          timezone,
          date_from: dateFrom,
          date_to: dateTo,
          location: coursesJson.location,
          is_public: true,
        }),
      });
      console.log(`created event: ${slug} (draft — needs payment provider before going live)`);
    } catch (err) {
      if (!err.message.startsWith('[409]')) throw err;
      console.log(`event ${slug} already exists but is not managed by this token — skipped`);
    }
  }

  await request(`/events/${slug}/settings/`, {
    method: 'PATCH',
    body: JSON.stringify({
      locales,
      locale: 'en',
      event_info_text: description,
      ...coursesJson.pretix.branding,
      imprint_url: coursesJson.pretix.legal.imprintUrl.en,
      contact_mail: 'info@bumbleflies.de',
    }),
  });

  const items = await request(`/events/${slug}/items/`);
  let item = items.results.find((i) => nameEquals(i.name, offer.name.en));
  if (item) {
    await request(`/events/${slug}/items/${item.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ name: offer.name, default_price: offer.price }),
    });
    console.log(`updated item: ${slug} / ${item.id}`);
  } else {
    item = await request(`/events/${slug}/items/`, {
      method: 'POST',
      body: JSON.stringify({
        name: offer.name,
        active: true,
        default_price: offer.price,
        admission: true,
      }),
    });
    console.log(`created item: ${slug} / ${offer.name.en} (€${offer.price})`);
  }

  const quotas = await request(`/events/${slug}/quotas/`);
  for (const q of quotas.results) {
    await request(`/events/${slug}/quotas/${q.id}/`, { method: 'DELETE' });
  }
  await request(`/events/${slug}/quotas/`, {
    method: 'POST',
    body: JSON.stringify({ name: offer.name.en, size: offer.capacity ?? 0, items: [item.id] }),
  });
  console.log(`recreated quota: ${slug} / ${offer.name.en} (${offer.capacity ?? 'unlimited'})`);

  await upsertQuestions(slug, item.id, questionsFor(offer));

  return { slug, publicUrl: `${host}/${organizer}/${slug}/` };
}

const results = [];
const existing = await request('/events/');
const existingSlugs = new Set(existing.results.map((e) => e.slug));
for (const offer of offers) {
  results.push(await upsertEvent(offer));
}

console.log('\nCreated/updated events:');
for (const r of results) {
  console.log(`  - ${r.publicUrl}`);
}
console.log(`\nEvents are drafts. To open sales, enable a payment provider for each event in the pretix admin and toggle live.`);
