import type { Lang } from "./i18n";
import { pretix, pretixCourses } from "./pretix";

const SITE = "https://edu.bumbleflies.de";

const DESCRIPTIONS: Record<Lang, Record<number, string>> = {
  en: {
    0: "Build your first mbot2 and make it come alive with colorful drag-and-drop blocks. Hands-on STEM education — no experience needed.",
    1: "Level up from blocks to real Python and command your robot through sensors, lights and sound. Applied STEM education with real hardware.",
  },
  de: {
    0: "Baue deinen ersten mbot2 und erwecke ihn mit bunten Drag-and-Drop-Blöcken zum Leben. Praktische MINT-Bildung — keine Vorkenntnisse nötig.",
    1: "Steig von Blöcken auf echtes Python um und steuere deinen Roboter mit Sensoren, Lichtern und Sound. Angewandte MINT-Bildung mit echter Hardware.",
  },
};

const OUTCOMES: Record<Lang, Record<number, string[]>> = {
  en: {
    0: ["Logic & sequencing", "Loops & conditionals", "Line-following robot", "Applied STEM skills"],
    1: ["Real Python code", "Sensors & IoT", "Autonomous maze robot", "Applied STEM skills"],
  },
  de: {
    0: ["Logik & Abläufe", "Schleifen & Bedingungen", "Linienfolge-Roboter", "Angewandte MINT-Kompetenzen"],
    1: ["Echter Python-Code", "Sensoren & IoT", "Autonomer Labyrinth-Roboter", "Angewandte MINT-Kompetenzen"],
  },
};

export function organizationJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "bumble:futurespace",
    url: SITE,
    description:
      lang === "de"
        ? "Praktische MINT-Bildung: Programmier- und Robotik-Kurse für Kinder von 8–14 Jahren mit der mbot2-Plattform."
        : "Hands-on STEM education: programming and robotics courses for kids 8–14 using the mbot2 platform.",
    parentOrganization: {
      "@type": "Organization",
      name: "bumbleflies",
      url: "https://bumbleflies.de",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Munich",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@bumbleflies.de",
      contactType: "customer service",
      availableLanguage: ["German", "English"],
    },
  };
}

export function courseJsonLd(lang: Lang, courseIndex: number) {
  const course = pretixCourses[courseIndex];
  if (!course) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name[lang],
    description: DESCRIPTIONS[lang][courseIndex],
    provider: {
      "@type": "EducationalOrganization",
      name: "bumble:futurespace",
      url: SITE,
    },
    educationalLevel: courseIndex === 0 ? "Beginner" : "Intermediate",
    teaches: OUTCOMES[lang][courseIndex],
    timeRequired: courseIndex === 0 ? "P8W" : "P10W",
    courseWorkload: courseIndex === 0 ? "PT1H15M" : "PT1H30M",
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "EUR",
      url: `${pretix.host}/${pretix.organizer}/${course.slug}/`,
      availability: "https://schema.org/InStock",
      validFrom: course.startDate,
    },
    inLanguage: lang === "de" ? "de" : "en",
    coursePrerequisite: "No prior experience required",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: "Munich, Germany",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Munich",
          addressCountry: "DE",
        },
      },
      schedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
        startDate: course.startDate,
      },
    },
  };
}
