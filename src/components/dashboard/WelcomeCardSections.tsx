type GreetingSectionProps = {
  message: string;
  title: string;
};

export function GreetingSection({ message, title }: GreetingSectionProps) {
  return (
    <div className="mb-4">
      <p className="text-xl font-bold">{title}</p>
      <p className="mt-0.5 text-sm text-indigo-200">{message}</p>
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
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="text-sm text-indigo-200">
          Oh hey, it&apos;s <span className="font-semibold text-white">{dayOfWeek}</span> already!
        </p>
        <p className="mt-0.5 text-sm text-indigo-200">{currentDate}</p>
      </div>

      <div className="text-right">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formattedTime}</span>
          <span className="text-sm font-medium text-indigo-200">{period}</span>
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
    <div className="border-t border-indigo-500 pt-4">
      <p className="text-sm italic text-indigo-200">&quot;{quote}&quot;</p>
    </div>
  );
}
