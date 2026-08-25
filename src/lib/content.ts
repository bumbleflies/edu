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
  ctaTitle: string;
  ctaSubtitle: string;
}

export const content: Record<Lang, PageContent> = {
  en: {
    title: "edu.bumbleflies.de · Coding & robots for kids",
    description:
      "Bumble Academy — hands-on programming and robotics courses for kids 8–14 using the mbot platform.",
    heroEyebrow: "Kids 8–14 · mbot robotics",
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
      { title: "Build", text: "Snap your mbot together and wire up the sensors.", icon: "build" },
      { title: "Code", text: "Drag blocks or write Python to tell it what to do.", icon: "code" },
      { title: "Go", text: "Hit run and watch your ideas roll across the floor.", icon: "go" },
    ],
    whyList: [
      { title: "Small groups", text: "Every kid gets a robot, a coach's attention, and room to ask questions — there are no dumb ones." },
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
  },
  de: {
    title: "edu.bumbleflies.de · Programmieren & Roboter für Kinder",
    description:
      "Bumble Academy — praxisnahe Programmier- und Robotik-Kurse für Kinder von 8–14 Jahren mit der mbot-Plattform.",
    heroEyebrow: "Kinder 8–14 · mbot-Robotik",
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
        name: "Robot Explorer",
        tag: "Einsteiger · Block-Programmierung",
        age: "8–10 Jahre",
        duration: "8 Wochen · 1×/Woche · 60–75 Min",
        blurb:
          "Keine Angst vor dem leeren Blatt – ein freundlicher erster Roboter, große bunte Blöcke, und der Moment, in dem er sich bewegt, weil sie ihn gebaut haben.",
        outcomes: ["Logik & Abläufe", "Schleifen & Bedingungen", "Linienfolge-Roboter"],
        cta: "Jetzt entdecken",
        href: eventUrlByCourseName("Robot Explorer"),
        icon: "blocks",
        image: "/images/course-blocks.webp",
      },
      {
        name: "Code the Machine",
        tag: "Fortgeschritten · Python",
        age: "11–14 Jahre",
        duration: "10 Wochen · 1×/Woche · 90 Min",
        blurb:
          "Für Kids, die von Blöcken zu echtem Code wechseln wollen – und den Stolz erleben, wenn ihr eigenes Programm einen Roboter durchs Labyrinth steuert.",
        outcomes: ["Echter Python-Code", "Sensoren & IoT", "Autonomer Labyrinth-Roboter"],
        cta: "Jetzt coden",
        href: eventUrlByCourseName("Code the Machine"),
        icon: "code",
        image: "/images/course-code.webp",
      },
    ],
    steps: [
      { title: "Bauen", text: "mbot zusammenstecken und Sensoren verkabeln.", icon: "build" },
      { title: "Coden", text: "Blöcke ziehen oder Python schreiben – und sagen, was passieren soll.", icon: "code" },
      { title: "Loslegen", text: "Play drücken und zusehen, wie die eigene Idee über den Boden rollt.", icon: "go" },
    ],
    whyList: [
      { title: "Kleine Gruppen", text: "Jedes Kind bekommt einen eigenen Roboter, echte Betreuung – und Raum für Fragen, denn dumme Fragen gibt's hier nicht." },
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
  },
};
