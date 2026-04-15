import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";

export const dummyVerticalConfigs: VerticalConfig[] = [
  {
    enabled: true,
    isDefault: true,
    key: "all",
    kind: "synthetic-aggregate",
    layoutRegion: "main",
    order: 0,
    query: {
      entityTypes: [],
      templateKey: "synthetic-all"
    },
    resultType: "document",
    rendering: {
      aggregateParticipation: false,
      emptyMessage: "Search across all enterprise sources to surface grouped results.",
      renderingHint: "document-list",
      summarySize: 4,
      dedicatedSize: 4,
      supportsInfiniteScroll: false,
      supportsViewMore: false
    },
    source: {
      scopeType: "custom",
      sourceHint: "synthetic"
    },
    title: "All"
  },
  {
    enabled: true,
    iconName: "BuildingBank24Regular",
    isDefault: false,
    key: "it-hr-colleague-direct",
    kind: "standard",
    layoutRegion: "main",
    order: 1,
    query: {
      entityTypes: ["listItem", "sitePage"],
      filterKeys: ["it", "hr", "colleague-direct"],
      requestedFields: ["title", "summary", "sourceLabel", "modifiedTime"],
      templateKey: "knowledge"
    },
    resultType: "document",
    rendering: {
      aggregateParticipation: true,
      emptyMessage: "No IT, HR, or colleague direct content matched this search.",
      renderingHint: "document-list",
      sectionAccentTone: "brand",
      summarySize: 4,
      dedicatedSize: 10,
      supportsInfiniteScroll: false,
      supportsViewMore: true
    },
    source: {
      futureListKey: "SP_Search_Config",
      scopeType: "tenant",
      sourceHint: "knowledge-sites"
    },
    title: "IT, HR, and Colleague Direct"
  },
  {
    enabled: true,
    iconName: "CalendarLtr24Regular",
    isDefault: false,
    key: "sites-events",
    kind: "standard",
    layoutRegion: "main",
    order: 2,
    query: {
      entityTypes: ["event", "listItem"],
      filterKeys: ["sites", "events"],
      requestedFields: ["title", "summary", "date", "location", "path", "thumbnailUrl"],
      templateKey: "events-sites"
    },
    resultType: "event",
    rendering: {
      aggregateParticipation: true,
      emptyMessage: "No sites or events are available for this search.",
      renderingHint: "event-list",
      sectionAccentTone: "warning",
      summarySize: 3,
      dedicatedSize: 8,
      supportsInfiniteScroll: false,
      supportsViewMore: true
    },
    source: {
      scopeType: "sites",
      sourceHint: "sharepoint-sites-events"
    },
    title: "Sites and events"
  },
  {
    enabled: true,
    iconName: "News24Regular",
    isDefault: false,
    key: "news",
    kind: "standard",
    layoutRegion: "main",
    order: 3,
    query: {
      entityTypes: ["listItem"],
      filterKeys: ["news"],
      requestedFields: ["title", "summary", "date", "path", "thumbnailUrl"],
      templateKey: "news"
    },
    resultType: "news",
    rendering: {
      aggregateParticipation: true,
      emptyMessage: "No Barclays news matched this query.",
      renderingHint: "news-list",
      sectionAccentTone: "danger",
      summarySize: 3,
      dedicatedSize: 8,
      supportsInfiniteScroll: false,
      supportsViewMore: true
    },
    source: {
      scopeType: "tenant",
      sourceHint: "news-hubs"
    },
    title: "News"
  },
  {
    enabled: true,
    iconName: "People24Regular",
    isDefault: false,
    key: "people",
    kind: "standard",
    layoutRegion: "side",
    order: 4,
    query: {
      entityTypes: ["person"],
      filterKeys: ["people"],
      requestedFields: ["displayName", "jobTitle", "officeLocation", "photoUrl"],
      templateKey: "people"
    },
    resultType: "person",
    rendering: {
      aggregateParticipation: true,
      emptyMessage: "No people matched this query.",
      renderingHint: "people-list",
      sectionAccentTone: "success",
      summarySize: 4,
      dedicatedSize: 12,
      supportsInfiniteScroll: false,
      supportsViewMore: true
    },
    source: {
      scopeType: "tenant",
      sourceHint: "graph-people"
    },
    title: "People"
  },
  {
    enabled: true,
    iconName: "GridDots24Regular",
    isDefault: false,
    key: "resources",
    kind: "standard",
    layoutRegion: "side",
    order: 5,
    query: {
      entityTypes: ["externalItem"],
      filterKeys: ["resources"],
      requestedFields: ["title", "summary", "tileLabel"],
      templateKey: "resources"
    },
    resultType: "resource",
    rendering: {
      aggregateParticipation: true,
      emptyMessage: "No resources matched this query.",
      renderingHint: "resource-grid",
      sectionAccentTone: "info",
      summarySize: 6,
      dedicatedSize: 12,
      supportsInfiniteScroll: false,
      supportsViewMore: true
    },
    source: {
      scopeType: "custom",
      sourceHint: "tiles"
    },
    title: "Resources"
  },
  {
    enabled: true,
    iconName: "Document24Regular",
    isDefault: false,
    key: "files",
    kind: "standard",
    layoutRegion: "side",
    order: 6,
    query: {
      entityTypes: ["driveItem"],
      filterKeys: ["files"],
      requestedFields: ["title", "summary", "owner", "extension", "modifiedTime"],
      templateKey: "files"
    },
    resultType: "file",
    rendering: {
      aggregateParticipation: true,
      emptyMessage: "No files matched this query.",
      renderingHint: "file-list",
      sectionAccentTone: "neutral",
      summarySize: 4,
      dedicatedSize: 12,
      supportsInfiniteScroll: true,
      supportsViewMore: true
    },
    source: {
      scopeType: "tenant",
      sourceHint: "graph-drive"
    },
    title: "Files"
  }
];
