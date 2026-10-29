/** Shapes shared by the entry points: meta.ts (product copy), Demo.tsx (phone app) and Landing.tsx (web player). */
export type PreviewTone = "neutral" | "accent" | "positive" | "negative";

/** One person in one situation, and how the product helps them. */
export type UseCase = {
  /** Who, in a few words: "A household on three different services". */
  who: string;
  /** Their situation and what goes wrong today. */
  need: string;
  /** How the product helps. */
  how: string;
  /** Where to see it in the demo. Left out when the demo doesn't show it yet. */
  tryIt?: string;
};

/** A design or engineering choice worth explaining. */
export type Decision = { title: string; body: string };

export type ShowcaseMeta = {
  slug: string;
  /** The product's brand, e.g. "Lowband". */
  name: string;
  /** What kind of product it is, e.g. "Music player". */
  industry: string;
  /** One plain sentence: what the app is for. */
  tagline: string;
  /** Two or three sentences describing the project. */
  summary: string;
  /** Honest maturity label; never implies real users. */
  status: "Concept" | "In progress" | "Lab";
  year: number;
  /** The problem in one or two sentences, before any solution. */
  problem: string;
  /** Concrete people and situations the product is for. */
  useCases: UseCase[];
  /** Choices that shaped the build, each with its reason. */
  decisions: Decision[];
  /** What you can try in the demo, in plain words. */
  features: string[];
  /** The stack a real build would use. */
  stack: string[];
  /** Static summary computed from the seed data. */
  preview: {
    stats: { label: string; value: string }[];
    rows: { primary: string; secondary: string; badge?: { label: string; tone: PreviewTone } }[];
  };
};

export type DemoProps = {
  /** Fixed fixture date; never derived from the clock. */
  today?: string;
  /** Changing it resets the demo to its seed data. */
  resetKey?: number;
  /** Link back to the web player ("← Lowband home"). */
  homeHref?: string;
};

export type LandingProps = {
  /** The player on one address: the web player on desktops, the phone app on phones. */
  playHref: string;
  /** The phone app on any screen. */
  appHref: string;
};
