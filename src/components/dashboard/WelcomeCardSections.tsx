type GreetingSectionProps = {
  message: string;
  title: string;
};

export function GreetingSection({ message, title }: GreetingSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</p>
      <p className="max-w-lg text-sm text-white/80 sm:text-base">{message}</p>
    </div>
  );
}

type DateTimeSectionProps = {
  currentDate: string;
  dayOfWeek: string;
  formattedTime: string;
  period: string;
};

export function DateTimeSection({
  currentDate,
  dayOfWeek,
  formattedTime,
  period,
}: DateTimeSectionProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-10">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">{dayOfWeek}</p>
        <p className="text-sm text-white/80">{currentDate}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-white/40">Local time</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-[-0.06em]">{formattedTime}</span>
          <span className="text-sm font-medium text-white/80">{period}</span>
        </div>
      </div>
    </div>
  );
}

type QuoteSectionProps = {
  quote: string;
};

export function QuoteSection({ quote }: QuoteSectionProps) {
  return (
    <div className="border-t border-white/10 pt-4">
      <p className="text-sm italic text-white/85">&quot;{quote}&quot;</p>
    </div>
  );
}
