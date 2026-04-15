/* eslint-disable @rushstack/pair-react-dom-render-unmount */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import type { SearchExecutionResult } from "../../domain/search/contracts/SearchExecutionResult";
import { dummyVerticalConfigs } from "../../infrastructure/config/dummy/verticalConfigs";
import { useSearchPageController } from "./useSearchPageController";

const createExecution = (verticalKey: "all" | "news"): SearchExecutionResult => {
  const vertical = dummyVerticalConfigs.find((item) => item.key === verticalKey) ?? dummyVerticalConfigs[0];

  return {
    kind: "vertical",
    progress: {
      completed: 1,
      delayed: 0,
      description: "Completed",
      empty: 0,
      error: 0,
      items: [],
      loading: 0,
      percent: 100,
      refreshing: 0,
      success: 1,
      title: "Status",
      total: 1
    },
    result: {
      items: [],
      status: "success",
      total: 0,
      vertical
    },
    selectedVertical: vertical
  };
};

type FakeOrchestrator = {
  createPendingExecution: jest.Mock<
    SearchExecutionResult,
    ["all" | "news", typeof dummyVerticalConfigs, string, ("loading" | "delayed")?]
  >;
  execute: jest.Mock<Promise<SearchExecutionResult>, [string, "all" | "news", typeof dummyVerticalConfigs]>;
  executeWithProgress: jest.Mock<
    Promise<SearchExecutionResult>,
    [string, "all" | "news", typeof dummyVerticalConfigs, (((execution: SearchExecutionResult) => void) | undefined)?]
  >;
  initialize: jest.Mock<
    Promise<{
      queryText: string;
      selectedVerticalKey: "all" | "news";
      status: "ready";
      verticals: typeof dummyVerticalConfigs;
    }>,
    [string]
  >;
  syncUrl: jest.Mock<void, [string, "all" | "news", string]>;
  transitionExecutionStatus: jest.Mock<SearchExecutionResult, [SearchExecutionResult, "loading" | "delayed"]>;
};

const createFakeOrchestrator = (): FakeOrchestrator => ({
  createPendingExecution: jest.fn((verticalKey, _verticals, _queryText, status = "loading") => {
    const vertical = dummyVerticalConfigs.find((item) => item.key === verticalKey) ?? dummyVerticalConfigs[0];

    return {
      kind: "vertical",
      progress: {
        completed: 0,
        delayed: status === "delayed" ? 1 : 0,
        description: "Pending",
        empty: 0,
        error: 0,
        items: [],
        loading: status === "loading" ? 1 : 0,
        percent: 0,
        refreshing: 0,
        success: 0,
        title: "Status",
        total: 1
      },
      result: {
        items: [],
        status,
        total: 0,
        vertical
      },
      selectedVertical: vertical
    };
  }),
  execute: jest.fn(async (_queryText, verticalKey, _verticals) => createExecution(verticalKey)),
  executeWithProgress: jest.fn(
    async (_queryText, verticalKey, _verticals, onUpdate) => {
      const execution = createExecution(verticalKey);
      onUpdate?.(execution);
      return execution;
    }
  ),
  initialize: jest.fn(async (_url) => ({
    queryText: "",
    selectedVerticalKey: "all" as const,
    status: "ready" as const,
    verticals: dummyVerticalConfigs
  })),
  syncUrl: jest.fn(),
  transitionExecutionStatus: jest.fn((execution, status) => ({
    ...execution,
    result:
      execution.kind === "vertical"
        ? {
            ...execution.result,
            status
          }
        : {
            items: [],
            status,
            total: 0,
            vertical: execution.selectedVertical
          }
  }))
});

const flushMicrotasks = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

const HookHarness = ({ orchestrator }: { orchestrator: FakeOrchestrator }): React.ReactElement => {
  const controller = useSearchPageController(orchestrator as never);
  const handleType = (): void => {
    controller.onQueryChange("benefits");
  };
  const handleSubmit = (): void => {
    controller.onSearchSubmit().then(
      () => undefined,
      () => undefined
    );
  };
  const handleVerticalChange = (): void => {
    controller.onVerticalChange("news").then(
      () => undefined,
      () => undefined
    );
  };

  return (
    <div>
      <button data-testid="type-query" onClick={handleType} type="button">
        Type
      </button>
      <button data-testid="submit" onClick={handleSubmit} type="button">
        Search
      </button>
      <button data-testid="news-tab" onClick={handleVerticalChange} type="button">
        News
      </button>
      <div data-testid="query-text">{controller.queryText}</div>
      <div data-testid="selected-vertical">{controller.selectedVerticalKey}</div>
    </div>
  );
};

describe("useSearchPageController", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    window.history.replaceState({}, "", "/search.aspx");
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    document.body.removeChild(container);
  });

  it("does not auto-search on typing and executes on submit", async () => {
    const orchestrator = createFakeOrchestrator();

    await act(async () => {
      // eslint-disable-next-line @rushstack/pair-react-dom-render-unmount
      ReactDOM.render(<HookHarness orchestrator={orchestrator} />, container);
      await flushMicrotasks();
    });

    const typeQueryButton = container.querySelector('[data-testid="type-query"]') as HTMLButtonElement;
    const submitButton = container.querySelector('[data-testid="submit"]') as HTMLButtonElement;
    const queryText = container.querySelector('[data-testid="query-text"]') as HTMLDivElement;

    await act(async () => {
      typeQueryButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await flushMicrotasks();
    });

    expect(queryText.textContent).toBe("benefits");
    expect(orchestrator.executeWithProgress).not.toHaveBeenCalled();

    await act(async () => {
      submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await flushMicrotasks();
    });

    expect(orchestrator.executeWithProgress).toHaveBeenCalledTimes(1);
    expect(orchestrator.executeWithProgress).toHaveBeenLastCalledWith(
      "benefits",
      "all",
      dummyVerticalConfigs,
      expect.any(Function)
    );
  });

  it("re-runs the current query when the selected vertical changes", async () => {
    const orchestrator = createFakeOrchestrator();

    await act(async () => {
      // eslint-disable-next-line @rushstack/pair-react-dom-render-unmount
      ReactDOM.render(<HookHarness orchestrator={orchestrator} />, container);
      await flushMicrotasks();
    });

    const typeQueryButton = container.querySelector('[data-testid="type-query"]') as HTMLButtonElement;
    const submitButton = container.querySelector('[data-testid="submit"]') as HTMLButtonElement;
    const newsTabButton = container.querySelector('[data-testid="news-tab"]') as HTMLButtonElement;

    await act(async () => {
      typeQueryButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await flushMicrotasks();
    });

    await act(async () => {
      submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await flushMicrotasks();
    });

    await act(async () => {
      newsTabButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await flushMicrotasks();
    });

    expect(orchestrator.executeWithProgress).toHaveBeenCalledTimes(2);
    expect(orchestrator.executeWithProgress).toHaveBeenLastCalledWith(
      "benefits",
      "news",
      dummyVerticalConfigs,
      expect.any(Function)
    );
    expect(orchestrator.syncUrl).toHaveBeenLastCalledWith("benefits", "news", window.location.href);
  });
});
