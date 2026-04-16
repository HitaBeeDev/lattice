import { useTimeTracker } from "../../context/TimeTrackerContext";
import articles from "./articles";
function TimerArticles() {
  const { currentArticleIndex } = useTimeTracker();
  const article = articles[currentArticleIndex];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="text-[0.65rem] font-[400] uppercase tracking-[0.16em] text-[#a0a6ab]">
        Reading prompt
      </p>

      <h2 className="mt-3 max-w-[34rem] text-[1.45rem] font-[300] leading-[1.05] tracking-[-0.03em] text-[#161c22]">
        {article?.title}
      </h2>

      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden">
        <p className="text-[0.88rem] font-[300] leading-7 text-[#66727a] line-clamp-5">
          {article?.content}
        </p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/92 to-transparent" />
      </div>
    </div>
  );
}
export default TimerArticles;
