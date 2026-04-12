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
    <section className="app-panel-dark relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,242,71,0.32),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.1),_transparent_22%)]"
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_20rem]">
        <div className="space-y-6">
          <div className="app-pill border-white/10 bg-white/5 text-white/70">
            Today&apos;s rhythm
          </div>
          <GreetingSection message={message} title={title} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Pace</p>
              <p className="mt-3 text-2xl font-semibold">High focus</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Priority</p>
              <p className="mt-3 text-2xl font-semibold">Deep work</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-[var(--app-accent)]/90 p-4 text-slate-950">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-700">Energy</p>
              <p className="mt-3 text-2xl font-semibold">Sharp</p>
            </div>
          </div>
          <QuoteSection quote={quotes[quoteIndex]} />
        </div>

        <div className="app-grid-glow rounded-[1.8rem] border border-white/10 bg-white/6 p-5">
          <DateTimeSection
            currentDate={currentDate}
            dayOfWeek={dayOfWeek}
            formattedTime={formattedTime}
            period={period}
          />
        </div>
      </div>
    </section>
  );
}

export default WelcomeCard;
