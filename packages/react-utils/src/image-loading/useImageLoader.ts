import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ImageLoadState, UseImageLoaderOptions, UseImageLoaderResult } from "./types.js";

type ImageSnapshot = Omit<UseImageLoaderResult, "retry">;

const EMPTY_SNAPSHOT: ImageSnapshot = {
  didUseFallback: false,
  state: "empty"
};

const normalizeSrc = (value: string | null | undefined): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const createLoadingSnapshot = (resolvedSrc: string): ImageSnapshot => ({
  didUseFallback: false,
  resolvedSrc,
  state: "loading"
});

export const useImageLoader = (options: UseImageLoaderOptions): UseImageLoaderResult => {
  const [attemptNonce, setAttemptNonce] = useState(0);
  const [snapshot, setSnapshot] = useState<ImageSnapshot>(EMPTY_SNAPSHOT);
  const latestAttemptRef = useRef(0);
  const normalizedSrc = normalizeSrc(options.src);
  const normalizedFallbackSrc = normalizeSrc(options.fallbackSrc);
  const candidateSources = useMemo(
    () =>
      Array.from(
        new Set([normalizedSrc, normalizedFallbackSrc].filter((value): value is string => Boolean(value)))
      ),
    [normalizedFallbackSrc, normalizedSrc]
  );

  useEffect(() => {
    if (candidateSources.length === 0) {
      setSnapshot(EMPTY_SNAPSHOT);
      return;
    }

    if (typeof Image !== "function") {
      setSnapshot({
        didUseFallback: false,
        error: "Image loading is unavailable in this environment.",
        resolvedSrc: candidateSources[0],
        state: "error"
      });
      return;
    }

    let cancelled = false;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    let activeImage: HTMLImageElement | undefined;
    const attemptId = latestAttemptRef.current + 1;
    latestAttemptRef.current = attemptId;

    const finalize = (nextSnapshot: ImageSnapshot) => {
      if (cancelled || latestAttemptRef.current !== attemptId) {
        return;
      }

      setSnapshot(nextSnapshot);
    };

    const clearPendingTimeout = () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = undefined;
      }
    };

    const loadCandidate = (index: number) => {
      const candidateSrc = candidateSources[index];

      if (!candidateSrc) {
        finalize({
          didUseFallback: candidateSources.length > 1,
          error: "Unable to load image.",
          resolvedSrc: candidateSources[candidateSources.length - 1],
          state: "error"
        });
        return;
      }

      finalize({
        ...createLoadingSnapshot(candidateSrc),
        didUseFallback: index > 0
      });

      const image = new Image();
      activeImage = image;

      if (options.crossOrigin !== undefined) {
        image.crossOrigin = options.crossOrigin;
      }

      if (options.referrerPolicy !== undefined) {
        image.referrerPolicy = options.referrerPolicy;
      }

      image.onload = async () => {
        clearPendingTimeout();

        if (options.decode !== false && typeof image.decode === "function") {
          try {
            await image.decode();
          } catch {
            // Ignore decode failures and continue with the loaded asset.
          }
        }

        finalize({
          didUseFallback: index > 0,
          height: image.naturalHeight,
          resolvedSrc: candidateSrc,
          state: "loaded",
          width: image.naturalWidth
        });
      };

      image.onerror = () => {
        clearPendingTimeout();

        if (index + 1 < candidateSources.length) {
          loadCandidate(index + 1);
          return;
        }

        finalize({
          didUseFallback: index > 0,
          error: "Unable to load image.",
          resolvedSrc: candidateSrc,
          state: "error"
        });
      };

      if (typeof options.timeoutMs === "number" && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
        timeoutHandle = setTimeout(() => {
          image.onerror?.(new Event("timeout"));
        }, options.timeoutMs);
      }

      image.src = candidateSrc;
    };

    loadCandidate(0);

    return () => {
      cancelled = true;
      clearPendingTimeout();

      if (activeImage) {
        activeImage.onload = null;
        activeImage.onerror = null;
      }
    };
  }, [
    attemptNonce,
    candidateSources,
    options.crossOrigin,
    options.decode,
    options.referrerPolicy,
    options.timeoutMs
  ]);

  const retry = useCallback(() => {
    setAttemptNonce((value) => value + 1);
  }, []);

  return {
    ...snapshot,
    retry
  };
};
