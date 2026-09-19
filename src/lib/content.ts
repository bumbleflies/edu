import type { Lang } from "./i18n";
import { eventUrlByCourseName } from "./pretix";

export interface Course {
  name: string;
  tag: string;
  age: string;
  duration: string;
  blurb: string;
  outcomes: string[];
  cta: string;
  href: string;
  icon: "blocks" | "code";
  image: string;
}

export interface Step {
  title: string;
  text: string;
  icon: "build" | "code" | "go";
}

export interface AgeCard {
  range: string;
  text: string;
}

export interface Testimonial {
  quote: string;
  name: string;
}

export interface Trainer {
  name: string;
  role: string;
  blurb: string;
  image: string;
}

/**
 * Copy that only appears on the printable parent flyers: the one-page A4
 * flyer (`/flyer`, `/en/flyer`) and the double-sided tri-fold
 * (`/flyer-trifold`, `/en/flyer-trifold`). Both share this block; the fields
 * marked "tri-fold" or "one-page" belong to one flyer only. Everything else on
 * the flyers comes from the shared content fields, so wording stays identical
 * to the website.
 */
export interface FlyerContent {
  heroAlt: string;
  /** Sticker on the cover, aimed at the child holding the flyer. */
  sticker: string;
  /** Cover line addressed to the parents. */
  parentLine: string;
  /** Hint at the bottom of the cover: open the flyer. */
  openHint: string;
  /** Inside-left panel: "what does my child do?" */
  experienceLabel: string;
  experienceTitle: string;
  experienceClosing: string;
  /** Flap panel: "is it a safe choice?" */
  parentsLabel: string;
  parentsTitle: string;
  /** Hint at the bottom of the flap: keep unfolding. */
  flapHint: string;
  /** Inside-centre panel: "which course, when, how much?" */
  coursesLabel: string;
  coursesTitle: string;
  /** Contains a `{price}` placeholder, filled from the pretix course data. */
  priceTemplate: string;
  /** Month only, deliberately no day. */
  startFact: string;
  /** Deliberately no specific venue. */
  locationFact: string;
  /** Sign-up strip in the inside-right panel. */
  signupTitle: string;
  signupText: string;
  qrCaption: string;
  qrAlt: string;
  smallPrint: string;
  /** Screen-only labels above each printed sheet. */
  outsideLabel: string;
  insideLabel: string;
  /** Tri-fold only: screen-only print and fold instructions beside the print button. */
  printHint: string;
  /** One-page only: lead line under the headline, addressed to the parents. */
  onePageLead: string;
  /** One-page only: screen-only one-line print hint beside the print button. */
  onePagePrintHint: string;
}

export interface PageContent {
  title: string;
  description: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTitlePop: string;
  heroSubtitle: string;
  ageCards: AgeCard[];
  courses: Course[];
  steps: Step[];
  whyList: { title: string; text: string }[];
  testimonials: Testimonial[];
  testimonialsDisclaimer: string;
  trainers: Trainer[];
  trainersEyebrow: string;
  trainersTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  flyer: FlyerContent;
}

