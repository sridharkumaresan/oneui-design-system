import type { LoadingSectionConfig } from "@functions-oneui/react-utils/progressive-loading";

export type DemoCardItem = {
  badgeTone?: "brand" | "danger" | "info" | "success" | "warning";
  badgeText?: string;
  eyebrow?: string;
  footerNote?: string;
  helperLinkLabel?: string;
  meta?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  summary: string;
  title: string;
};

type DemoOutcome = "success" | "empty" | "error";

export type DemoSectionSpec = {
  delayMs: number;
  id: string;
  items: DemoCardItem[];
  order?: number;
  outcome: DemoOutcome;
  title: string;
};

const sleep = async (durationMs: number, signal: AbortSignal): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      resolve();
    }, durationMs);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
};

export const createDemoSectionConfigs = (
  specs: DemoSectionSpec[]
): LoadingSectionConfig<DemoCardItem[]>[] => {
  return specs.map((spec) => ({
    getCount: (data) => data.length,
    id: spec.id,
    isEmpty: (data) => data.length === 0,
    loader: async ({ signal }) => {
      await sleep(spec.delayMs, signal);

      if (spec.outcome === "error") {
        throw new Error(`Unable to load ${spec.title.toLowerCase()}.`);
      }

      if (spec.outcome === "empty") {
        return [];
      }

      return spec.items;
    },
    order: spec.order,
    title: spec.title
  }));
};
