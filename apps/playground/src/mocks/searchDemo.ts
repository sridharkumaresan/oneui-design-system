export type SearchDemoSectionId =
  | "news"
  | "sites"
  | "service-now"
  | "it-hr"
  | "people"
  | "resources"
  | "files";

export type SearchDemoVisualState = "loaded" | "loading" | "slow" | "error" | "empty";

export type SearchDemoPresetId = "all-loaded" | "progressive" | "mixed" | "all-loading" | "errors";

export type SearchDemoItem =
  | {
      id: string;
      kind: "article";
      meta: string;
      summary: string;
      tag?: string;
      thumbnailTone?: "campus" | "event" | "insight" | "nature" | "wellness";
      title: string;
    }
  | {
      id: string;
      kind: "person";
      initials: string;
      location: string;
      name: string;
      role: string;
    }
  | {
      id: string;
      kind: "resource";
      color: string;
      label: string;
      shortLabel: string;
    }
  | {
      id: string;
      kind: "file";
      fileType: string;
      meta: string;
      summary: string;
      title: string;
    };

export type SearchDemoSectionFixture = {
  accent: "blue" | "green" | "orange" | "purple" | "red";
  actionsLabel?: string;
  column: "main" | "rail";
  delayedMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
  id: SearchDemoSectionId;
  items: SearchDemoItem[];
  loadingLabel: string;
  order: number;
  title: string;
};

export type SearchDemoTimelineEvent = {
  delayMs: number;
  id: SearchDemoSectionId;
  state: SearchDemoVisualState;
};

export const searchDemoSections: SearchDemoSectionFixture[] = [
  {
    accent: "purple",
    actionsLabel: "View more",
    column: "main",
    id: "news",
    items: [
      {
        id: "news-1",
        kind: "article",
        meta: "Published 2 Mar 2026   4,892 reads",
        summary:
          "New generative AI capabilities rolled out across retail banking to improve response times and personalise customer interactions at scale.",
        tag: "Technology",
        thumbnailTone: "insight",
        title: "Barclays launches AI-powered customer service platform"
      },
      {
        id: "news-2",
        kind: "article",
        meta: "Published 28 Feb 2026   3,102 reads",
        summary:
          "Barclays surpassed its green financing targets by 15%, with continued investment in sustainable funding activity.",
        tag: "Corporate News",
        thumbnailTone: "nature",
        title: "Sustainability report 2025 highlights"
      },
      {
        id: "news-3",
        kind: "article",
        meta: "Published 1 Mar 2026   2,456 reads",
        summary:
          "Full schedule of wellness activities including mindfulness workshops, fitness challenges, and health awareness sessions.",
        tag: "People & Culture",
        thumbnailTone: "wellness",
        title: "Employee wellness month March 2026 activities"
      }
    ],
    loadingLabel: "Fetching news results...",
    order: 1,
    title: "News"
  },
  {
    accent: "green",
    actionsLabel: "View more",
    column: "rail",
    id: "people",
    items: [
      {
        id: "people-1",
        initials: "SM",
        kind: "person",
        location: "London, UK",
        name: "Sarah Mitchell",
        role: "VP, Financial Planning & Analysis"
      },
      {
        id: "people-2",
        initials: "PS",
        kind: "person",
        location: "Bangalore, IN",
        name: "Priya Sharma",
        role: "Director, Digital Architecture"
      },
      {
        id: "people-3",
        initials: "DC",
        kind: "person",
        location: "New York, US",
        name: "David Chen",
        role: "Head of Market Risk Analytics"
      },
      {
        id: "people-4",
        initials: "ER",
        kind: "person",
        location: "Manchester, UK",
        name: "Emma Richardson",
        role: "Senior Operations Manager"
      }
    ],
    loadingLabel: "Fetching people results...",
    order: 2,
    title: "People"
  },
  {
    accent: "orange",
    column: "rail",
    emptyMessage: "No files were found for this source.",
    id: "files",
    items: [
      {
        fileType: "XLSX",
        id: "files-1",
        kind: "file",
        meta: "Modified 3 weeks ago",
        summary: "Quarterly operating metrics and workbook tabs for market planning.",
        title: "Q1 Operating Model"
      },
      {
        fileType: "PPTX",
        id: "files-2",
        kind: "file",
        meta: "Modified yesterday",
        summary: "Client service transformation workstream overview and steering notes.",
        title: "Transformation steering pack"
      }
    ],
    loadingLabel: "Fetching file results...",
    order: 3,
    title: "Files"
  },
  {
    accent: "blue",
    actionsLabel: "View more",
    column: "main",
    id: "sites",
    items: [
      {
        id: "sites-1",
        kind: "article",
        meta: "Organisation   Barclays Connections   Structure",
        summary:
          "If you have any questions about how to get around your new building, the support guide and orientation pack are available here.",
        thumbnailTone: "campus",
        title: "Building orientation & induction"
      },
      {
        id: "sites-2",
        kind: "article",
        meta: "Organisation   Barclays Connections   Who we are",
        summary:
          "Event details and location guidance for the innovation showcase taking place later this month.",
        thumbnailTone: "event",
        title: "Driving innovation to a 24-hour deadline"
      }
    ],
    loadingLabel: "Fetching site results...",
    order: 4,
    title: "Sites & Events"
  },
  {
    accent: "red",
    column: "rail",
    errorMessage: "We couldn't connect to Resources. This may be a temporary issue.",
    id: "resources",
    items: [
      {
        color: "#18398b",
        id: "resources-1",
        kind: "resource",
        label: "Barclays Live",
        shortLabel: "BL"
      },
      {
        color: "#f3b4b9",
        id: "resources-2",
        kind: "resource",
        label: "Barclays Digital Wings",
        shortLabel: "DW"
      },
      {
        color: "#d72a77",
        id: "resources-3",
        kind: "resource",
        label: "Barclays Uniform",
        shortLabel: "BU"
      },
      {
        color: "#0b7a75",
        id: "resources-4",
        kind: "resource",
        label: "Barclays Brand Site",
        shortLabel: "BS"
      },
      {
        color: "#f0bf00",
        id: "resources-5",
        kind: "resource",
        label: "Recognition at Barclays",
        shortLabel: "RA"
      },
      {
        color: "#4f3ac7",
        id: "resources-6",
        kind: "resource",
        label: "Barclays Data Dictionary",
        shortLabel: "DD"
      }
    ],
    loadingLabel: "Fetching resources...",
    order: 5,
    title: "Resources"
  },
  {
    accent: "orange",
    column: "main",
    delayedMessage: "Fetching results from this system. This may take a few seconds.",
    id: "service-now",
    items: [
      {
        id: "sn-1",
        kind: "article",
        meta: "Incident   Updated 3 minutes ago",
        summary: "Password reset and laptop access requests have now been synchronised with enterprise search.",
        title: "ServiceNow requests"
      }
    ],
    loadingLabel: "Fetching results from this system...",
    order: 6,
    title: "ServiceNow"
  },
  {
    accent: "blue",
    column: "main",
    id: "it-hr",
    items: [
      {
        id: "ithr-1",
        kind: "article",
        meta: "IT, HR & Colleague Direct",
        summary: "Access onboarding, colleague policies, payroll guidance, and support pathways from one place.",
        title: "IT, HR & Colleague Direct"
      }
    ],
    loadingLabel: "Fetching results...",
    order: 7,
    title: "IT, HR & Colleague Direct"
  }
];

