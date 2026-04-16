import quotes from "./quoteDatas";
import { useRandomIndex } from "../../hooks/useRandomIndex";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { CheckCircle2, Clock3, Flame } from "lucide-react";
import { DateTimeSection, GreetingSection, QuoteSection, } from "./WelcomeCardSections";
import { formatWelcomeDate, getGreetingContent, } from "./welcomeCardUtils";
const CLOCK_TICK_INTERVAL_MS = 60000;

const SPOTLIGHT_ITEMS = [
    { icon: Clock3, label: "Pace", value: "Focused" },
    { icon: CheckCircle2, label: "Mode", value: "Execution" },
    { icon: Flame, label: "Energy", value: "Sharp", accent: true },
] as const;

function WelcomeCard() {
    const quoteIndex = useRandomIndex(quotes.length);
    const currentTime = useCurrentTime(CLOCK_TICK_INTERVAL_MS);
    const { title, message } = getGreetingContent(currentTime);
    const { time: [formattedTime, period], dayOfWeek, date: currentDate, } = formatWelcomeDate(currentTime);
    return (<section>
      <div aria-hidden="true"/>

      <div>
        <div>
          <div>
            Today
          </div>
          <GreetingSection message={message} title={title}/>
          <div>
            {SPOTLIGHT_ITEMS.map(({ icon: Icon, label, value }) => (<div key={label}>
                <div>
                  <p>
                    {label}
                  </p>
                  <Icon aria-hidden="true"/>
                </div>
                <p>{value}</p>
              </div>))}
          </div>
          <QuoteSection quote={quotes[quoteIndex]}/>
        </div>

        <div>
          <DateTimeSection currentDate={currentDate} dayOfWeek={dayOfWeek} formattedTime={formattedTime} period={period}/>
        </div>
      </div>
    </section>);
}
export default WelcomeCard;
