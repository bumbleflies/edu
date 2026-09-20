import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ownershipClaim } from '../test-utils/ownership-claim';
import { content } from './content';

describe('homepage content', () => {
  it('carries the bumble:futurespace identity string in both languages', () => {
    expect(content.en.title).toContain('bumble:futurespace');
    expect(content.de.title).toContain('bumble:futurespace');
  });

  it('has 2 courses, 3 steps and 3 trainers in both languages', () => {
    expect(content.en.courses).toHaveLength(2);
    expect(content.de.courses).toHaveLength(2);
    expect(content.en.steps).toHaveLength(3);
    expect(content.de.steps).toHaveLength(3);
    expect(content.en.trainers).toHaveLength(3);
    expect(content.de.trainers).toHaveLength(3);
  });

  it('has matching top-level keys for de and en', () => {
    expect(Object.keys(content.de).sort()).toEqual(Object.keys(content.en).sort());
  });

  it('carries STEM/MINT statements in both languages', () => {
    expect(content.en.title).toContain('STEM');
    expect(content.de.title).toContain('MINT');
    expect(content.en.description).toContain('STEM');
    expect(content.de.description).toContain('MINT');
    expect(content.en.heroEyebrow).toContain('STEM');
    expect(content.de.heroEyebrow).toContain('MINT');
    expect(content.en.heroSubtitle).toContain('STEM');
    expect(content.de.heroSubtitle).toContain('MINT');
    expect(content.en.ctaSubtitle).toContain('STEM');
    expect(content.de.ctaSubtitle).toContain('MINT');
  });

  it('has a STEM/MINT why-item and STEM/MINT outcomes in both languages', () => {
    expect(content.en.whyList.some((w) => w.title.includes('STEM'))).toBe(true);
    expect(content.de.whyList.some((w) => w.title.includes('MINT'))).toBe(true);
    for (const course of content.en.courses) {
      expect(course.outcomes.some((o) => o.includes('STEM'))).toBe(true);
    }
    for (const course of content.de.courses) {
      expect(course.outcomes.some((o) => o.includes('MINT'))).toBe(true);
    }
  });
});

