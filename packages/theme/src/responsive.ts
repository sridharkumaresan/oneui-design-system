import {
  oneuiActionCardContainerBreakpoints,
  oneuiBreakpoints,
  type OneUIBreakpointName
} from "@functions-oneui/tokens";

const resolveBreakpoint = (breakpoint: OneUIBreakpointName): string => {
  return oneuiBreakpoints[breakpoint];
};

const prefixContainerName = (containerName?: string): string => {
  return containerName ? `${containerName} ` : "";
};

export const createOneUIMediaQueryUp = (breakpoint: OneUIBreakpointName): string => {
  return `@media (min-width: ${resolveBreakpoint(breakpoint)})`;
};

export const createOneUIMediaQueryDown = (breakpoint: OneUIBreakpointName): string => {
  return `@media (max-width: ${resolveBreakpoint(breakpoint)})`;
};

export const createOneUIContainerQueryUp = (
  breakpoint: OneUIBreakpointName,
  containerName?: string
): string => {
  return `@container ${prefixContainerName(containerName)}(min-width: ${resolveBreakpoint(breakpoint)})`;
};

export const createOneUIContainerQueryDown = (
  breakpoint: OneUIBreakpointName,
  containerName?: string
): string => {
  return `@container ${prefixContainerName(containerName)}(max-width: ${resolveBreakpoint(breakpoint)})`;
};

export { oneuiBreakpoints };
export { oneuiActionCardContainerBreakpoints };
export type { OneUIBreakpointName };
