import { useEffect, useRef, useState } from "react";
import { cancelIdleTask, scheduleIdleTask } from "../../lib/scheduleIdleTask";

type DeferredSectionProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  rootMargin?: string;
};

export default function DeferredSection({
  children,
  fallback,
  rootMargin = "320px",
}: DeferredSectionProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || typeof window === "undefined") {
      return;
    }

    const element = containerRef.current;

    if (!element) {
      return;
    }

    const reveal = (): void => setShouldRender(true);
    const idleHandle = scheduleIdleTask(reveal, 2000);

    if (!("IntersectionObserver" in window)) {
      return () => cancelIdleTask(idleHandle);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelIdleTask(idleHandle);
    };
  }, [rootMargin, shouldRender]);

  return <div ref={containerRef}>{shouldRender ? children : fallback}</div>;
}
