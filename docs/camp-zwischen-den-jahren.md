# Camp „Zwischen den Jahren" — product and operations

Three mornings of robotics in the Christmas holidays, sized to be runnable by
one small team and to feed the January cohorts. The minute-by-minute schedule
and the printed runbook are produced separately; this file is the reference for
what the camp *is* and what has to be true before it runs.

## The product

| | |
|---|---|
| Name (de) | Robotik-Camp zwischen den Jahren |
| Name (en) | Between the Years — Robotics Camp |
| Dates | **Mon 28 – Wed 30 December 2026** |
| Daily | 10:00 – 14:00 (4 h/day, 12 contact hours) |
| Ages | 8 – 12 |
| Places | **12** |
| Price | **€99** for all three days |
| Staff | 2 adults |
| Hardware | 8 mbot2 robots — pairs share during build phases |
| Booking | pretix event `zwischen-den-jahren` |

Data lives in `src/data/courses.json` under `camps`; `src/lib/camps.test.ts`
pins every number in that table. Change the data, change the test.

## Why this window

NRW Christmas holidays run **Wed 23 December 2026 – Wed 6 January 2027**. Inside
that window 28–30 December is uncontested: the city's Ferienspiele run at Easter,
in summer and in autumn, but not between the years. Parents are on holiday, the
children are bored by day four, and nobody else is running a paid programme.

It is also the cheapest possible marketing for January: twelve families who have
already met us, seen the robots, and watched their child present something.

## Economics

| | |
|---|---|
| Revenue (12 × €99) | €1 188 |
| Direct costs (venue, staff, materials) | ~€760 – 1 120 |
| **Contribution** | **~€68 – 428** |

The camp is close to break-even by design. The return is not the margin — it is
twelve warm leads for the €35/€49 monthly courses, and a BuT relationship with
families who currently cannot pay at all. Judge it on cohort conversion, not on
its own profit line.

At €99 for 12 contact hours it earns **€99 per room-hour**, roughly 1.5–1.8×
what a weekly course earns per hour — see
[`market-research-porta-minden.md`](./market-research-porta-minden.md).

## Before it can run

Long-lead items, in order of how easily they sink the date:

1. **Erweitertes Führungszeugnis** (§ 72a SGB VIII) for every adult present —
   **2–6 weeks**. Start now; it cannot be expedited.
2. **Erste-Hilfe-Kurs** — 2–4 weeks to get a place. Needs to be valid on the day.
3. **A room that is actually open 28–30 December** — a year-round venue, not a
   school. School rooms are excluded in school holidays, and nobody is holding a
   caretaker's key between Christmas and New Year. See the venue table in
   [`market-research-porta-minden.md`](./market-research-porta-minden.md#who-to-call--verified-october-2026).
4. **Payment provider enabled on the pretix event.** The event is created as a
   draft and pretix has no API for this — it is a manual step in the admin.
5. **BuT question live on the booking form** and the Kostenbescheinigung ready to
   send the same day a family ticks it. See
   [`bildung-und-teilhabe.md`](./bildung-und-teilhabe.md).

## Five questions for any venue

Ask all five on the phone, not by email:

1. **Is the room heated** on 28–30 December, or is the building in holiday
   shutdown?
2. **Eight usable sockets** — or may we bring power strips, and how many circuits?
3. **Can we leave the robots overnight** in a lockable cupboard?
4. **Whose liability insurance** covers a supervised children's activity run by
   us on their premises?
5. **Who holds the key** on those three days, and can parents be received at
   13:30 on day three for the showcase?

## The showcase

Day three, 13:30, parents and grandparents in the room. Each pair demonstrates
what their robot does. Film it — the footage is the cheapest content we will get
all year, and it is the moment the January booking conversation happens.

## Still open

- **Venue.** Unresolved. The pretix event carries `location: "TBA"` from
  `src/data/courses.json` until a room is signed.
- **Staffing.** Two adults named; both need items 1 and 2 above cleared.
- **Payment provider**, so the event can take money at all.
- Whether the camp recurs — the same window works in 2027, and a summer week
  would test whether the format travels.
