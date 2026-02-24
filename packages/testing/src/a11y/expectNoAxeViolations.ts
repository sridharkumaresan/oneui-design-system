// @ts-nocheck
import axe from "axe-core";

const formatViolation = (violation) => {
  const targets = violation.nodes.map((node) => node.target.join(" ")).join(", ");
  return `${violation.id}: ${violation.help} (${targets || "no-target"})`;
};

export const expectNoAxeViolations = async (container) => {
  const results = await axe.run(container);

  if (results.violations.length === 0) {
    return;
  }

  const details = results.violations.map(formatViolation).join("\n");
  throw new Error(`Axe violations found:\n${details}`);
};