/** The approved flyer copy, pinned so wording changes are deliberate. */
const approvedFlyerCopy = {
  de: {
    heroAlt: 'Kind spielt mit einem freundlichen Roboter',
    kicker: 'Kinder 8–14 · MINT',
    sticker: 'Zeig das deinen Eltern!',
    parentLine:
      'Euer Kind hat sich für einen unserer Kurse interessiert. Innen steht alles, was ihr wissen wollt.',
    openHint: 'Aufklappen →',
    experienceLabel: 'Das Erlebnis',
    experienceTitle: 'Das erlebt euer Kind',
    experienceClosing:
      'Nebenbei entstehen neue Freundschaften, es gibt echte Aufgaben zu lösen, und am Ende sind sie ein Stück selbstbewusster als vorher.',
    parentsLabel: 'Für Eltern',
    parentsTitle: 'Gut aufgehoben',
    flapHint: 'Weiter aufklappen: Kurse, Preise & Team →',
    coursesLabel: 'Die Kurse',
    coursesTitle: 'Welcher Kurs passt?',
    priceTemplate: '{price} € pro Kurs',
    startFact: 'Start: Oktober 2026',
    locationFact: 'Kurse in eurer Nähe',
    signupTitle: 'Jetzt anmelden',
    signupText: 'Oder einfach anrufen:',
    qrCaption: 'Alle Infos & Anmeldung',
    qrAlt: 'QR-Code zur Website edu.bumbleflies.de',
    mbotAlt: 'Der mbot2-Lernroboter mit blauem Chassis und zwei runden Ultraschall-Sensoren',
    photoCredit: 'Foto mbot2: Mattruffoni, Wikimedia Commons, CC BY-SA 4.0',
    smallPrint: '© bumbleflies UG · Impressum & Datenschutz: edu.bumbleflies.de/impressum',
    outsideLabel: 'Außenseite · Druckseite 1',
    insideLabel: 'Innenseite · Druckseite 2',
    printHint:
      'Beidseitig drucken (an der langen Kante wenden). Falten (Wickelfalz): Innenseite nach oben, zuerst das rechte Drittel einklappen, dann das linke darüberlegen.',
    onePageLead:
      'Euer Kind hat sich für einen unserer Kurse interessiert – hier steht alles, was ihr wissen wollt.',
    onePagePrintHint: 'Einseitig auf A4 drucken (Hochformat).',
  },
  en: {
    heroAlt: 'Child playing with a friendly robot',
    kicker: 'Kids 8–14 · STEM',
    sticker: 'Show this to your parents!',
    parentLine:
      "Your child showed interest in one of our courses. Inside you'll find everything you'd like to know.",
    openHint: 'Open up →',
    experienceLabel: 'The experience',
    experienceTitle: 'What your child will experience',
    experienceClosing:
      'Along the way they make friends, take on real challenges, and walk away a little more confident than when they started.',
    parentsLabel: 'For parents',
    parentsTitle: 'In good hands',
    flapHint: 'Keep unfolding: courses, prices & team →',
    coursesLabel: 'The courses',
    coursesTitle: 'Which course fits?',
    priceTemplate: '€{price} per course',
    startFact: 'Start: October 2026',
    locationFact: 'Courses near you',
    signupTitle: 'Sign up now',
    signupText: 'Or just call:',
    qrCaption: 'All info & sign-up',
    qrAlt: 'QR code linking to edu.bumbleflies.de/en/',
    mbotAlt: 'The mbot2 learning robot with a blue chassis and two round ultrasonic sensors',
    photoCredit: 'mbot2 photo: Mattruffoni, Wikimedia Commons, CC BY-SA 4.0',
    smallPrint: '© bumbleflies UG · Imprint & privacy: edu.bumbleflies.de/en/imprint',
    outsideLabel: 'Outside · print page 1',
    insideLabel: 'Inside · print page 2',
    printHint:
      'Print double-sided (flip on the long edge). Letter-fold: inside facing up, fold the right third in first, then the left third over it.',
    onePageLead:
      "Your child showed interest in one of our courses – here is everything you'd like to know.",
    onePagePrintHint: 'Print single-sided on A4 (portrait).',
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

  describe('one-page flyer copy', () => {
    it('has a lead line under the headline that addresses the parents', () => {
      expect(content.de.flyer.onePageLead).toMatch(/^Euer Kind\b/);
      expect(content.de.flyer.onePageLead).toMatch(/\bihr\b/);
      expect(content.en.flyer.onePageLead).toMatch(/^Your child\b/);
    });

    it('keeps the lead free of promises: no price, date or ownership claim', () => {
      for (const lang of ['de', 'en'] as const) {
        expect(content[lang].flyer.onePageLead, lang).not.toMatch(/\d/);
        expect(content[lang].flyer.onePageLead, lang).not.toMatch(ownershipClaim);
      }
    });

    it('has no ownership claim in any copy that appears on a flyer (the robot is only used during the course)', () => {
      for (const lang of ['de', 'en'] as const) {
        const c = content[lang];
        const copy = [
          ...Object.values(c.flyer),
          ...c.whyList.flatMap((item) => [item.title, item.text]),
          ...c.steps.flatMap((step) => [step.title, step.text]),
          ...c.trainers.flatMap((trainer) => [trainer.role, trainer.blurb]),
          ...c.courses.flatMap((course) => [course.blurb, ...course.outcomes]),
        ];
        expect(copy.length).toBeGreaterThan(30);
        for (const line of copy) expect(line, `${lang}: ${line}`).not.toMatch(ownershipClaim);
      }
    });

    it('tells the reader to print single-sided on A4 portrait', () => {
      expect(content.de.flyer.onePagePrintHint).toMatch(/^Einseitig\b.*\bA4\b.*Hochformat/);
      expect(content.en.flyer.onePagePrintHint).toMatch(/^Print single-sided\b.*\bA4\b.*portrait/);
    });

    it('is a one-liner without any folding instructions', () => {
      for (const lang of ['de', 'en'] as const) {
        const hint = content[lang].flyer.onePagePrintHint;
        expect(hint, lang).not.toMatch(/falt|fold|Wickelfalz|beidseitig|double-sided/i);
        expect(hint, lang).not.toContain('\n');
        expect(hint.length, lang).toBeLessThan(80);
      }
    });

    it('does not reuse the tri-fold print hint', () => {
      for (const lang of ['de', 'en'] as const) {
        expect(content[lang].flyer.onePagePrintHint).not.toBe(content[lang].flyer.printHint);
      }
    });
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

describe('flyer copy after the printed-proof review', () => {
  it.each(['de', 'en'] as const)('%s: the cover kicker is a short label, not the site hero sentence', (lang) => {
    const { kicker } = content[lang].flyer;
    expect(kicker.length).toBeLessThan(30);
    expect(kicker).toMatch(/8–14/);
    expect(kicker).toMatch(lang === 'de' ? /MINT/ : /STEM/);
    expect(kicker).not.toMatch(/mbot2/i);
    expect(kicker).not.toBe(content[lang].heroEyebrow);
  });

  it.each(['de', 'en'] as const)('%s: never tells people to scan, because the code is printed right there', (lang) => {
    const f = content[lang].flyer;
    for (const line of [f.qrCaption, f.signupText]) expect(line).not.toMatch(/scan/i);
  });

  it.each(['de', 'en'] as const)('%s: the small print names no city (courses run near the family)', (lang) => {
    expect(content[lang].flyer.smallPrint).not.toMatch(/München|Munich/);
    expect(content[lang].flyer.smallPrint).toContain('bumbleflies UG');
  });

  it.each(['de', 'en'] as const)('%s: the closing line uses no programmer jargon for parents', (lang) => {
    expect(content[lang].flyer.experienceClosing).not.toMatch(/\bbugs?\b/i);
  });

  it.each(['de', 'en'] as const)('%s: the first step says "robot", not the product name', (lang) => {
    const text = content[lang].steps[0].text;
    expect(text).not.toMatch(/mbot2/i);
    expect(text).toMatch(lang === 'de' ? /^Roboter zusammenstecken/ : /robot together/);
  });
});

describe('reassurance cards: four, with hardware and STEM/MINT folded into one', () => {
  it.each(['de', 'en'] as const)('%s: exactly four cards', (lang) => {
    expect(content[lang].whyList).toHaveLength(4);
  });

  it.each(['de', 'en'] as const)('%s: one card covers real hardware and STEM/MINT together', (lang) => {
    const merged = content[lang].whyList.filter((item) =>
      lang === 'de' ? /Hardware/.test(item.title) && /MINT/.test(item.title) : /hardware/i.test(item.title) && /STEM/.test(item.title),
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].text).toMatch(lang === 'de' ? /Sensoren/ : /sensors/);
    expect(merged[0].text).toMatch(lang === 'de' ? /Bildschirm-Simulation/ : /screen simulation/);
    expect(merged[0].text).toMatch(lang === 'de' ? /Mathematik, Informatik, Naturwissenschaft und Technik/ : /science, technology, engineering and math/);
  });

  it.each(['de', 'en'] as const)('%s: no card repeats the hardware or the STEM/MINT idea on its own', (lang) => {
    const titles = content[lang].whyList.map((item) => item.title);
    const standalone = titles.filter((title) =>
      lang === 'de'
        ? /^(Echte Hardware|Praktische MINT-Bildung)$/.test(title)
        : /^(Real hardware|Hands-on STEM education)$/.test(title),
    );
    expect(standalone).toEqual([]);
  });
});

const publicFile = (path: string) => fileURLToPath(new URL(`../../public${path}`, import.meta.url));

describe('team: Thore, the kids specialist (Jördis\' son, 8)', () => {
  it.each(['de', 'en'] as const)('%s: Thore is the third team member after Chris and Jördis', (lang) => {
    expect(content[lang].trainers.map((trainer) => trainer.name)).toEqual(['Chris', 'Jördis', 'Thore']);
  });

  it.each(['de', 'en'] as const)('%s: his role says kids specialist and his age', (lang) => {
    const thore = content[lang].trainers[2];
    expect(thore.role).toMatch(lang === 'de' ? /Kinder-Experte/ : /[Kk]ids specialist/);
    expect(thore.role).toMatch(/\b8\b/);
  });

  it.each(['de', 'en'] as const)('%s: his blurb names his mother and his age and stays short', (lang) => {
    const { blurb } = content[lang].trainers[2];
    expect(blurb).toContain('Jördis');
    expect(blurb).toMatch(lang === 'de' ? /Sohn/ : /\bson\b/);
    expect(blurb).toMatch(/\b8\b/);
    expect(blurb.length).toBeLessThan(140);
  });

  it('every trainer has all four fields and an existing avatar file', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const trainer of content[lang].trainers) {
        for (const value of [trainer.name, trainer.role, trainer.blurb, trainer.image]) expect(value.trim()).not.toBe('');
        expect(existsSync(publicFile(trainer.image)), `${lang}: ${trainer.image}`).toBe(true);
      }
    }
  });

  it("Thore's avatar is a self-contained SVG monogram (no font or external file needed)", () => {
    const svg = readFileSync(publicFile('/images/trainer_thore.svg'), 'utf-8');
    expect(svg).toMatch(/<svg[^>]*viewBox="0 0 480 480"/);
    expect(svg).toContain('<path');
    expect(svg).not.toMatch(/<text|<image|href=/);
  });

  it('the machine-readable team list names every trainer', () => {
    const llms = readFileSync(publicFile('/llms-full.txt'), 'utf-8');
    for (const trainer of content.en.trainers) expect(llms, trainer.name).toMatch(new RegExp(`^### ${trainer.name}\\b`, 'm'));
  });
});

