import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoAxeViolations } from "@functions-oneui/testing";

import { SearchAutocomplete } from "./SearchAutocomplete.js";
import { renderWithOneUIProvider } from "./test/renderWithOneUIProvider.js";

const scopeOptions = [
  { label: "All", value: "all" },
  { label: "People", value: "people" }
] as const;

const suggestions = [
  { description: "Open the employee directory", id: "1", label: "People directory", value: "people directory" },
  { description: "Find knowledge articles", id: "2", label: "Policies", value: "policies" }
];

describe("SearchAutocomplete", () => {
  it("renders the search form and optional suggestions", () => {
    renderWithOneUIProvider(
      <SearchAutocomplete defaultQuery="peo" scopeOptions={[...scopeOptions]} suggestions={suggestions} />
    );

    expect(screen.getByRole("search")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Search query" })).toBeTruthy();
    expect(screen.getByText("People directory")).toBeTruthy();
  });

  it("submits the current query and scope", () => {
    const handleSubmit = vi.fn();

    renderWithOneUIProvider(
      <SearchAutocomplete
        defaultQuery="policies"
        defaultScope="people"
        onSubmit={handleSubmit}
        scopeOptions={[...scopeOptions]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(handleSubmit).toHaveBeenCalledWith({ query: "policies", scope: "people" });
  });

  it("updates the query when a suggestion is selected", () => {
    const handleSuggestionSelect = vi.fn();

    renderWithOneUIProvider(
      <SearchAutocomplete
        defaultQuery="pol"
        onSuggestionSelect={handleSuggestionSelect}
        suggestions={suggestions}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Policies/i }));

    expect((screen.getByRole("textbox", { name: "Search query" }) as HTMLInputElement).value).toBe(
      "policies"
    );
    expect(handleSuggestionSelect).toHaveBeenCalledWith(suggestions[1]);
  });

  it("has no obvious axe violations", async () => {
    const { container } = renderWithOneUIProvider(
      <SearchAutocomplete defaultQuery="pol" scopeOptions={[...scopeOptions]} suggestions={suggestions} />
    );

    await expectNoAxeViolations(container);
  });
});
