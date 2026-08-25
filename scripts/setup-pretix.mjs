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

async function upsertEvent(course) {
  const slug = course.slug;
  const dateFrom = new Date(`${course.startDate}T00:00:00Z`).toISOString();
  const dateTo = addDays(course.startDate, course.weeks * 7);
  const description = {
    en: `Bumble Academy course: ${course.name.en}. Starts ${course.startDate}, ${course.weeks} weeks.`,
    de: `Bumble-Academy-Kurs: ${course.name.de}. Start ${course.startDate}, ${course.weeks} Wochen.`,
  };

  if (existingSlugs.has(slug)) {
    await request(`/events/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: course.name,
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
          name: course.name,
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
    body: JSON.stringify({ locales, locale: 'en', event_info_text: description }),
  });

  const items = await request(`/events/${slug}/items/`);
  let item = items.results.find((i) => nameEquals(i.name, course.name.en));
  if (item) {
    await request(`/events/${slug}/items/${item.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ name: course.name, default_price: course.price }),
    });
    console.log(`updated item: ${slug} / ${item.id}`);
  } else {
    item = await request(`/events/${slug}/items/`, {
      method: 'POST',
      body: JSON.stringify({
        name: course.name,
        active: true,
        default_price: course.price,
        admission: true,
      }),
    });
    console.log(`created item: ${slug} / ${course.name.en} (€${course.price})`);
  }

  const quotas = await request(`/events/${slug}/quotas/`);
  for (const q of quotas.results) {
    await request(`/events/${slug}/quotas/${q.id}/`, { method: 'DELETE' });
  }
  await request(`/events/${slug}/quotas/`, {
    method: 'POST',
    body: JSON.stringify({ name: course.name.en, size: 0, items: [item.id] }),
  });
  console.log(`recreated quota: ${slug} / ${course.name.en}`);

  return { slug, publicUrl: `${host}/${organizer}/${slug}/` };
}

const results = [];
const existing = await request('/events/');
const existingSlugs = new Set(existing.results.map((e) => e.slug));
for (const course of coursesJson.courses) {
  results.push(await upsertEvent(course));
}

console.log('\nCreated/updated events:');
for (const r of results) {
  console.log(`  - ${r.publicUrl}`);
}
console.log(`\nEvents are drafts. To open sales, enable a payment provider for each event in the pretix admin and toggle live.`);