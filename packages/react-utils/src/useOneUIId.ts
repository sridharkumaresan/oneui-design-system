import React from "react";

type ReactWithOptionalUseId = typeof React & {
  useId?: () => string;
};

let fallbackIdCounter = 0;

const createFallbackId = (prefix: string): string => {
  fallbackIdCounter += 1;
  return `${prefix}-${fallbackIdCounter}`;
};

const sanitizeReactId = (reactId: string): string => {
  return reactId.replace(/:/g, "");
};

export const useOneUIId = (prefix = "oneui"): string => {
  const reactModule = React as ReactWithOptionalUseId;
  const nativeUseId = reactModule.useId;
  const fallbackRef = React.useRef<string | undefined>(undefined);

  if (typeof nativeUseId === "function") {
    return `${prefix}-${sanitizeReactId(nativeUseId())}`;
  }

  if (!fallbackRef.current) {
    fallbackRef.current = createFallbackId(prefix);
  }

  return fallbackRef.current;
};
