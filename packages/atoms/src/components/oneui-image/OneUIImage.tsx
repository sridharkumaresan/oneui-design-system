import React from "react";

import { useImageLoader } from "@functions-oneui/react-utils";

import { useOneUIImageClassNames } from "./OneUIImage.styles.js";
import type { OneUIImageProps } from "./OneUIImage.types.js";

const getAspectRatio = (value: OneUIImageProps["aspectRatio"]): string | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return String(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return undefined;
};

export const OneUIImage = (props: OneUIImageProps): React.JSX.Element => {
  const {
    alt,
    aspectRatio,
    borderRadius,
    className,
    emptyFallback,
    errorFallback,
    fallbackSrc,
    fit = "cover",
    loading = "lazy",
    loadingFallback,
    renderStatus,
    showRetryOnError = false,
    src,
    style,
    timeoutMs,
    ...restProps
  } = props;
  const classNames = useOneUIImageClassNames(className);
  const { resolvedSrc, retry, state } = useImageLoader({
    fallbackSrc,
    src,
    timeoutMs
  });
  const resolvedAspectRatio = getAspectRatio(aspectRatio);
  const rootStyle: React.CSSProperties = {
    ...style,
    aspectRatio: resolvedAspectRatio,
    ...(borderRadius !== undefined ? { borderRadius } : {})
  };
  const customStatus = renderStatus?.({
    resolvedSrc,
    retry,
    state
  });

  return (
    <div className={classNames.root} data-oneui-image="" style={rootStyle}>
      {state === "loaded" && resolvedSrc ? (
        <img
          {...restProps}
          alt={alt}
          className={classNames.image}
          loading={loading}
          src={resolvedSrc}
          style={{
            objectFit: fit
          }}
        />
      ) : null}

      {state === "loading" ? <span aria-hidden="true" className={classNames.skeleton} /> : null}

      {state !== "loaded" ? (
        <div className={classNames.statusLayer}>
          {customStatus ??
            (state === "loading"
              ? loadingFallback ?? <span className={classNames.statusText}>Loading image…</span>
              : state === "empty"
                ? emptyFallback ?? <span className={classNames.statusText}>No image available</span>
                : (
                    <>
                      {errorFallback ?? (
                        <span className={classNames.statusText}>Image unavailable</span>
                      )}
                      {showRetryOnError ? (
                        <button className={classNames.retryButton} onClick={retry} type="button">
                          Retry
                        </button>
                      ) : null}
                    </>
                  ))}
        </div>
      ) : null}
    </div>
  );
};
