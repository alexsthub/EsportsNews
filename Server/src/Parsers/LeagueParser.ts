import Data from "../Models/Data";

export default function LeagueParser(): Data[] {
  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("patch") && lowerTitle.includes("note")) {
      return "update";
    }
    return "general";
  }

  let documents = [];

  const grid: HTMLOListElement = document.querySelector("ol");
  const articles: NodeListOf<HTMLLIElement> = grid.querySelectorAll("li");
  for (let i = 0; i < articles.length; i++) {
    const article: HTMLLIElement = articles[i];

    const titleElement: HTMLElement = article.querySelector("h2");
    if (
      titleElement === null ||
      titleElement.innerHTML.includes("Teamfight Tactics") ||
      titleElement.innerHTML.includes("TFT")
    ) {
      continue;
    }
    const title: string = titleElement.innerHTML;
    const textContainer: HTMLElement = article.querySelector("h2").parentElement;
    const link: string = article.querySelector("a").href;
    const imageUrl: string = article.querySelector("img").src;
    const rawDatetime: string = textContainer.querySelector("time").dateTime;
    const category: string = getCategory(title);

    const document: Data = {
      title: title,
      link: link,
      rawDatetime: rawDatetime,
      imageUrl: imageUrl,
      category: category,
    };
    documents.push(document);
  }
  return documents;
}
