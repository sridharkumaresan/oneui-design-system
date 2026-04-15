import * as React from "react";

let nextCompatId = 0;
let didApplyCompat = false;

export const ensureReactUseId = (): void => {
  const reactModule = React as typeof React & {
    default?: typeof React & {
      useId?: () => string;
    };
    useId?: () => string;
  };

  if (
    (typeof reactModule.useId === "function" ||
      typeof reactModule.default?.useId === "function") &&
    !didApplyCompat
  ) {
    return;
  }

  if (didApplyCompat) {
    return;
  }

  const createCompatUseId = (): string => {
    const idRef = React.useRef<string | undefined>(undefined);

    if (!idRef.current) {
      nextCompatId += 1;
      idRef.current = `oneui-react17-${nextCompatId}`;
    }

    return idRef.current;
  };

  Object.defineProperty(reactModule, "useId", {
    configurable: true,
    value: createCompatUseId
  });

  if (reactModule.default) {
    Object.defineProperty(reactModule.default, "useId", {
      configurable: true,
      value: createCompatUseId
    });
  }

  didApplyCompat = true;
};
