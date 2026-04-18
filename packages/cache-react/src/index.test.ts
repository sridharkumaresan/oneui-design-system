import { describe, expect, it } from "vitest";
import { useCachedResource } from "./index.js";

describe("@functions-oneui/cache-react root exports", () => {
  it("exports the public React cache hook from the package root", () => {
    expect(useCachedResource).toBeTypeOf("function");
  });
});
