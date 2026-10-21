# Bildung und Teilhabe (BuT)

How the Jobcenter pays for a child's place on a course or camp, and what we must
do so a family can use it. This is the process of record; the printable
three-sheet set is produced separately as a DocStash PDF.

> Not legal advice. The figures and procedures below are what we work from —
> confirm anything load-bearing directly with the Jobcenter before relying on it
> in a fee dispute.

## The mechanics

- **Base:** § 28 Abs. 7 SGB II covers "Teilhabe am sozialen und kulturellen
  Leben" — leisure, sport, culture, holiday activities. For families outside
  SGB II the equivalent sits in § 34 SGB XII (Sozialhilfe) and § 6b BKGG
  (Kinderzuschlag / Wohngeld).
- **Amount:** **€15 per month per child**, capped at **€180 within any twelve
  months**. The budget is *accruable* — unused months carry forward — and the
  full amount can be released as one sum for a single activity.
- **It is one shared pot.** Football club, music school, swimming and our camp
  draw from the same €180. A family may already have spent part of it.
- **Payment:** can be made **directly to the provider** on invoice. That is the
  route to prefer; it avoids the family having to front €99.
- **Age:** children under 18.

## The rule that trips providers up

**The application must be approved before the activity starts.** BuT is granted
in advance and is not a reimbursement scheme. Costs already paid are, in
practice, not recovered afterwards.

So the sequence is fixed:

1. Family books with us and ticks the BuT question on the booking form.
2. **We issue a Kostenbescheinigung immediately** — same or next working day. The
   family cannot apply without it.
3. The family files it with the Jobcenter, in time for it to be decided before
   day one.
4. After the activity we issue a Teilnahmebestätigung.

A family that asks on 27 December for a camp starting 28 December cannot be
helped. Say so kindly and early, and offer the next cohort.

## Never call it free

Never write or say that an activity is "free with BuT", "kostenlos über BuT" or
similar. We cannot promise the outcome — the Jobcenter decides, and the pot is
shared. The correct framing is: *"Bildung und Teilhabe can cover the fee — up to
€180 per child per year, shared across all leisure activities."*

This rule is asserted in `src/lib/camps.test.ts` for the camp copy, and applies
to site copy, flyers and conversation alike.

## The three documents

| Sheet | When | Who fills it | Purpose |
|---|---|---|---|
| **Information für Eltern** | With the booking confirmation | Us | Explains BuT plain-language, incl. the apply-before rule and the shared pot |
| **Kostenbescheinigung** | **Before** the start | Us, signed | Proves the child is registered for a fee-bearing activity; the family attaches it to the application |
| **Teilnahmebestätigung** | **After** the last day | Us, signed | Proves actual attendance, for the Jobcenter's file |

Both forms need Ort, Datum, Unterschrift and Stempel. The Kostenbescheinigung
must state the activity, its dates, daily hours, total hours, venue, the fee and
that no further costs are charged by us (the packed lunch is the family's).

**Open:** the forms currently carry the registered company address from
`src/pages/impressum.astro` (Gleiwitzer Str. 6-d, 81929 München). If the
business is now seated in Minden, that address — and the imprint — must change
before a Jobcenter sees it.

## Contact

Amt proArbeit (Jobcenter Minden)
Lindenstraße 4–6, 32423 Minden
Telefon 0571 807 10 000

We do not send families to the Jobcenter without the Kostenbescheinigung in
hand.
