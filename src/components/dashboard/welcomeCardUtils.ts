const MORNING_END_HOUR = 12;
const AFTERNOON_END_HOUR = 17;
const EVENING_END_HOUR = 23;

export function getGreetingContent(date: Date) {
  const hour = date.getHours();

  if (hour < MORNING_END_HOUR) {
    return {
      title: "Rise and shine!",
      message: "Today's a blank page, let's fill it with color!",
    };
  }

  if (hour < AFTERNOON_END_HOUR) {
    return {
      title: "Warm wishes for the afternoon!",
      message: "You're doing great, keep the momentum going!",
    };
  }

  if (hour < EVENING_END_HOUR) {
    return {
      title: "Embrace the evening's calm!",
      message: "Reflect on the day's wins and relax, you've earned it.",
    };
  }

  return {
    title: "Enough working!",
    message: "Time to rest and recharge for another day ahead.",
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
