import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentTime } from "./useCurrentTime";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCurrentTime", () => {
  it("returns a Date instance immediately", () => {
    const { result } = renderHook(() => useCurrentTime(1000));
    expect(result.current).toBeInstanceOf(Date);
  });

  it("updates the time after the tick interval elapses", () => {
    const { result } = renderHook(() => useCurrentTime(1000));
    const before = result.current;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).not.toBe(before);
  });

  it("does not update before the tick interval has elapsed", () => {
    const { result } = renderHook(() => useCurrentTime(2000));
    const before = result.current;

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current).toBe(before);
  });

  it("clears the interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() => useCurrentTime(1000));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });

  it("restarts the interval when tickIntervalMs changes", () => {
    const { result, rerender } = renderHook(
      ({ ms }: { ms: number }) => useCurrentTime(ms),
      { initialProps: { ms: 1000 } },
    );
    const first = result.current;

    rerender({ ms: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).not.toBe(first);
  });
});
