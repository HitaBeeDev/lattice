import { useTimeTracker } from "../../context/TimeTrackerContext";
import articles from "./articles";

function TimerArticles() {
  const { currentArticleIndex } = useTimeTracker();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
        Reading prompt
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
        {articles[currentArticleIndex]?.title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {articles[currentArticleIndex]?.content}
      </p>
    </div>
  );
}

export default TimerArticles;
