import React from "react";
import { Spinner, tokens, useFluent } from "@fluentui/react-components";
import { OneUIBadge, OneUIButton, OneUIHeading, OneUIText } from "@functions-oneui/atoms";
import { createCacheEngine, createMemoryCacheStorageAdapter } from "@functions-oneui/cache";

const createEngineCode = `import {
  createCacheEngine,
  createIndexedDbCacheAdapter
} from "@functions-oneui/cache";

const engine = createCacheEngine({
  storage: createIndexedDbCacheAdapter({
    databaseName: "oneui-resource-cache",
    storeName: "resources"
  }),
  defaultPolicy: {
    staleTimeMs: 30_000,
    expireTimeMs: 10 * 60_000,
    version: "resource-contract-v1"
  }
});`;

const coreReadCode = `const result = await engine.getOrFetchSnapshot(
  {
    namespace: "weather",
    key: "london",
    segments: {
      tenant: "barclays",
      site: "enterprise-search"
    }
  },
  fetchWeather,
  {
    staleTimeMs: 30_000,
    expireTimeMs: 10 * 60_000,
    version: "weather-v1"
  }
);

result.source; // "cache" | "network" | "none"
result.state;  // "fresh" | "stale" | "expired" | "missing"
result.data;`;

const reactHookCode = `import { useCachedResource } from "@functions-oneui/cache-react";

const weather = useCachedResource({
  engine,
  scope,
  fetcher: fetchWeather,
  policy,
  refreshIntervalMs: 60_000,
  refreshWhenVisibleOnly: true,
  revalidateIfStale: true,
  revalidateOnVisible: true,
  keepStaleDataOnError: true
});`;

const invalidationCode = `await engine.remove(scope);

await engine.invalidate({
  namespace: "weather",
  segments: {
    tenant: "barclays",
    site: "enterprise-search"
  }
});

await engine.clear();`;

const bustingCode = `const scope = {
  namespace: "weather",
  key: "london",
  segments: { app: "storybook" }
};

await engine.set(scope, { temperature: 20 }, {
  version: "weather-v1"
});

// Later, after a resource contract changes:
await engine.getOrFetchSnapshot(scope, fetchWeather, {
  version: "weather-v2",
  bustOnVersionChange: true
});

// The v1 record is removed, a "busted" event is emitted,
// and the fetcher supplies a v2-compatible record.`;

const customAdapterCode = `type CacheStorageAdapter<TData> = {
  id: string;
  kind: string;
  get(storageKey): Promise<CacheRecord<TData> | undefined>;
  set(record): Promise<void>;
  remove(storageKey): Promise<void>;
  clear(): Promise<void>;
  list(partialScope?): Promise<Array<CacheRecord<TData>>>;
  clearByScope?(partialScope): Promise<number>;
  isAvailable?(): Promise<boolean> | boolean;
};`;

const useStoryTheme = () => {
  const fluent = useFluent();

  return fluent.theme ?? tokens;
};

const useStyles = () => {
  const theme = useStoryTheme();

  return {
    theme,
    page: {
      background: theme.colorNeutralBackground1,
      color: theme.colorNeutralForeground1,
      margin: "0 auto",
      maxWidth: "1120px",
      padding: "32px 24px 56px"
    },
    stack: {
      display: "grid",
      gap: theme.spacingVerticalXXL
    },
    section: {
      display: "grid",
      gap: theme.spacingVerticalM
    },
    panel: {
      background: theme.colorNeutralBackground1,
      border: `1px solid ${theme.colorNeutralStroke2}`,
      boxSizing: "border-box",
      display: "grid",
      gap: theme.spacingVerticalS,
      padding: theme.spacingHorizontalL
    },
    code: {
      background: theme.colorNeutralBackground2,
      border: `1px solid ${theme.colorNeutralStroke2}`,
      boxSizing: "border-box",
      color: theme.colorNeutralForeground1,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.86rem",
      lineHeight: 1.55,
      margin: 0,
      overflowX: "auto",
      padding: theme.spacingHorizontalM,
      whiteSpace: "pre"
    },
    grid: {
      display: "grid",
      gap: theme.spacingHorizontalM,
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
    },
    twoColumn: {
      display: "grid",
      gap: theme.spacingHorizontalL,
      gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))"
    },
    buttonRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacingHorizontalS
    },
    statusGrid: {
      display: "grid",
      gap: theme.spacingHorizontalM,
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
    },
    list: {
      display: "grid",
      gap: theme.spacingVerticalS,
      margin: 0,
      paddingInlineStart: "1.25rem"
    },
    table: {
      border: `1px solid ${theme.colorNeutralStroke2}`,
      borderCollapse: "collapse",
      width: "100%"
    },
    tableCell: {
      border: `1px solid ${theme.colorNeutralStroke2}`,
      padding: `${theme.spacingVerticalS} ${theme.spacingHorizontalM}`,
      textAlign: "left",
      verticalAlign: "top"
    }
  };
};

