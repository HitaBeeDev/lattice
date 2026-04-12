import { useEffect, useState } from "react";
import quotes from "./quoteDatas";
import { useRandomIndex } from "../../hooks/useRandomIndex";

function WelcomeCard() {
  const quoteIndex = useRandomIndex(quotes.length);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const [timeGreeting, setTimeGreeting] = useState("");
  const [motivationalMessage, setMotivationalMessage] = useState("");

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setTimeGreeting("Rise and shine!");
      setMotivationalMessage("Today's a blank page, let's fill it with color!");
    } else if (hour >= 12 && hour < 17) {
      setTimeGreeting("Warm wishes for the afternoon!");
      setMotivationalMessage("You're doing great, keep the momentum going!");
    } else if (hour >= 17 && hour < 23) {
      setTimeGreeting("Embrace the evening's calm!");
      setMotivationalMessage(
        "Reflect on the day's wins and relax, you've earned it."
      );
    } else {
      setTimeGreeting("Enough working!");
      setMotivationalMessage(
        "Time to rest and recharge for another day ahead."
      );
    }
  }, [currentTime]);

  const formatDate = (date: Date) => {
    return {
      time: date.
      toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).
      split(" "),
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
  };

  const {
    time: [formattedTime, period],
    dayOfWeek,
    date: currentDate
  } = formatDate(currentTime);

  return (
    <div>
      <div>
        <div>
          <p>



            {timeGreeting}
          </p>
          <p>
            {motivationalMessage}
          </p>
        </div>
      </div>

      <div>
        <div>



          <p>
            Oh hey, it's{" "}
            <span>
              {dayOfWeek}
            </span>{" "}
            already!
          </p>

          <p>{currentDate}</p>
        </div>

        <div>
          <div>
            <span>{formattedTime}</span>
            <span>
              {period}
            </span>
          </div>
        </div>
      </div>

      <div>
        <p>
          "{quotes[quoteIndex]}"
        </p>
      </div>
    </div>);

}

export default WelcomeCard;
