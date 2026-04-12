import homePageArticles from "./homePageArticles";
import { useRandomIndex } from "../../hooks/useRandomIndex";

function TimeTrackerWidget() {
  const currentArticleIndex = useRandomIndex(homePageArticles.length);

  return (
    <div>
      <div>
        <h2>
          {homePageArticles[currentArticleIndex]?.title}
        </h2>
        <p>
          {homePageArticles[currentArticleIndex]?.content}
        </p>
      </div>
    </div>);

}

export default TimeTrackerWidget;
