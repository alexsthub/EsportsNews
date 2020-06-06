import Data from "../Models/Data";

export default function TFTParser(): Data[] {
  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("patch") && lowerTitle.includes("notes")) {
      return "update";
    }
    return "general";
  }

  let documents: Data[] = [];

  const grid: HTMLOListElement = document.querySelectorAll("ol")[1];
  const articles: NodeListOf<HTMLLIElement> = grid.querySelectorAll("li");
  for (let i = 0; i < articles.length; i++) {
    const article: HTMLElement = articles[i];
    const textContainer: HTMLElement = article.querySelector("h2").parentElement;

    const title: string = article.querySelector("h2").innerHTML;
    const link: string = article.querySelector("a").href;
    const imageUrl: string = article.querySelector("img").src;
    const description: string = textContainer.querySelector("p").innerHTML;
    const rawDatetime: string = textContainer.querySelector("time").dateTime;
    const category: string = getCategory(title);

    const doc: Data = {
      title: title,
      description: description,
      link: link,
      imageUrl: imageUrl,
      rawDatetime: rawDatetime,
      category: category,
    };
    documents.push(doc);
  }

  return documents;
}
