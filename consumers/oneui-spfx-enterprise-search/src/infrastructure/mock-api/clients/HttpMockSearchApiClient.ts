import type { IMockSearchApiClient } from "../contracts/IMockSearchApiClient";
import type {
  MockSearchConfigResponse,
  MockSearchDebugOptions,
  MockSearchQueryRequest,
  MockSearchQueryResponse
} from "../contracts/MockSearchApiTypes";

const buildDebugQuery = (debugOptions?: MockSearchDebugOptions): string => {
  const params = new URLSearchParams();

  if (typeof debugOptions?.delayMs === "number") {
    params.set("mockDelayMs", String(debugOptions.delayMs));
  }

  if (debugOptions?.status) {
    params.set("mockStatus", debugOptions.status);
  }

  if (debugOptions?.targetVerticalKey) {
    params.set("mockTarget", debugOptions.targetVerticalKey);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
};

const ensureOk = async (response: Response): Promise<Response> => {
  if (response.ok) {
    return response;
  }

  const fallbackMessage = `Mock API request failed with status ${response.status}.`;

  try {
    const body = (await response.json()) as { message?: string };
    throw new Error(body.message ?? fallbackMessage);
  } catch (error) {
    throw error instanceof Error ? error : new Error(fallbackMessage);
  }
};

export class HttpMockSearchApiClient implements IMockSearchApiClient {
  public constructor(
    private readonly baseUrl: string,
    private readonly getDebugOptions?: () => MockSearchDebugOptions | undefined
  ) {}

  public async getConfig(): Promise<MockSearchConfigResponse> {
    const response = await fetch(`${this.baseUrl}/config${buildDebugQuery(this.getDebugOptions?.())}`, {
      headers: {
        Accept: "application/json"
      }
    });

    return (await ensureOk(response)).json() as Promise<MockSearchConfigResponse>;
  }

  public async search(request: MockSearchQueryRequest): Promise<MockSearchQueryResponse> {
    const response = await fetch(`${this.baseUrl}/query${buildDebugQuery(this.getDebugOptions?.())}`, {
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      method: "POST"
    });

    return (await ensureOk(response)).json() as Promise<MockSearchQueryResponse>;
  }
}
