import type { Lang } from "./i18n";
import coursesData from "../data/courses.json";
import { eventUrl } from "./pretix";

/**
 * The one-day "Robotik-Tag zwischen den Jahren". Facts (dates, times, price,
 * capacity) come from `courses.json`; this module holds the page copy and turns
 * the facts into display strings. While `startDate` is unset the venue picks
 * the day from `dateOptions`, and booking stays closed (reservation by email).
 */
export interface Camp {
  slug: string;
  name: Record<Lang, string>;
  dateOptions: string[];
  startDate?: string;
  endDate?: string;
  bookingOpen: boolean;
  dailyFrom: string;
  dailyTo: string;
  price: number;
  capacity: number;
}

export const camp = coursesData.camps[0] as Camp;

export const campPath: Record<Lang, string> = { de: "/robotik-tag", en: "/en/robotics-day" };

/** Fixed name tables instead of Intl, so the output does not depend on the ICU build. */
const names = {
  de: {
    short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    long: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    day: (n: number) => `${n}.`,
    or: "oder",
  },
  en: {
    short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    day: (n: number) => `${n}`,
    or: "or",
  },
} as const;

const parts = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return { weekday: d.getUTCDay(), day: d.getUTCDate(), month: d.getUTCMonth(), year: d.getUTCFullYear() };
};

/** "Mo 28., Di 29. oder Mi 30. Dezember 2026" / "Mon 28, Tue 29 or Wed 30 December 2026", or the fixed day. */
export function campDateLabel(lang: Lang): string {
  const n = names[lang];
  if (camp.startDate) {
    const p = parts(camp.startDate);
    const sep = lang === "de" ? ", " : " ";
    return `${n.long[p.weekday]}${sep}${n.day(p.day)} ${n.months[p.month]} ${p.year}`;
  }
  const days = camp.dateOptions.map((iso) => {
    const p = parts(iso);
    return `${n.short[p.weekday]} ${n.day(p.day)}`;
  });
  const last = parts(camp.dateOptions[camp.dateOptions.length - 1]);
  return `${days.slice(0, -1).join(", ")} ${n.or} ${days[days.length - 1]} ${n.months[last.month]} ${last.year}`;
}

export function campPriceLabel(lang: Lang): string {
  return lang === "de" ? `${camp.price} €` : `€${camp.price}`;
}

export function campBookingHref(lang: Lang): string {
  if (camp.bookingOpen) return eventUrl(camp.slug);
  const subject = lang === "de" ? "Robotik-Tag: Platz vormerken" : "Robotics Day: reserve a place";
  return `mailto:info@bumbleflies.de?subject=${encodeURIComponent(subject)}`;
}

