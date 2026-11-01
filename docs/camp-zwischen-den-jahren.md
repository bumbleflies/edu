# Camp „Zwischen den Jahren" — product, operations and progress

**One prototype day** of robotics in the Christmas holidays. It is small enough
for one small team to run and it feeds the January cohorts. The minute-by-minute
schedule and the printed runbook are produced separately. This file says what
the camp *is*, what has to be true before it runs, and how far along each item
is.

> **Decision 2026-11-01:** cut from three mornings (28–30 Dec, €99) to **one
> day** as a prototype. One morning is easier to place in a venue, needs no
> overnight storage, and tests demand before committing to a multi-day format.
> The day itself is fixed by whichever venue says yes first.

## Progress tracker

Status: ⬜ open · 🟡 in progress · ✅ done · ❌ dropped. Update the row, the
date and the note in the same edit. The **Due** column is the latest date that
still keeps the camp on schedule.

| # | Item | Owner | Due | Status | Note |
|---|---|---|---|---|---|
| 1 | Room: Bürgerhaus Porta (0571 39843737) | Christian | 2026-11-02 | 🟡 | Email sent 2026-11-01; follow up by phone Mon 2 Nov |
| 2 | Room: St. Marien Minden (0571 8290816, Mo 10–12) | Christian | 2026-11-02 | 🟡 | Email sent 2026-11-01; follow up by phone Mon 2 Nov 10–12 |
| 3 | Room: BÜZ Kulturzentrum (0571 23939, Tue 9–13) | Christian | 2026-11-03 | 🟡 | Email sent 2026-11-01; follow up by phone Tue 3 Nov if 1+2 have not confirmed |
| 4 | Room: fallback, sports-club room or Diakonie e-werk Raum Hille (€249 per half day) | Christian | 2026-11-10 | ⬜ | Only if 1–3 fail |
| 5 | Room confirmed **in writing**, all five venue questions answered | Christian | 2026-11-13 | ⬜ | Releases the camp date |
| 6 | Erweitertes Führungszeugnis, Christian | Christian | apply by 2026-11-06 | 🟡 | Online application OLAF-0004419845 filled in, **payment stuck** (portal: payment already started). Retry after the session expires; letter in Drive Jobs/edu |
| 7 | Erweitertes Führungszeugnis, second adult | — | — | ❌ | Removed for now (2026-11-01); reopen when a second adult is named |
| 8 | Erste-Hilfe-Kurs valid on the day, Christian | Christian | book by 2026-11-15 | ⬜ | 2–4 weeks to get a place |
| 9 | Repo: set `startDate` = `endDate` and the venue in `courses.json` (+ `camps.test.ts`) | — | after #5 | ⬜ | One-day format and €39 are already in the data |
| 10 | pretix: re-sync event (`setup-pretix.mjs`), replace `location: "TBA"` | — | after #9 | ⬜ | |
| 11 | pretix: enable a payment provider (manual, no API) | Christian | after #10 | ⬜ | Event cannot take money until done |
| 12 | BuT question live, Kostenbescheinigung template ready | — | after #10 | ⬜ | See [`bildung-und-teilhabe.md`](./bildung-und-teilhabe.md) |
| 12a | Website announcement `/robotik-tag` + `/en/robotics-day`, homepage teaser | Christian | 2026-11-06 | ✅ | Live since 2026-11-01 (PR #129, edu 0.22.0); linked from the three venue email drafts |
| 13 | Announce: flyer, social posts, Ferienpass/zdi contacts | — | 2026-11-30 | ⬜ | Four weeks of selling before Christmas |
| 14 | Run the day + film the showcase | both | the day | ⬜ | |
| 15 | Debrief: attendance, January conversions, repeat as 3 days? | Christian | 2027-01-08 | ⬜ | |

## The product

| | |
|---|---|
| Name (de) | Robotik-Tag zwischen den Jahren |
| Name (en) | Between the Years — Robotics Day |
| Date | **one of Mon 28 / Tue 29 / Wed 30 December 2026**, set by the venue |
| Time | 10:00 – 14:00 (4 contact hours) |
| Ages | 8 – 12 |
| Places | **12** |
| Price | **€39** |
| Staff | 2 adults |
| Hardware | 8 mbot2 robots, pairs share during build phases |
| Booking | pretix event `zwischen-den-jahren` |

Data lives in `src/data/courses.json` under `camps`, and `src/lib/camps.test.ts`
pins every number. Until a venue is signed the entry has `dateOptions`
instead of a `startDate`; `setup-pretix.mjs` skips it and the website shows
the three candidate days. Change the data and the test together.

## Why this window

NRW Christmas holidays run **Wed 23 December 2026 – Wed 6 January 2027**. Inside
that window, 28–30 December is uncontested. The city's Ferienspiele run at
Easter, in summer and in autumn, but not between the years. Parents are on
holiday, the children are bored by day four, and nobody else runs a paid
programme.

It is also the cheapest possible marketing for January: twelve families who have
already met us, seen the robots, and watched their child present something.

## Economics

| | |
|---|---|
| Revenue (12 × €39) | €468 |
| Room (one morning) | €60 – 150 (€249 for the e-werk fallback) |
| Materials, printing | ~€30 |
| **Contribution before staff** | **~€290 – 380** (~€190 with the fallback room) |

The prototype is not meant to make money. It is judged on two numbers: **was it
full**, and **how many families book a January course**. If the day sells out
quickly, the three-day format (€99) is the next step for Easter or 2027.

## Room requirements

School rooms and the Haus der Bildung are out: Minden's Benutzungsordnung
excludes school holidays, and nobody holds a caretaker's key between Christmas
and New Year. The camp needs a **year-round venue** — a Bürgerhaus, a parish
hall or a clubhouse. Candidates and contacts are in
[`market-research-porta-minden.md`](./market-research-porta-minden.md#who-to-call--verified-october-2026).

Ask for **any one of 28/29/30 December**, 09:30–14:30 (setup and teardown
included). Flexibility on the date is the strongest thing we have to offer.

### Five questions for any venue

Ask all five on the phone, then confirm by email:

1. **Is the room heated** on that day, or is the building in holiday shutdown?
2. **Eight usable sockets**, or may we bring power strips, and how many circuits?
3. **Tables and chairs** for 12 children plus two adults, in groups of two.
4. **Whose liability insurance** covers a supervised children's activity run by
   us on their premises?
5. **Who holds the key**, and can parents come into the room at 13:30 for the
   showcase?

## The showcase

13:30, parents and grandparents in the room. Each pair demonstrates what its
robot does. Film it: the footage is the cheapest content we will get all year,
and it is the moment the January booking conversation happens.

## Log

- **2026-11-01** — Format cut to one prototype day at €39 / 12 places. No venue
  contacted yet. Email drafts for Bürgerhaus Porta, St. Marien and BÜZ prepared
  in Gmail, to be sent after the phone calls. Website announcement
  `/robotik-tag` + `/en/robotics-day` merged (PR #129) and released as edu
  0.22.0 (one-day data, €39, reservation by email, "Raum gesucht" section).
- **2026-11-01** — Background-check request letter for Christian signed and
  filed in Drive (Jobs/edu). It describes the ongoing course series (ages
  8–14, starting December 2026), not just the Robotik-Tag, so one certificate
  covers the whole series. Second adult removed from the plan for now.
- **2026-11-01** — Applied online at fuehrungszeugnis.bund.de (erweitert,
  letter attached). Application OLAF-0004419845 hung at the card-payment
  handover; the portal now reports a payment as already started, but no card
  details were entered, so nothing was charged. Next: check the BundID mailbox,
  wait for the payment session to expire, then retry with pop-ups allowed. If
  it fails again, contact the Bundesamt für Justiz quoting OLAF-0004419845 and
  the abandoned OLAF-0004419747.
- **2026-11-01** — Room requests emailed to Bürgerhaus Porta, St. Marien and
  BÜZ (any of 28/29/30 Dec, 09:30–14:30, the five venue questions, link to
  the announcement page). The links in the emails went out as Google redirect
  URLs (the Gmail connector rewrites them); they still lead to the page. Next:
  phone follow-ups Mon 2 Nov (Bürgerhaus, St. Marien) and Tue 3 Nov (BÜZ).
