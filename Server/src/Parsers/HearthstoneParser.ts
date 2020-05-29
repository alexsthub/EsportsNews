import Data from "../Models/Data";

export default function HearthstoneParser(): Data[] {
  let documents: Data[] = [];
  const parent: Element = document.querySelector("div.ContentSection");
  const grid: Element = parent.querySelector("div[class^=NewsHomeApp__NewsListContainer]");
  const articles: HTMLCollection = grid.children;
  for (let i = 0; i < articles.length; i++) {
    const article: HTMLAnchorElement = articles[i] as HTMLAnchorElement;

    const link: string = article.href;
    const imageUrl: string = article.querySelector("img").src;
    const title: string = article.querySelector("h3").innerHTML;
    const description: string = article.querySelector("p").innerHTML;
    const rawDatetime: string = article.querySelector("time").innerHTML;

    const doc: Data = {
      title: title,
      link: link,
      imageUrl: imageUrl,
      description: description,
      rawDatetime: rawDatetime,
    };
    documents.push(doc);
  }

  return documents;
}
