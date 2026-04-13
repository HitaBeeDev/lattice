const MORNING_END_HOUR = 12;
const AFTERNOON_END_HOUR = 17;
const EVENING_END_HOUR = 23;

export function getGreetingContent(date: Date) {
  const hour = date.getHours();

  if (hour < MORNING_END_HOUR) {
    return {
      title: "Morning reset",
      message: "Start clean. Protect your best hour.",
    };
  }

  if (hour < AFTERNOON_END_HOUR) {
    return {
      title: "Afternoon push",
      message: "Stay narrow. Finish what matters most.",
    };
  }

  if (hour < EVENING_END_HOUR) {
    return {
      title: "Evening review",
      message: "Close loops. Keep tomorrow lighter.",
    };
  }

  return {
    title: "Day complete",
    message: "Power down and reset for tomorrow.",
  };
}

export function formatWelcomeDate(date: Date) {
  return {
    time: date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .split(" "),
    dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
