import { describe, expect, it } from "vitest";
import {
  getPercentageWidthClass,
  getPercentageFillClass,
  getBarHeightClass,
} from "./progressStyles";

// ---------------------------------------------------------------------------
// getPercentageWidthClass
// ---------------------------------------------------------------------------

describe("getPercentageWidthClass", () => {
  it("returns w-0 for 0%", () => {
    expect(getPercentageWidthClass(0)).toBe("w-0");
  });

  it("returns w-full for 100%", () => {
    expect(getPercentageWidthClass(100)).toBe("w-full");
  });

  it("returns w-[50%] for 50%", () => {
    expect(getPercentageWidthClass(50)).toBe("w-[50%]");
  });

  it("clamps negative values to 0", () => {
    expect(getPercentageWidthClass(-10)).toBe("w-0");
  });

  it("clamps values above 100 to w-full", () => {
    expect(getPercentageWidthClass(110)).toBe("w-full");
  });

  it("rounds to nearest 5% step", () => {
    // 27 rounds to 25
    expect(getPercentageWidthClass(27)).toBe("w-[25%]");
    // 28 rounds to 30
    expect(getPercentageWidthClass(28)).toBe("w-[30%]");
  });
});

// ---------------------------------------------------------------------------
// getPercentageFillClass
// ---------------------------------------------------------------------------

describe("getPercentageFillClass", () => {
  it("includes the width class", () => {
    const cls = getPercentageFillClass(50);
    expect(cls).toContain("w-[50%]");
  });

  it("merges optional extra className", () => {
    const cls = getPercentageFillClass(50, "bg-blue-500");
    expect(cls).toContain("bg-blue-500");
  });
});

// ---------------------------------------------------------------------------
// getBarHeightClass
// ---------------------------------------------------------------------------

describe("getBarHeightClass", () => {
  it("returns the smallest height class for value 0", () => {
    const cls = getBarHeightClass(0, 100);
    expect(cls).toBe("h-2");
  });

  it("returns the tallest height class for value = maxValue", () => {
    const cls = getBarHeightClass(100, 100);
    expect(cls).toBe("h-16");
  });

  it("returns the smallest class when maxValue is 0 (avoids division by zero)", () => {
    const cls = getBarHeightClass(5, 0);
    expect(cls).toBe("h-2");
  });

  it("returns a mid-range height class for value at 50% of max", () => {
    const cls = getBarHeightClass(50, 100);
    // Mid-range — not the smallest and not the tallest
    expect(cls).not.toBe("h-2");
    expect(cls).not.toBe("h-16");
  });
});
