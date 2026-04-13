import { useTimeTracker } from "../../context/TimeTrackerContext";
import articles from "./articles";
function TimerArticles() {
    const { currentArticleIndex } = useTimeTracker();
    return (<div>
      <p>
        Reading prompt
      </p>
      <h2>
        {articles[currentArticleIndex]?.title}
      </h2>
      <p>
        {articles[currentArticleIndex]?.content}
      </p>
    </div>);
}
export default TimerArticles;
