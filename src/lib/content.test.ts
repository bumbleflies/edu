import { describe, it, expect } from 'vitest';
import { content } from './content';

describe('homepage content', () => {
  it('carries the bumble:futurespace identity string in both languages', () => {
    expect(content.en.title).toContain('bumble:futurespace');
    expect(content.de.title).toContain('bumble:futurespace');
  });

  it('has 2 courses, 3 steps and 2 trainers in both languages', () => {
    expect(content.en.courses).toHaveLength(2);
    expect(content.de.courses).toHaveLength(2);
    expect(content.en.steps).toHaveLength(3);
    expect(content.de.steps).toHaveLength(3);
    expect(content.en.trainers).toHaveLength(2);
    expect(content.de.trainers).toHaveLength(2);
  });

  it('has matching top-level keys for de and en', () => {
    expect(Object.keys(content.de).sort()).toEqual(Object.keys(content.en).sort());
  });
});

/** The approved flyer copy, pinned so wording changes are deliberate. */
const approvedFlyerCopy = {
  de: {
    heroAlt: 'Kind spielt mit einem freundlichen Roboter',
    sticker: 'Zeig das deinen Eltern!',
    parentLine:
      'Euer Kind hat sich für einen unserer Kurse interessiert. Innen steht alles, was ihr wissen wollt.',
    openHint: 'Aufklappen →',
    experienceLabel: 'Das Erlebnis',
    experienceTitle: 'Das erlebt euer Kind',
    experienceClosing:
      'Nebenbei entstehen neue Freundschaften, es gibt echte Bugs zu lösen, und am Ende sind sie ein Stück selbstbewusster als vorher.',
    parentsLabel: 'Für Eltern',
    parentsTitle: 'Gut aufgehoben',
    flapHint: 'Weiter aufklappen: Kurse, Preise & Team →',
    coursesLabel: 'Die Kurse',
    coursesTitle: 'Welcher Kurs passt?',
    priceTemplate: '{price} € pro Kurs',
    startFact: 'Start: Oktober 2026',
    locationFact: 'Kurse in eurer Nähe',
    signupTitle: 'Jetzt anmelden',
    signupText: 'QR-Code scannen oder einfach anrufen:',
    qrCaption: 'QR-Code scannen: alle Infos & Anmeldung',
    qrAlt: 'QR-Code zur Website edu.bumbleflies.de',
    smallPrint: '© bumbleflies UG · München · Impressum & Datenschutz: edu.bumbleflies.de/impressum',
    outsideLabel: 'Außenseite · Druckseite 1',
    insideLabel: 'Innenseite · Druckseite 2',
    printHint:
      'Beidseitig drucken (an der kurzen Kante wenden). Falten (Wickelfalz): Innenseite nach oben, zuerst das rechte Drittel einklappen, dann das linke darüberlegen.',
  },
  en: {
    heroAlt: 'Child playing with a friendly robot',
    sticker: 'Show this to your parents!',
    parentLine:
      "Your child showed interest in one of our courses. Inside you'll find everything you'd like to know.",
    openHint: 'Open up →',
    experienceLabel: 'The experience',
    experienceTitle: 'What your child will experience',
    experienceClosing:
      'Along the way they make friends, hit real bugs, fix them, and walk away a little more confident than when they started.',
    parentsLabel: 'For parents',
    parentsTitle: 'In good hands',
    flapHint: 'Keep unfolding: courses, prices & team →',
    coursesLabel: 'The courses',
    coursesTitle: 'Which course fits?',
    priceTemplate: '€{price} per course',
    startFact: 'Start: October 2026',
    locationFact: 'Courses near you',
    signupTitle: 'Sign up now',
    signupText: 'Scan the QR code or just call:',
    qrCaption: 'Scan the QR code for all info & sign-up',
    qrAlt: 'QR code linking to edu.bumbleflies.de/en/',
    smallPrint: '© bumbleflies UG · Munich · Imprint & privacy: edu.bumbleflies.de/en/imprint',
    outsideLabel: 'Outside · print page 1',
    insideLabel: 'Inside · print page 2',
    printHint:
      'Print double-sided (flip on the short edge). Letter-fold: inside facing up, fold the right third in first, then the left third over it.',
  },
} as const;

describe('flyer content block', () => {
  it('exists in both languages with identical keys', () => {
    expect(content.de.flyer).toBeDefined();
    expect(content.en.flyer).toBeDefined();
    expect(Object.keys(content.de.flyer).sort()).toEqual(Object.keys(content.en.flyer).sort());
  });

  it('has no empty strings in either language', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const [key, value] of Object.entries(content[lang].flyer)) {
        expect(value, `${lang}.flyer.${key}`).toBeTruthy();
      }
    }
  });

  it('carries exactly the approved German copy', () => {
    expect(content.de.flyer).toEqual(approvedFlyerCopy.de);
  });

  it('carries exactly the approved English copy', () => {
    expect(content.en.flyer).toEqual(approvedFlyerCopy.en);
  });

  it('addresses German parents informally (ihr/euer), never formally', () => {
    for (const [key, value] of Object.entries(content.de.flyer)) {
      expect(value, `de.flyer.${key}`).not.toMatch(/\bSie\b|\bIhr(e[mnrs]?)?\b/);
    }
  });

  it('announces the start month only, with no day and no venue', () => {
    expect(content.de.flyer.startFact).toContain('Oktober 2026');
    expect(content.en.flyer.startFact).toContain('October 2026');
    expect(content.de.flyer.startFact).not.toMatch(/\d+\.\s*Oktober/);
    expect(content.en.flyer.startFact).not.toMatch(/October\s+\d{1,2}(?!\d)/);
    expect(content.en.flyer.startFact).not.toMatch(/\d{1,2}(st|nd|rd|th)?\s+October/);
  });

  it('has a {price} placeholder in the price template', () => {
    expect(content.de.flyer.priceTemplate).toContain('{price}');
    expect(content.en.flyer.priceTemplate).toContain('{price}');
  });

  it('explains how to print and fold in both languages', () => {
    expect(content.de.flyer.printHint).toContain('Wickelfalz');
    expect(content.en.flyer.printHint).toContain('Letter-fold');
  });

  it('never claims that kids keep or take home the robot', () => {
    const forbidden = /behalten|mitnehmen|mit nach Hause|to keep|take home|take-home/i;
    for (const lang of ['de', 'en'] as const) {
      for (const [key, value] of Object.entries(content[lang].flyer)) {
        expect(value, `${lang}.flyer.${key}`).not.toMatch(forbidden);
      }
    }
  });
});
