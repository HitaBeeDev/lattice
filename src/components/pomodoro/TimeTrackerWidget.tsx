import homePageArticles from "./homePageArticles";
import { useRandomIndex } from "../../hooks/useRandomIndex";

function TimeTrackerWidget() {
  const currentArticleIndex = useRandomIndex(homePageArticles.length);
  const article = homePageArticles[currentArticleIndex];

  return (
    <div className="app-panel-dark relative overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,242,71,0.22),_transparent_20%)]"
      />
      <p className="relative mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--app-accent)]">
        Focus tip
      </p>
      <h3 className="relative mb-2 text-base font-semibold leading-snug text-white">
        {article?.title}
      </h3>
      <p className="relative text-sm leading-relaxed text-white/70">{article?.content}</p>
    </div>
  );
}

export default TimeTrackerWidget;
