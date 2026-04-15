import type { NormalizedSearchResult } from "../../../domain/search/contracts/SearchResult";
import type { VerticalKey } from "../../../domain/search/models/verticalKey";

const createItem = (
  sourceKey: VerticalKey,
  type: NormalizedSearchResult["type"],
  id: string,
  title: string,
  summary: string,
  metadata: NormalizedSearchResult["metadata"],
  overrides?: Partial<NormalizedSearchResult>
): NormalizedSearchResult => ({
  id,
  metadata,
  sourceKey,
  summary,
  title,
  type,
  url: `https://contoso.sharepoint.com/sites/connections/${id}`,
  ...overrides
});

export const dummySearchData: Record<Exclude<VerticalKey, "all">, NormalizedSearchResult[]> = {
  "it-hr-colleague-direct": [
    createItem(
      "it-hr-colleague-direct",
      "document",
      "bcf-control-framework",
      "Barclays Control Framework",
      "<p>Core <strong>policy guidance</strong>, legal links, and operating expectations for colleague workflows.</p><p>Review the <a href=\"https://contoso.sharepoint.com/policy\">policy hub</a> before sharing updates.</p>",
      {
        audience: "Legal",
        category: "Colleague Direct",
        sourceLabel: "Colleague Direct"
      },
      {
        createdBy: "Connections editorial team",
        modifiedTime: "2026-04-02T12:30:00.000Z"
      }
    ),
    createItem(
      "it-hr-colleague-direct",
      "document",
      "values-and-leadership",
      "Our Mindset, Values and How We Lead (Global)",
      "Guidance on the latest leadership principles, with links to supporting learning and governance material.\n\n- Review the latest expectations\n- Share local examples\n- Complete the manager check-in",
      {
        audience: "HR Hub",
        category: "Policy",
        sourceLabel: "HR Hub"
      },
      {
        createdBy: "HR Editorial",
        modifiedTime: "2026-03-28T09:00:00.000Z"
      }
    ),
    createItem(
      "it-hr-colleague-direct",
      "document",
      "equipment-policy",
      "Barclays value when using your equipment",
      "Policy summary covering acceptable device usage, support routes, and reporting obligations. Review the **acceptable use** guide before travelling and confirm the `policy-first` support route for exceptions.",
      {
        audience: "MyIT",
        category: "Guide",
        sourceLabel: "MyIT"
      },
      {
        createdBy: "MyIT team",
        modifiedTime: "2026-03-20T10:30:00.000Z"
      }
    )
  ],
  "sites-events": [
    createItem(
      "sites-events",
      "event",
      "drumroots-event",
      "International Day for People of African Descent",
      "<p>Celebrate International Day for People of African Descent with a <em>Drumroots</em> workshop in the Tipi.</p><ul><li>Live session</li><li>Guest speakers</li><li>Community networking</li></ul>",
      {
        date: "Thu, 31 Aug 2026, 09:00 - 11:00",
        location: "Tipi",
        path: "Organisation > Radbroke > Events"
      },
      {
        modifiedTime: "2026-04-05T11:00:00.000Z",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1519895609939-279aabf0df89?auto=format&fit=crop&w=640&q=80"
      }
    ),
    createItem(
      "sites-events",
      "event",
      "induction-orientation",
      "Building Orientation & Induction",
      "New starter orientation session covering campus access, safety routes, and local support services.\n\n- Meet reception\n- Collect badge\n- Review safety exits\n- Bring your ID and join the [starter guide](https://contoso.sharepoint.com/sites/connections/starter-guide)",
      {
        date: "Mon, 12 May 2026, 10:00 - 12:00",
        location: "North Tower",
        path: "Organisation > Barclays Connections > Induction"
      },
      {
        modifiedTime: "2026-04-04T14:15:00.000Z",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80"
      }
    )
  ],
  news: [
    createItem(
      "news",
      "news",
      "interfaith-week",
      "Interfaith Celebrations Week",
      "<p>A Barclays Connections feature highlighting <strong>Interfaith Celebrations Week</strong> and colleague-led activities across locations.</p><p>See the <a href=\"https://contoso.sharepoint.com/sites/connections/interfaith\">event schedule</a> for local sessions.</p>",
      {
        category: "News",
        date: "4 Nov 2026",
        path: "Barclays Connections > Manchester > Diversity, Equity and Inclusion"
      },
      {
        modifiedTime: "2026-04-07T07:30:00.000Z",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=640&q=80"
      }
    ),
    createItem(
      "news",
      "news",
      "recognition-story",
      "Recognition Week launches across Barclays campuses",
      "Managers and teams are sharing recognition moments across campuses, with local events and stories published this week. Read the [campaign hub](https://contoso.sharepoint.com/sites/connections/recognition-story) and review the **recognition toolkit** before publishing local stories.",
      {
        category: "News",
        date: "7 Apr 2026",
        path: "Barclays Connections > Recognition"
      },
      {
        modifiedTime: "2026-04-07T12:00:00.000Z",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=640&q=80"
      }
    )
  ],
  people: [
    createItem(
      "people",
      "person",
      "anna-cross",
      "Anna Cross",
      "<p>Group Finance Director</p><p>Executive sponsor for enterprise planning.</p>",
      {
        location: "Head Office",
        presence: "available",
        team: "Finance"
      },
      {
        thumbnailUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80"
      }
    ),
    createItem(
      "people",
      "person",
      "nigel-higgins",
      "Nigel Higgins",
      "Group Chairman",
      {
        location: "Head Office",
        presence: "busy",
        team: "Executive"
      },
      {
        thumbnailUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80"
      }
    ),
    createItem(
      "people",
      "person",
      "venkatakrishnan",
      "C. S. Venkatakrishnan",
      "Group Chief Executive\n\nLeads enterprise strategy and delivery priorities.\n\n- Enterprise transformation\n- Client outcomes\n- Long-term growth",
      {
        location: "Head Office",
        presence: "available",
        team: "Executive"
      },
      {
        thumbnailUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80"
      }
    )
  ],
  resources: [
    createItem(
      "resources",
      "resource",
      "recognition-at-barclays",
      "Recognition at Barclays",
      "Recognition guidance and tools for teams across Barclays. Review the **manager checklist** and local campaign examples before launch.",
      {
        iconAccent: "brand",
        tileLabel: "Recognition"
      }
    ),
    createItem(
      "resources",
      "resource",
      "navigator-timesheet",
      "Navigator Timesheet",
      "<p>Access the current <strong>time recording</strong> experience.</p><p>Use the updated submission flow before Friday cut-off.</p>",
      {
        iconAccent: "info",
        tileLabel: "Timesheets"
      }
    ),
    createItem(
      "resources",
      "resource",
      "password-reset",
      "Password Reset",
      "Reset Barclays credentials and MFA setup with these steps:\n1. Verify identity\n2. Update password\n3. Re-register MFA\n4. Confirm recovery options",
      {
        iconAccent: "warning",
        tileLabel: "Security"
      }
    ),
    createItem(
      "resources",
      "resource",
      "travel-expenses",
      "Travel & Expenses",
      "<div>Manage submissions and approvals for expenses.</div>\n\nUse `policy-first` approval routing for exceptions and review the [expense guide](https://contoso.sharepoint.com/sites/connections/expenses).",
      {
        iconAccent: "accent",
        tileLabel: "Expenses"
      }
    )
  ],
  files: [
    createItem(
      "files",
      "file",
      "controls-deck",
      "Controls Transformation Deck",
      "<p>Latest presentation deck for controls transformation planning.</p><p>Includes updated access notes and review milestones.</p>",
      {
        extension: "pptx",
        owner: "Finance PMO"
      },
      {
        modifiedTime: "2026-04-06T08:45:00.000Z"
      }
    ),
    createItem(
      "files",
      "file",
      "hr-policy-summary",
      "Annual Leave Policy Summary",
      "Readable summary document for annual leave policy and local exceptions. Includes *carry-over* guidance and regional notes.\n\n- Regional leave rules\n- Manager approvals\n- Peak-period exceptions",
      {
        extension: "pdf",
        owner: "HR Policy"
      },
      {
        modifiedTime: "2026-04-01T15:20:00.000Z"
      }
    ),
    createItem(
      "files",
      "file",
      "campus-map",
      "Canary Wharf Campus Guide",
      "<div>Site map, access instructions, and support contacts.</div><div><strong>Preview note:</strong> rich text should collapse to a safe single summary. See [campus services](https://contoso.sharepoint.com/sites/connections/campus-map) for updates.</div>",
      {
        extension: "docx",
        owner: "Corporate Services"
      },
      {
        modifiedTime: "2026-03-29T16:00:00.000Z"
      }
    )
  ]
};
