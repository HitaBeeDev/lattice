import { useEffect, useRef, useState } from "react";

/**
 * Measures how many task rows fit inside the current list viewport, capped by `maxCount`,
 * and keeps that count in sync as the container resizes.
 */
export function useVisibleTaskCount(maxCount: number): {
  listAreaRef: React.RefObject<HTMLUListElement>;
  sampleRowRef: React.RefObject<HTMLLIElement>;
  visibleCount: number;
} {
  const listAreaRef = useRef<HTMLUListElement>(null);
  const sampleRowRef = useRef<HTMLLIElement>(null);
  const [visibleCount, setVisibleCount] = useState(maxCount);

  useEffect(() => {
    const listArea = listAreaRef.current;
    if (!listArea) return;

    const update = (): void => {
      const rowHeight = sampleRowRef.current?.getBoundingClientRect().height ?? 0;
      const styles = window.getComputedStyle(listArea);
      const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0") || 0;
      const availableHeight = listArea.clientHeight;

      if (rowHeight <= 0 || availableHeight <= 0) return;

      const totalRowSize = rowHeight + rowGap;
      setVisibleCount(
        Math.max(
          Math.min(Math.floor((availableHeight + rowGap) / totalRowSize), maxCount),
          0,
        ),
      );
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(listArea);
    if (sampleRowRef.current) resizeObserver.observe(sampleRowRef.current);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [maxCount]);

  return { listAreaRef, sampleRowRef, visibleCount };
}
