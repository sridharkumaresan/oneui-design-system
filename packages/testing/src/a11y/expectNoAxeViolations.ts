// @ts-nocheck
import axe from "axe-core";

const formatViolation = (violation) => {
  const targets = violation.nodes.map((node) => node.target.join(" ")).join(", ");
  return `${violation.id}: ${violation.help} (${targets || "no-target"})`;
};

const runAxeWithJsdomGuard = async (container) => {
  if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
    return axe.run(container);
  }

  const originalGetComputedStyle = window.getComputedStyle.bind(window);

  // axe checks pseudo-elements for color contrast, but jsdom does not implement
  // that branch yet. Fall back to the base element style so tests stay readable.
  window.getComputedStyle = (element, pseudoElement) => {
    if (pseudoElement) {
      return originalGetComputedStyle(element);
    }

    return originalGetComputedStyle(element);
  };

  try {
    return await axe.run(container);
  } finally {
    window.getComputedStyle = originalGetComputedStyle;
  }
};

export const expectNoAxeViolations = async (container) => {
  const results = await runAxeWithJsdomGuard(container);

  if (results.violations.length === 0) {
    return;
  }

  const details = results.violations.map(formatViolation).join("\n");
  throw new Error(`Axe violations found:\n${details}`);
};
