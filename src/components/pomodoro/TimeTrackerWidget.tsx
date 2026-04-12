import { useEffect, useState } from "react";
import homePageArticles from "./homePageArticles";

function TimeTrackerWidget() {
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArticleIndex(
        (prevIndex) => (prevIndex + 1) % homePageArticles.length
      );
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
