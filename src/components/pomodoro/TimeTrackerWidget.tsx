import homePageArticles from "./homePageArticles";
import { useRandomIndex } from "../../hooks/useRandomIndex";

function TimeTrackerWidget() {
  const currentArticleIndex = useRandomIndex(homePageArticles.length);
  const article = homePageArticles[currentArticleIndex];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-500">
        Focus tip
      </p>
      <h3 className="mb-2 text-base font-semibold leading-snug text-slate-900">
        {article?.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">{article?.content}</p>
    </div>
  );
}

export default TimeTrackerWidget;
