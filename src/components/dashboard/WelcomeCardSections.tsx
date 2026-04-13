type GreetingSectionProps = {
    message: string;
    title: string;
};
export function GreetingSection({ message, title }: GreetingSectionProps) {
    return (<div>
      <p>{title}</p>
      <p>{message}</p>
    </div>);
}
type DateTimeSectionProps = {
    currentDate: string;
    dayOfWeek: string;
    formattedTime: string;
    period: string;
};
export function DateTimeSection({ currentDate, dayOfWeek, formattedTime, period, }: DateTimeSectionProps) {
    return (<div>
      <div>
        <p>{dayOfWeek}</p>
        <p>{currentDate}</p>
      </div>

      <div>
        <p>Local time</p>
        <div>
          <span>{formattedTime}</span>
          <span>{period}</span>
        </div>
      </div>
    </div>);
}
type QuoteSectionProps = {
    quote: string;
};
export function QuoteSection({ quote }: QuoteSectionProps) {
    return (<div>
      <p>&quot;{quote}&quot;</p>
    </div>);
}