export interface CampCopy {
  title: string;
  description: string;
  eyebrow: string;
  titleMain: string;
  titlePop: string;
  lead: string;
  factsLabels: { when: string; time: string; age: string; places: string; price: string; where: string };
  timeValue: string;
  ageValue: string;
  placesValue: string;
  whereValue: string;
  dateNote: string;
  scheduleTitle: string;
  schedule: { time: string; text: string }[];
  goodToKnowTitle: string;
  goodToKnow: { title: string; text: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  ctaButtonOpen: string;
  venueTitle: string;
  venueText: string;
  venueNeeds: string[];
  venueContact: string;
  teaserLabel: string;
  teaserText: string;
  teaserLink: string;
}

export const campCopy: Record<Lang, CampCopy> = {
  de: {
    title: `${camp.name.de} · edu.bumbleflies.de`,
    description:
      "Ein Robotik-Tag in den Weihnachtsferien für Kinder von 8 bis 12 Jahren: in Zweierteams einen mbot2 bauen, programmieren und den Eltern vorführen. 39 €, 12 Plätze.",
    eyebrow: "Weihnachtsferien 2026 · 8–12 Jahre",
    titleMain: "Robotik-Tag",
    titlePop: "zwischen den Jahren",
    lead:
      "Ein Tag, ein Roboter, eine Vorführung: In Zweierteams bauen die Kinder einen mbot2, bringen ihm mit bunten Blöcken das Fahren bei und zeigen am Ende ihren Eltern, was er kann. Keine Vorkenntnisse nötig.",
    factsLabels: { when: "Wann", time: "Uhrzeit", age: "Alter", places: "Plätze", price: "Preis", where: "Wo" },
    timeValue: `${camp.dailyFrom} – ${camp.dailyTo} Uhr`,
    ageValue: "8–12 Jahre",
    placesValue: `${camp.capacity} Kinder, 2 Betreuer`,
    whereValue: "Minden / Porta Westfalica",
    dateNote:
      "Der genaue Tag und der Ort stehen fest, sobald der Raum gebucht ist. Wer sich vormerkt, erfährt es zuerst.",
    scheduleTitle: "So läuft der Tag",
    schedule: [
      { time: "10:00", text: "Ankommen, Teams bilden, den mbot2 kennenlernen" },
      { time: "10:30", text: "Erste Programme: fahren, blinken, piepen" },
      { time: "12:00", text: "Mittagspause mit Lunchpaket" },
      { time: "12:30", text: "Die Challenge: Parcours, Linie folgen, Hindernissen ausweichen" },
      { time: "13:30", text: "Vorführung für Eltern und Großeltern" },
      { time: "14:00", text: "Abholen" },
    ],
    goodToKnowTitle: "Gut zu wissen",
    goodToKnow: [
      { title: "Lunchpaket mitbringen", text: "Bitte gebt eurem Kind Mittagessen und etwas zu trinken mit." },
      { title: "Roboter werden gestellt", text: "Die mbot2 und alle Materialien bringen wir mit. Die Roboter bleiben bei uns." },
      { title: "Bildung und Teilhabe", text: "Die Gebühr kann über Bildung und Teilhabe (BuT) übernommen werden. Wichtig: den Antrag vor dem Robotik-Tag stellen. Wir schicken gern eine Kostenbescheinigung." },
      { title: "Danach weitermachen", text: "Wem es gefällt, der kann im Januar in einen unserer Kurse einsteigen." },
    ],
    ctaTitle: "Platz vormerken",
    ctaText:
      "Die Anmeldung öffnet, sobald Tag und Ort feststehen. Schreibt uns schon jetzt eine kurze Mail mit Vorname und Alter eures Kindes, dann halten wir einen Platz frei und melden uns zuerst bei euch.",
    ctaButton: "Per E-Mail vormerken",
    ctaButtonOpen: "Jetzt buchen",
    venueTitle: "Raum gesucht",
    venueText:
      "Für den Robotik-Tag suchen wir noch einen Raum in Minden oder Porta Westfalica, an einem der drei Tage von 09:30 bis 14:30 Uhr (mit Auf- und Abbau).",
    venueNeeds: [
      "beheizt, auch zwischen den Feiertagen",
      "Tische und Stühle für 12 Kinder und 2 Erwachsene",
      "etwa acht Steckdosen (Mehrfachstecker bringen wir mit)",
      "Platz für die Eltern zur Vorführung um 13:30 Uhr",
    ],
    venueContact: "Sie haben einen passenden Raum? Wir freuen uns über eine Nachricht an",
    teaserLabel: "Neu in den Weihnachtsferien",
    teaserText: `${camp.name.de}: ein Tag mit dem mbot2 für Kinder von 8 bis 12, 39 €.`,
    teaserLink: "Mehr erfahren",
  },
  en: {
    title: `${camp.name.en} · edu.bumbleflies.de`,
    description:
      "A robotics day in the Christmas holidays for children aged 8–12: build an mbot2 in pairs, code it and show it to the parents. €39, 12 places.",
    eyebrow: "Christmas holidays 2026 · Ages 8–12",
    titleMain: "Robotics Day",
    titlePop: "between the years",
    lead:
      "One day, one robot, one showcase: working in pairs, the children build an mbot2, teach it to drive with colourful blocks, and show their parents what it can do at the end. No experience needed.",
    factsLabels: { when: "When", time: "Time", age: "Ages", places: "Places", price: "Price", where: "Where" },
    timeValue: `${camp.dailyFrom} – ${camp.dailyTo}`,
    ageValue: "8–12 years",
    placesValue: `${camp.capacity} children, 2 coaches`,
    whereValue: "Minden / Porta Westfalica",
    dateNote:
      "The exact day and the address are fixed as soon as the room is booked. Everyone who reserves a place hears first.",
    scheduleTitle: "How the day runs",
    schedule: [
      { time: "10:00", text: "Arrive, form teams, meet the mbot2" },
      { time: "10:30", text: "First programs: drive, blink, beep" },
      { time: "12:00", text: "Lunch break with a packed lunch" },
      { time: "12:30", text: "The challenge: obstacle course, line following, avoiding walls" },
      { time: "13:30", text: "Showcase for parents and grandparents" },
      { time: "14:00", text: "Pick-up" },
    ],
    goodToKnowTitle: "Good to know",
    goodToKnow: [
      { title: "Bring a packed lunch", text: "Please pack lunch and something to drink for your child." },
      { title: "Robots provided", text: "We bring the mbot2 robots and all materials. The robots stay with us." },
      { title: "Bildung und Teilhabe", text: "The fee can be covered by Bildung und Teilhabe (BuT). Important: apply before the Robotics Day. We are happy to send a cost confirmation." },
      { title: "Keep going", text: "Children who enjoy it can join one of our courses in January." },
    ],
    ctaTitle: "Reserve a place",
    ctaText:
      "Booking opens as soon as the day and the room are fixed. Send us a short email with your child's first name and age now, and we will hold a place and tell you first.",
    ctaButton: "Reserve by email",
    ctaButtonOpen: "Book now",
    venueTitle: "Looking for a room",
    venueText:
      "We are still looking for a room in Minden or Porta Westfalica for the Robotics Day, on one of the three days from 09:30 to 14:30 (including setup).",
    venueNeeds: [
      "heated, also between the holidays",
      "tables and chairs for 12 children and 2 adults",
      "around eight sockets (we bring power strips)",
      "space for parents at the 13:30 showcase",
    ],
    venueContact: "Have a suitable room? We would love to hear from you at",
    teaserLabel: "New in the Christmas holidays",
    teaserText: `${camp.name.en}: one day with the mbot2 for children aged 8–12, €39.`,
    teaserLink: "Find out more",
  },
};
