type IdleDeadlineLike = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type IdleCallbackLike = (deadline: IdleDeadlineLike) => void;

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleCallbackLike, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export const scheduleIdleTask = (
  callback: () => void,
  timeout = 1500,
): number => {
  if (typeof window === "undefined") {
    return 0;
  }

  const idleWindow = window as IdleWindow;

  if (typeof idleWindow.requestIdleCallback === "function") {
    return idleWindow.requestIdleCallback(() => callback(), { timeout });
  }

  return window.setTimeout(callback, 1);
};

export const cancelIdleTask = (handle: number): void => {
  if (typeof window === "undefined") {
    return;
  }

  const idleWindow = window as IdleWindow;

  if (typeof idleWindow.cancelIdleCallback === "function") {
    idleWindow.cancelIdleCallback(handle);
    return;
  }

  window.clearTimeout(handle);
};