export const content: Record<Lang, PageContent> = {
  en: {
    title: "bumble:futurespace · Coding & robots for kids",
    description:
      "bumble:futurespace — hands-on programming and robotics courses for kids 8–14 using the mbot2 platform, powered by bumble:education.",
    heroEyebrow: "Kids 8–14 · mbot2 robotics",
    heroTitle: "Build. Code.",
    heroTitlePop: "Make it move.",
    heroSubtitle:
      "Every kid leaves with something they built with their own hands — and the grin that comes with watching it actually work. Along the way they make friends, hit real bugs, fix them, and walk away a little more confident than when they started.",
    ageCards: [
      { range: "8–10", text: "Their first taste of \"I made this\" — a robot that moves because they told it to." },
      { range: "10–12", text: "Real challenges, real teammates. This is where the group high-fives start." },
      { range: "12–14", text: "The jump from \"I can code\" to \"I can build anything.\" Independence they can feel." },
    ],
    courses: [
      {
        name: "Robot Explorer",
        tag: "Beginner · Block coding",
        age: "8–10 years",
        duration: "8 weeks · 1×/week · 60–75 min",
        blurb:
          "No blank-page fear here — a friendly first robot, big colorful blocks, and the moment it finally moves because of something they built.",
        outcomes: ["Logic & sequencing", "Loops & conditionals", "Line-following robot"],
        cta: "Start exploring",
        href: eventUrlByCourseName("Robot Explorer"),
        icon: "blocks",
        image: "/images/course-blocks.webp",
      },
      {
        name: "Code the Machine",
        tag: "Intermediate · Python",
        age: "11–14 years",
        duration: "10 weeks · 1×/week · 90 min",
        blurb:
          "For kids ready to trade blocks for real code — and the pride of watching a program they wrote actually drive a robot through a maze.",
        outcomes: ["Real Python code", "Sensors & IoT", "Autonomous maze robot"],
        cta: "Code the machine",
        href: eventUrlByCourseName("Code the Machine"),
        icon: "code",
        image: "/images/course-code.webp",
      },
    ],
    steps: [
      { title: "Build", text: "Snap your mbot2 together and wire up the sensors.", icon: "build" },
      { title: "Code", text: "Drag blocks or write Python to tell it what to do.", icon: "code" },
      { title: "Go", text: "Hit run and watch your ideas roll across the floor.", icon: "go" },
    ],
    whyList: [
      { title: "Small groups", text: "Every kid has their own robot in class, a coach's attention, and room to ask questions — there are no dumb ones." },
      { title: "Real hardware", text: "Not a screen simulation — a robot they can hold, that listens to them." },
      { title: "No experience needed", text: "Everyone starts at zero and leaves further than they expected." },
      { title: "Parents included", text: "You'll see the wins as they happen, plus a real showcase to watch them show off." },
    ],
    testimonials: [
      { quote: "My daughter built her first obstacle-avoiding robot after four weeks — she couldn't stop smiling.", name: "Anna, mum of Mia (9)" },
      { quote: "The Python course finally made coding click for my son. He's now building his own maze solver.", name: "Tom, dad of Leo (13)" },
    ],
    testimonialsDisclaimer: "Illustrative example quotes — real family reviews coming soon.",
    ctaTitle: "Ready to make something move?",
    ctaSubtitle: "Give them a term to go from curious to capable — and a robot to show for it.",
    trainers: [
      {
        name: "Chris",
        role: "IT nerd · Patient explainer",
        blurb:
          "Our IT nerd with a teacher's patience: he knows every screw in the mbot2 and explains code until it finally clicks. When a kid says \"I built that!\", his day is made.",
        image: "/images/trainer_chris.webp",
      },
      {
        name: "Jördis",
        role: "Team soul · Heart of the group",
        blurb:
          "Our team soul: she reads the room in seconds, knows who needs a nudge and who needs quiet, and turns a bunch of kids into a real team. Every kid leaves feeling seen.",
        image: "/images/trainer_joerdi.webp",
      },
    ],
    trainersEyebrow: "The team",
    trainersTitle: "Who's with your kids along the way",
    flyer: {
      heroAlt: "Child playing with a friendly robot",
      sticker: "Show this to your parents!",
      parentLine:
        "Your child showed interest in one of our courses. Inside you'll find everything you'd like to know.",
      openHint: "Open up →",
      experienceLabel: "The experience",
      experienceTitle: "What your child will experience",
      experienceClosing:
        "Along the way they make friends, hit real bugs, fix them, and walk away a little more confident than when they started.",
      parentsLabel: "For parents",
      parentsTitle: "In good hands",
      flapHint: "Keep unfolding: courses, prices & team →",
      coursesLabel: "The courses",
      coursesTitle: "Which course fits?",
      priceTemplate: "€{price} per course",
      startFact: "Start: October 2026",
      locationFact: "Courses near you",
      signupTitle: "Sign up now",
      signupText: "Scan the QR code or just call:",
      qrCaption: "Scan the QR code for all info & sign-up",
      qrAlt: "QR code linking to edu.bumbleflies.de/en/",
      smallPrint: "© bumbleflies UG · Munich · Imprint & privacy: edu.bumbleflies.de/en/imprint",
      outsideLabel: "Outside · print page 1",
      insideLabel: "Inside · print page 2",
      printHint:
        "Print double-sided (flip on the short edge). Letter-fold: inside facing up, fold the right third in first, then the left third over it.",
      onePageLead:
        "Your child showed interest in one of our courses – here is everything you'd like to know.",
      onePagePrintHint: "Print single-sided on A4 (portrait).",
    },
  },
  de: {
    title: "bumble:futurespace · Programmieren & Roboter für Kinder",
    description:
      "bumble:futurespace — praxisnahe Programmier- und Robotik-Kurse für Kinder von 8–14 Jahren mit der mbot2-Plattform, powered by bumble:education.",
    heroEyebrow: "Kinder 8–14 · mbot2-Robotik",
    heroTitle: "Bauen. Coden.",
    heroTitlePop: "Und es bewegt sich.",
    heroSubtitle:
      "Jedes Kind geht mit etwas nach Hause, das es mit den eigenen Händen gebaut hat – und mit dem Grinsen, das kommt, wenn es wirklich funktioniert. Nebenbei entstehen neue Freundschaften, es gibt echte Bugs zu lösen, und am Ende sind sie ein Stück selbstbewusster als vorher.",
    ageCards: [
      { range: "8–10", text: "Der erste Moment von „Das hab ich gebaut!“ – ein Roboter, der sich bewegt, weil sie es ihm gesagt haben." },
      { range: "10–12", text: "Echte Herausforderungen, echtes Team. Hier gibt's die ersten High-Fives in der Gruppe." },
      { range: "12–14", text: "Der Sprung von „Ich kann coden“ zu „Ich kann alles bauen.“ Unabhängigkeit zum Anfassen." },
    ],
    courses: [
      {
        name: "Roboter-Entdecker",
        tag: "Einsteiger · Block-Programmierung",
        age: "8–10 Jahre",
        duration: "8 Wochen · 1×/Woche · 60–75 Min",
        blurb:
          "Keine Angst vor dem leeren Blatt – ein freundlicher erster Roboter, große bunte Blöcke, und der Moment, in dem er sich bewegt, weil sie ihn gebaut haben.",
        outcomes: ["Logik & Abläufe", "Schleifen & Bedingungen", "Linienfolge-Roboter"],
        cta: "Jetzt entdecken",
        href: eventUrlByCourseName("Roboter-Entdecker"),
        icon: "blocks",
        image: "/images/course-blocks.webp",
      },
      {
        name: "Coding-Abenteurer",
        tag: "Fortgeschritten · Python",
        age: "11–14 Jahre",
        duration: "10 Wochen · 1×/Woche · 90 Min",
        blurb:
          "Für Kids, die von Blöcken zu echtem Code wechseln wollen – und den Stolz erleben, wenn ihr eigenes Programm einen Roboter durchs Labyrinth steuert.",
        outcomes: ["Echter Python-Code", "Sensoren & IoT", "Autonomer Labyrinth-Roboter"],
        cta: "Jetzt coden",
        href: eventUrlByCourseName("Coding-Abenteurer"),
        icon: "code",
        image: "/images/course-code.webp",
      },
    ],
    steps: [
      { title: "Bauen", text: "mbot2 zusammenstecken und Sensoren verkabeln.", icon: "build" },
      { title: "Coden", text: "Blöcke ziehen oder Python schreiben – und sagen, was passieren soll.", icon: "code" },
      { title: "Loslegen", text: "Play drücken und zusehen, wie die eigene Idee über den Boden rollt.", icon: "go" },
    ],
    whyList: [
      { title: "Kleine Gruppen", text: "Jedes Kind hat im Kurs seinen eigenen Roboter, echte Betreuung – und Raum für Fragen, denn dumme Fragen gibt's hier nicht." },
      { title: "Echte Hardware", text: "Keine Bildschirm-Simulation – ein Roboter zum Anfassen, der wirklich reagiert." },
      { title: "Keine Vorkenntnisse nötig", text: "Alle starten bei null und kommen weiter, als sie erwartet hätten." },
      { title: "Eltern inklusive", text: "Ihr seht die Fortschritte live mit – plus eine echte Abschlusspräsentation zum Vorführen." },
    ],
    testimonials: [
      { quote: "Meine Tochter hat nach vier Wochen ihren ersten hindernis-erkennenden Roboter gebaut – sie konnte gar nicht mehr aufhören zu grinsen.", name: "Anna, Mama von Mia (9)" },
      { quote: "Der Python-Kurs hat bei meinem Sohn endlich den Klick ausgelöst. Jetzt baut er seinen eigenen Labyrinth-Löser.", name: "Tom, Papa von Leo (13)" },
    ],
    testimonialsDisclaimer: "Beispielhafte Zitate zur Veranschaulichung – echte Erfahrungsberichte folgen in Kürze.",
    ctaTitle: "Bereit, etwas zum Laufen zu bringen?",
    ctaSubtitle: "Ein Kurs reicht, um aus Neugier echtes Können zu machen – inklusive Roboter zum Vorzeigen.",
    trainers: [
      {
        name: "Chris",
        role: "IT-Nerd · Geduldiger Erklärer",
        blurb:
          "Unser IT-Nerd mit Geduld in der Stimme: Er kennt jede Schraube am mbot2 und erklärt Code so lange, bis es klick macht. Wenn ein Kind sagt „Das hab ich gebaut!“, ist sein Tag gerettet.",
        image: "/images/trainer_chris.webp",
      },
      {
        name: "Jördis",
        role: "Team-Seele · Herz der Gruppe",
        blurb:
          "Unsere Team-Seele: spürt sofort, wer Mut braucht und wer Ruhe, und macht aus einer Gruppe ein echtes Team. Bei ihr fühlt sich jedes Kind gesehen und willkommen.",
        image: "/images/trainer_joerdi.webp",
      },
    ],
    trainersEyebrow: "Das Team",
    trainersTitle: "Wer eure Kinder begleitet",
    flyer: {
      heroAlt: "Kind spielt mit einem freundlichen Roboter",
      sticker: "Zeig das deinen Eltern!",
      parentLine:
        "Euer Kind hat sich für einen unserer Kurse interessiert. Innen steht alles, was ihr wissen wollt.",
      openHint: "Aufklappen →",
      experienceLabel: "Das Erlebnis",
      experienceTitle: "Das erlebt euer Kind",
      experienceClosing:
        "Nebenbei entstehen neue Freundschaften, es gibt echte Bugs zu lösen, und am Ende sind sie ein Stück selbstbewusster als vorher.",
      parentsLabel: "Für Eltern",
      parentsTitle: "Gut aufgehoben",
      flapHint: "Weiter aufklappen: Kurse, Preise & Team →",
      coursesLabel: "Die Kurse",
      coursesTitle: "Welcher Kurs passt?",
      priceTemplate: "{price} € pro Kurs",
      startFact: "Start: Oktober 2026",
      locationFact: "Kurse in eurer Nähe",
      signupTitle: "Jetzt anmelden",
      signupText: "QR-Code scannen oder einfach anrufen:",
      qrCaption: "QR-Code scannen: alle Infos & Anmeldung",
      qrAlt: "QR-Code zur Website edu.bumbleflies.de",
      smallPrint: "© bumbleflies UG · München · Impressum & Datenschutz: edu.bumbleflies.de/impressum",
      outsideLabel: "Außenseite · Druckseite 1",
      insideLabel: "Innenseite · Druckseite 2",
      printHint:
        "Beidseitig drucken (an der kurzen Kante wenden). Falten (Wickelfalz): Innenseite nach oben, zuerst das rechte Drittel einklappen, dann das linke darüberlegen.",
      onePageLead:
        "Euer Kind hat sich für einen unserer Kurse interessiert – hier steht alles, was ihr wissen wollt.",
      onePagePrintHint: "Einseitig auf A4 drucken (Hochformat).",
    },
  },
};