const Section = ({ children, eyebrow, title }) => {
  const styles = useStyles();

  return (
    <section style={styles.section}>
      <div style={{ display: "grid", gap: styles.theme.spacingVerticalXS }}>
        {eyebrow ? (
          <OneUIBadge appearance="outlined" tone="brand">
            {eyebrow}
          </OneUIBadge>
        ) : null}
        <OneUIHeading level={2}>{title}</OneUIHeading>
      </div>
      {children}
    </section>
  );
};

const Panel = ({ children }) => {
  const styles = useStyles();

  return <div style={styles.panel}>{children}</div>;
};

const CodeBlock = ({ children }) => {
  const styles = useStyles();

  return <pre style={styles.code}>{children}</pre>;
};

const Feature = ({ children, title, tone = "brand" }) => (
  <Panel>
    <OneUIBadge appearance="soft" tone={tone}>
      {title}
    </OneUIBadge>
    <OneUIText>{children}</OneUIText>
  </Panel>
);

const Rows = ({ rows }) => {
  const styles = useStyles();

  return (
    <table style={styles.table}>
      <tbody>
        {rows.map(([name, detail]) => (
          <tr key={name}>
            <th scope="row" style={{ ...styles.tableCell, width: "32%" }}>
              <OneUIText weight="semibold">{name}</OneUIText>
            </th>
            <td style={styles.tableCell}>
              <OneUIText>{detail}</OneUIText>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StateCard = ({ description, state }) => {
  const styles = useStyles();

  return (
    <Panel>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <OneUIBadge appearance="outlined" tone={state === "error" ? "warning" : "info"}>
          {state}
        </OneUIBadge>
        {state === "refreshing" ? <Spinner aria-label="Refreshing" size="extra-tiny" /> : null}
        {state === "error" ? (
          <span
            aria-label="Refresh failed"
            role="img"
            style={{ color: styles.theme.colorPaletteDarkOrangeForeground1 }}
          >
            !
          </span>
        ) : null}
      </div>
      <OneUIText>{description}</OneUIText>
    </Panel>
  );
};

const liveScope = {
  key: "london",
  namespace: "weather",
  segments: {
    app: "storybook",
    demo: "cache-busting"
  }
};

const createLiveResource = (version, source) => ({
  condition: source === "network" ? "Updated from fetcher" : "Seeded cache record",
  temperature: version === "weather-v2" ? 22 : 20,
  updatedAt: new Date().toLocaleTimeString(),
  version
});

const CacheBustingDemo = () => {
  const styles = useStyles();
  const engine = React.useMemo(
    () =>
      createCacheEngine({
        storage: createMemoryCacheStorageAdapter()
      }),
    []
  );
  const fetchCountRef = React.useRef(0);
  const [selectedVersion, setSelectedVersion] = React.useState("weather-v1");
  const [snapshot, setSnapshot] = React.useState();
  const [result, setResult] = React.useState();
  const [events, setEvents] = React.useState([]);
  const [isBusy, setIsBusy] = React.useState(false);

  React.useEffect(
    () =>
      engine.subscribe((event) => {
        setEvents((current) =>
          [
            {
              name: event.name,
              reason: event.reason,
              time: new Date(event.timestamp).toLocaleTimeString()
            },
            ...current
          ].slice(0, 6)
        );
      }),
    [engine]
  );

  const refreshSnapshot = React.useCallback(async () => {
    setSnapshot(await engine.getSnapshot(liveScope));
  }, [engine]);

  React.useEffect(() => {
    refreshSnapshot();
  }, [refreshSnapshot]);

  const runAction = React.useCallback(async (action) => {
    setIsBusy(true);
    try {
      await action();
    } finally {
      setIsBusy(false);
    }
  }, []);

  const policyFor = React.useCallback(
    (version) => ({
      expireTimeMs: 5 * 60_000,
      staleTimeMs: 60_000,
      version,
      bustOnVersionChange: true
    }),
    []
  );

  const seedVersionOne = () =>
    runAction(async () => {
      await engine.set(liveScope, createLiveResource("weather-v1", "seed"), policyFor("weather-v1"));
      setSelectedVersion("weather-v1");
      setResult({
        data: createLiveResource("weather-v1", "seed"),
        source: "manual set",
        state: "fresh"
      });
      await refreshSnapshot();
    });

  const readSelectedVersion = () =>
    runAction(async () => {
      const next = await engine.getOrFetchSnapshot(
        liveScope,
        async () => {
          fetchCountRef.current += 1;
          return createLiveResource(selectedVersion, "network");
        },
        policyFor(selectedVersion)
      );
      setResult(next);
      await refreshSnapshot();
    });

  const switchToVersionTwo = () => {
    setSelectedVersion("weather-v2");
    setResult((current) => ({
      ...current,
      source: "version changed; read again to validate busting",
      state: current?.state ?? "fresh"
    }));
  };

  const invalidateDemoScope = () =>
    runAction(async () => {
      await engine.invalidate({ namespace: "weather", segments: { app: "storybook" } });
      setResult({
        source: "invalidated",
        state: "missing"
      });
      await refreshSnapshot();
    });

  const clearDemoCache = () =>
    runAction(async () => {
      await engine.clear();
      setResult({
        source: "cleared",
        state: "missing"
      });
      await refreshSnapshot();
    });

  const visibleRecord = result?.data ?? snapshot?.record?.data;

  return (
    <Panel>
      <div style={{ display: "grid", gap: styles.theme.spacingVerticalM }}>
        <div style={styles.buttonRow}>
          <OneUIButton appearance="primary" disabled={isBusy} onClick={seedVersionOne}>
            Seed v1 cache
          </OneUIButton>
          <OneUIButton appearance="secondary" disabled={isBusy} onClick={readSelectedVersion}>
            Read selected version
          </OneUIButton>
          <OneUIButton appearance="secondary" disabled={isBusy} onClick={switchToVersionTwo}>
            Switch policy to v2
          </OneUIButton>
          <OneUIButton appearance="secondary" disabled={isBusy} onClick={invalidateDemoScope}>
            Invalidate weather
          </OneUIButton>
          <OneUIButton appearance="secondary" disabled={isBusy} onClick={clearDemoCache}>
            Clear demo cache
          </OneUIButton>
        </div>

        <div style={styles.statusGrid}>
          <Panel>
            <OneUIBadge appearance="outlined" tone="brand">
              selected policy
            </OneUIBadge>
            <OneUIText weight="semibold">{selectedVersion}</OneUIText>
          </Panel>
          <Panel>
            <OneUIBadge appearance="outlined" tone="info">
              current snapshot
            </OneUIBadge>
            <OneUIText weight="semibold">{snapshot?.state ?? "missing"}</OneUIText>
          </Panel>
          <Panel>
            <OneUIBadge appearance="outlined" tone="success">
              last source
            </OneUIBadge>
            <OneUIText weight="semibold">{result?.source ?? "none"}</OneUIText>
          </Panel>
          <Panel>
            <OneUIBadge appearance="outlined" tone="warning">
              fetches
            </OneUIBadge>
            <OneUIText weight="semibold">{fetchCountRef.current}</OneUIText>
          </Panel>
        </div>

        <div style={styles.twoColumn}>
          <Panel>
            <OneUIHeading level={3}>Visible resource</OneUIHeading>
            {visibleRecord ? (
              <ul style={styles.list}>
                <li>
                  <OneUIText>Version: {visibleRecord.version}</OneUIText>
                </li>
                <li>
                  <OneUIText>Temperature: {visibleRecord.temperature}C</OneUIText>
                </li>
                <li>
                  <OneUIText>{visibleRecord.condition}</OneUIText>
                </li>
              </ul>
            ) : (
              <OneUIText tone="secondary">No cached resource exists yet.</OneUIText>
            )}
          </Panel>
          <Panel>
            <OneUIHeading level={3}>Recent events</OneUIHeading>
            {events.length > 0 ? (
              <ul style={styles.list}>
                {events.map((event, index) => (
                  <li key={`${event.time}-${event.name}-${index}`}>
                    <OneUIText>
                      {event.time}: {event.name}
                      {event.reason ? ` (${event.reason})` : ""}
                    </OneUIText>
                  </li>
                ))}
              </ul>
            ) : (
              <OneUIText tone="secondary">Run an action to see cache events.</OneUIText>
            )}
          </Panel>
        </div>

        <OneUIText tone="secondary">
          Validation path: seed v1, read selected version to confirm cache hit, switch policy to v2,
          then read again. The old v1 record is busted and the fetcher supplies v2 data.
        </OneUIText>
      </div>
    </Panel>
  );
};

const coreRows = [
  ["Scope hierarchy", "namespace and key identify the resource. Optional segments add any hierarchy a consumer needs."],
  ["Lifecycle state", "missing, fresh, stale, and expired are resolved by policy and timestamps."],
  ["Request dedupe", "Concurrent fetches for the same storage key share one in-flight request."],
  ["Version busting", "Policy version changes can bust incompatible cached records."],
  ["Events", "Consumers can subscribe to hits, misses, refresh, storage errors, invalidation, busting, and expiry."],
  ["Async contract", "All methods are async so memory, Web Storage, and IndexedDB behave through one API."]
];

const storageRows = [
  ["Memory", "Fast temporary storage for tests, previews, and fallback behavior."],
  ["sessionStorage", "Small JSON-compatible cache that should live only for a browser tab."],
  ["localStorage", "Small JSON-compatible browser persistence."],
  ["IndexedDB", "Recommended durable adapter for structured resource data."],
  ["Custom adapter", "Implement CacheStorageAdapter when a team needs another persistence layer."]
];

const engineRows = [
  ["getSnapshot", "Read lifecycle metadata without starting a network call."],
  ["get", "Read usable cached data with optional policy/version checks."],
  ["set", "Write data and create a full CacheRecord with timestamps and policy metadata."],
  ["getOrFetch", "Return data from cache or network, using in-flight request dedupe."],
  ["getOrFetchSnapshot", "Return data plus source, lifecycle state, and snapshot metadata."],
  ["refresh", "Force a fetch and update storage when possible."],
  ["remove / invalidate / clearByScope / clear", "Clear exact records or broader namespace/key/segment slices."],
  ["subscribe", "Observe cache lifecycle events without coupling to any UI framework."]
];

const reactRows = [
  ["useCachedResource", "Turns engine snapshots into UI-friendly status, data, error, and refresh fields."],
  ["refreshIntervalMs", "Optional scheduled refresh in React. This is not part of the core cache engine."],
  ["refreshWhenVisibleOnly", "Skips scheduled refresh while the document is hidden."],
  ["revalidateOnVisible", "Revalidates when the tab becomes visible again."],
  ["keepStaleDataOnError", "Keeps last good data visible if a background refresh fails."]
];

const contractRows = [
  ["CacheScope", "The identity of a resource: namespace, key, and optional arbitrary segments."],
  ["CachePartialScope", "A partial selector for invalidation and clearing."],
  ["CachePolicy", "Stale time, expiration time, version, bust behavior, and metadata."],
  ["CacheRecord<T>", "Stored data plus timestamps, scope, storage key, version, etag/checksum, and metadata."],
  ["CacheSnapshot<T>", "Read result with scope, storage key, lifecycle state, record, and current time."],
  ["CacheStorageAdapter<T>", "Pluggable persistence contract used by the engine."],
  ["CacheEvent", "Generic event payload for diagnostics, telemetry, and debugging."]
];

const CacheUtilityDocs = () => {
  const styles = useStyles();

  return (
    <main style={styles.page}>
      <div style={styles.stack}>
        <header style={{ display: "grid", gap: styles.theme.spacingVerticalM }}>
          <OneUIBadge appearance="filled" tone="brand">
            Foundation
          </OneUIBadge>
          <OneUIHeading level={1}>Cache utility</OneUIHeading>
          <OneUIText size="lg" tone="secondary">
            The cache utility is a generic resource engine. It is not only browser storage, and the
            core package does not poll. Polling-style scheduled refresh is an optional React adapter
            feature built on top of the core engine.
          </OneUIText>
        </header>

        <Section eyebrow="Offerings" title="What lives where">
          <div style={styles.grid}>
            <Feature title="@functions-oneui/cache" tone="brand">
              Framework-agnostic engine for scoped resources, lifecycle state, request dedupe,
              invalidation, events, and pluggable storage.
            </Feature>
            <Feature title="Storage adapters" tone="info">
              Memory, sessionStorage, localStorage, IndexedDB, and custom adapter support through one
              async contract.
            </Feature>
            <Feature title="@functions-oneui/cache-react" tone="success">
              Optional React hook layer for UI state, background refresh, visible-tab refresh, and
              stale-data-on-error behavior.
            </Feature>
          </div>
        </Section>

        <Section eyebrow="Boundary" title="Core engine vs React refresh">
          <div style={styles.twoColumn}>
            <Panel>
              <OneUIHeading level={3}>Core cache engine</OneUIHeading>
              <ul style={styles.list}>
                <li>
                  <OneUIText>Stores and reads scoped records through a selected adapter.</OneUIText>
                </li>
                <li>
                  <OneUIText>Determines fresh, stale, expired, and missing state.</OneUIText>
                </li>
                <li>
                  <OneUIText>Dedupes concurrent fetches for the same resource.</OneUIText>
                </li>
                <li>
                  <OneUIText>Does not start timers, polling, React effects, or UI work.</OneUIText>
                </li>
              </ul>
            </Panel>
            <Panel>
              <OneUIHeading level={3}>React adapter</OneUIHeading>
              <ul style={styles.list}>
                <li>
                  <OneUIText>Calls the generic engine from React components.</OneUIText>
                </li>
                <li>
                  <OneUIText>Exposes loading, refreshing, empty, stale, and error states.</OneUIText>
                </li>
                <li>
                  <OneUIText>Can run scheduled refresh with `refreshIntervalMs`.</OneUIText>
                </li>
                <li>
                  <OneUIText>Can pause refresh while the tab is hidden.</OneUIText>
                </li>
              </ul>
            </Panel>
          </div>
        </Section>

        <Section eyebrow="Core features" title="Generic capabilities">
          <Rows rows={coreRows} />
        </Section>

        <Section eyebrow="Storage" title="Persistence choices">
          <Rows rows={storageRows} />
          <Panel>
            <OneUIText>
              Storage is selected when creating the engine. Cache policy does not secretly switch
              storage per resource.
            </OneUIText>
          </Panel>
        </Section>

        <Section eyebrow="Contracts" title="Public types consumers can rely on">
          <Rows rows={contractRows} />
          <CodeBlock>{customAdapterCode}</CodeBlock>
        </Section>

        <Section eyebrow="API" title="Engine methods">
          <Rows rows={engineRows} />
        </Section>

        <Section eyebrow="Core usage" title="Create an engine and fetch a resource">
          <div style={styles.twoColumn}>
            <CodeBlock>{createEngineCode}</CodeBlock>
            <CodeBlock>{coreReadCode}</CodeBlock>
          </div>
        </Section>

        <Section eyebrow="Invalidation" title="Clear exact or partial scopes">
          <CodeBlock>{invalidationCode}</CodeBlock>
        </Section>

        <Section eyebrow="Live validation" title="Cache busting and invalidation">
          <div style={styles.twoColumn}>
            <Panel>
              <OneUIHeading level={3}>What this proves</OneUIHeading>
              <ul style={styles.list}>
                <li>
                  <OneUIText>
                    Version-based busting removes incompatible records when `version` changes.
                  </OneUIText>
                </li>
                <li>
                  <OneUIText>
                    Partial invalidation clears matching namespace/key/segment slices.
                  </OneUIText>
                </li>
                <li>
                  <OneUIText>
                    Events expose `hit`, `set`, `busted`, `invalidated`, and `cleared`
                    diagnostics.
                  </OneUIText>
                </li>
              </ul>
            </Panel>
            <CodeBlock>{bustingCode}</CodeBlock>
          </div>
          <CacheBustingDemo />
        </Section>

        <Section eyebrow="React adapter" title="Optional scheduled refresh for React">
          <Rows rows={reactRows} />
          <CodeBlock>{reactHookCode}</CodeBlock>
          <div style={styles.grid}>
            <StateCard
              description="First load with no usable cache should render a skeleton shaped like the final content."
              state="loading"
            />
            <StateCard
              description="Cached data remains visible while the hook runs a scheduled background refresh."
              state="refreshing"
            />
            <StateCard
              description="If refresh fails and stale data exists, keep the data and show a compact failure indicator."
              state="error"
            />
          </div>
        </Section>

        <Section eyebrow="Customization" title="What teams configure">
          <Panel>
            <ul style={styles.list}>
              <li>
                <OneUIText>
                  Resource identity: namespace, key, and optional segments such as tenant/site or
                  any other hierarchy.
                </OneUIText>
              </li>
              <li>
                <OneUIText>Storage adapter: built-in or custom.</OneUIText>
              </li>
              <li>
                <OneUIText>Policy: stale window, expiration window, version, and metadata.</OneUIText>
              </li>
              <li>
                <OneUIText>Fetcher: any async resource loader, not tied to a business domain.</OneUIText>
              </li>
              <li>
                <OneUIText>
                  React-only behavior: scheduled refresh, visible-tab behavior, stale revalidation,
                  and stale-data-on-error.
                </OneUIText>
              </li>
            </ul>
          </Panel>
        </Section>
      </div>
    </main>
  );
};

const meta = {
  title: "Foundation/Cache Utility",
  parameters: {
    docs: {
      disable: true
    },
    layout: "fullscreen",
    options: {
      showPanel: false
    }
  },
  render: () => <CacheUtilityDocs />
};

export default meta;

export const Overview = {};
