import { useEffect, useState } from "react";
import quotes from "./quoteDatas";
import { useRandomIndex } from "../../hooks/useRandomIndex";
import {
  DateTimeSection,
  GreetingSection,
  QuoteSection,
} from "./WelcomeCardSections";
import {
  formatWelcomeDate,
  getGreetingContent,
} from "./welcomeCardUtils";

const CLOCK_TICK_INTERVAL_MS = 60_000;

function WelcomeCard() {
  const quoteIndex = useRandomIndex(quotes.length);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, CLOCK_TICK_INTERVAL_MS);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const { title, message } = getGreetingContent(currentTime);
  const {
    time: [formattedTime, period],
    dayOfWeek,
    date: currentDate,
  } = formatWelcomeDate(currentTime);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white shadow-sm">
      <GreetingSection message={message} title={title} />
      <DateTimeSection
        currentDate={currentDate}
        dayOfWeek={dayOfWeek}
        formattedTime={formattedTime}
        period={period}
      />
      <QuoteSection quote={quotes[quoteIndex]} />
    </div>
  );
}

export default WelcomeCard;
