import { useEffect, useState } from "react";
import quotes from "./quoteDatas";
import { useRandomIndex } from "../../hooks/useRandomIndex";
import { CheckCircle2, Clock3, Flame } from "lucide-react";
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

  const spotlightItems = [
    { icon: Clock3, label: "Pace", value: "Focused" },
    { icon: CheckCircle2, label: "Mode", value: "Execution" },
    { icon: Flame, label: "Energy", value: "Sharp", accent: true },
  ];

  return (
    <section className="app-panel-dark relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,242,71,0.32),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.1),_transparent_22%)]"
      />

      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_18rem]">
        <div className="space-y-6">
          <div className="app-pill border-white/10 bg-white/5 text-white/85">
            Today
          </div>
          <GreetingSection message={message} title={title} />
          <div className="grid gap-3 sm:grid-cols-3">
            {spotlightItems.map(({ accent, icon: Icon, label, value }) => (
              <div
                key={label}
                className={`rounded-[1.6rem] border p-4 ${
                  accent
                    ? "border-black/5 bg-[var(--app-accent)]/90 text-slate-950"
                    : "border-white/10 bg-white/6 text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`text-xs uppercase tracking-[0.22em] ${
                      accent ? "text-slate-700" : "text-white/65"
                    }`}
                  >
                    {label}
                  </p>
                  <Icon
                    aria-hidden="true"
                    className={`h-4 w-4 ${accent ? "text-slate-800" : "text-white/70"}`}
                  />
                </div>
                <p className="mt-4 text-xl font-semibold">{value}</p>
              </div>
            ))}
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
