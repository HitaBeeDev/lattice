import homePageArticles from "./homePageArticles";
import { useRandomIndex } from "../../hooks/useRandomIndex";
function TimeTrackerWidget() {
    const currentArticleIndex = useRandomIndex(homePageArticles.length);
    const article = homePageArticles[currentArticleIndex];
    return (<div>
      <div aria-hidden="true"/>
      <p>
        Focus tip
      </p>
      <h3>
        {article?.title}
      </h3>
      <p>{article?.content}</p>
    </div>);
}
export default TimeTrackerWidget;