describe('mbot2 banner image and its credit', () => {
  it('ships a real, web-sized webp of the mbot2', () => {
    const file = publicFile('/images/mbot2.webp');
    expect(existsSync(file)).toBe(true);
    const size = statSync(file).size;
    expect(size).toBeGreaterThan(10_000);
    expect(size).toBeLessThan(250_000);
    const head = readFileSync(file).subarray(0, 12).toString('latin1');
    expect(head.startsWith('RIFF')).toBe(true);
    expect(head.endsWith('WEBP')).toBe(true);
  });

  it.each(['de', 'en'] as const)('%s: credits the photographer and the licence, as CC BY-SA 4.0 requires', (lang) => {
    const { photoCredit, mbotAlt } = content[lang].flyer;
    expect(photoCredit).toContain('Mattruffoni');
    expect(photoCredit).toContain('CC BY-SA 4.0');
    expect(photoCredit).toContain('Wikimedia Commons');
    expect(mbotAlt).toMatch(/mbot2/);
  });
});

describe('homepage team grid', () => {
  it('centres an odd last trainer card in the two-column grid and un-centres it on the phone', () => {
    const css = readFileSync(fileURLToPath(new URL('../styles/home.css', import.meta.url)), 'utf-8');
    expect(css).toMatch(/\.trainer-card:last-child:nth-child\(odd\)\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
    expect(css).toMatch(/\.trainer-card:last-child:nth-child\(odd\)\s*\{[^}]*justify-self:\s*center/);
    const phone = css.slice(css.indexOf('@media (max-width: 760px)'));
    expect(phone).toMatch(/\.trainer-card:last-child:nth-child\(odd\)\s*\{[^}]*width:\s*auto/);
  });
});
