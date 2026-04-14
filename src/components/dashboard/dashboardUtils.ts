export function getGreeting(date: Date) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function calculateCurrentStreak(percentages: number[], todayIndex: number) {
  let streak = 0;

  for (let index = todayIndex; index >= 0; index -= 1) {
    if (percentages[index] <= 0) {
      break;
    }

    streak += 1;
  }

  return streak;
}