export const searchDemoPresets: { id: SearchDemoPresetId; label: string }[] = [
  { id: "all-loaded", label: "All Loaded" },
  { id: "progressive", label: "Progressive" },
  { id: "mixed", label: "Mixed" },
  { id: "all-loading", label: "All Loading" },
  { id: "errors", label: "Errors" }
];

export const searchDemoPresetStates: Record<
  SearchDemoPresetId,
  Record<SearchDemoSectionId, SearchDemoVisualState>
> = {
  "all-loaded": {
    files: "loaded",
    "it-hr": "loaded",
    news: "loaded",
    people: "loaded",
    resources: "loaded",
    "service-now": "loaded",
    sites: "loaded"
  },
  "all-loading": {
    files: "loading",
    "it-hr": "loading",
    news: "loading",
    people: "loading",
    resources: "loading",
    "service-now": "loading",
    sites: "loading"
  },
  errors: {
    files: "error",
    "it-hr": "error",
    news: "error",
    people: "error",
    resources: "error",
    "service-now": "error",
    sites: "error"
  },
  mixed: {
    files: "empty",
    "it-hr": "loading",
    news: "loaded",
    people: "slow",
    resources: "error",
    "service-now": "slow",
    sites: "loading"
  },
  progressive: {
    files: "loading",
    "it-hr": "loading",
    news: "loading",
    people: "loading",
    resources: "loading",
    "service-now": "loading",
    sites: "loading"
  }
};

export const searchDemoPresetTimelines: Record<SearchDemoPresetId, SearchDemoTimelineEvent[]> = {
  "all-loaded": searchDemoSections.map((section, index) => ({
    delayMs: 180 + index * 120,
    id: section.id,
    state: "loaded"
  })),
  "all-loading": [],
  errors: searchDemoSections.map((section, index) => ({
    delayMs: 150 + index * 80,
    id: section.id,
    state: "error"
  })),
  mixed: [
    { delayMs: 280, id: "news", state: "loaded" },
    { delayMs: 520, id: "resources", state: "error" },
    { delayMs: 740, id: "files", state: "empty" },
    { delayMs: 940, id: "people", state: "slow" },
    { delayMs: 1180, id: "service-now", state: "slow" },
    { delayMs: 1440, id: "it-hr", state: "loading" },
    { delayMs: 1700, id: "sites", state: "loading" }
  ],
  progressive: [
    { delayMs: 240, id: "news", state: "loaded" },
    { delayMs: 620, id: "resources", state: "error" },
    { delayMs: 920, id: "files", state: "empty" },
    { delayMs: 1220, id: "people", state: "loaded" },
    { delayMs: 1540, id: "service-now", state: "slow" },
    { delayMs: 1880, id: "it-hr", state: "loaded" },
    { delayMs: 2240, id: "sites", state: "loaded" }
  ]
};

export const searchDemoResultStats = {
  end: 24,
  start: 1,
  total: 1247
};
