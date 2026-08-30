export type Lang = "de" | "en";

export interface UiStrings {
  navCourses: string;
  navHow: string;
  navReviews: string;
  bookCourse: string;
  browseCourses: string;
  howItWorks: string;
  footerAboutPrefix: string;
  footerContactTitle: string;
  footerLegalImprint: string;
  footerLegalPrivacy: string;
  flyerTitle: string;
  flyerPrintButton: string;
  videoLanguageNote: string;
}

export const ui: Record<Lang, UiStrings> = {
  en: {
    navCourses: "Courses",
    navHow: "How it works",
    navReviews: "Reviews",
    bookCourse: "Book a course",
    browseCourses: "Browse courses",
    howItWorks: "How it works",
    footerAboutPrefix: "Hands-on programming and robotics courses for kids 8–14,",
    footerContactTitle: "Contact",
    footerLegalImprint: "Imprint",
    footerLegalPrivacy: "Privacy",
    flyerTitle: "Parent flyer",
    flyerPrintButton: "Print / Save as PDF",
    videoLanguageNote: "",
  },
  de: {
    navCourses: "Kurse",
    navHow: "Ablauf",
    navReviews: "Stimmen",
    bookCourse: "Kurs buchen",
    browseCourses: "Kurse ansehen",
    howItWorks: "So läuft's ab",
    footerAboutPrefix: "Programmier- und Robotik-Kurse für Kinder von 8–14 Jahren,",
    footerContactTitle: "Kontakt",
    footerLegalImprint: "Impressum",
    footerLegalPrivacy: "Datenschutz",
    flyerTitle: "Eltern-Flyer",
    flyerPrintButton: "Drucken / Als PDF speichern",
    videoLanguageNote: "Video auf Englisch",
  },
};
