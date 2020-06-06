import Data from "../Models/Data";

export default function HearthstoneParser(): Data[] {
  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("patch notes") || lowerTitle.includes("updates")) {
      return "update";
    }
    return "general";
  }

  let documents: Data[] = [];
  const parent: Element = document.querySelector("div.ContentSection");
  const grid: Element = parent.querySelector("div[class^=NewsHomeApp__NewsListContainer]");
  const articles: HTMLCollection = grid.children;
  for (let i = 0; i < articles.length; i++) {
    const article: HTMLAnchorElement = articles[i] as HTMLAnchorElement;

    const link: string = article.href;
    const imageUrl: string = article.querySelector("img").src;
    const title: string = article.querySelector("h3").innerHTML;
    const description: string = article.querySelector("p").innerHTML.trim();
    const rawDatetime: string = article.querySelector("time").innerHTML;
    const category: string = getCategory(title);

    const doc: Data = {
      title: title,
      link: link,
      imageUrl: imageUrl,
      description: description,
      rawDatetime: rawDatetime,
      category: category,
    };
    documents.push(doc);
  }

  return documents;
}
