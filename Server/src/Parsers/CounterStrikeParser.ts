import Data from "../Models/Data";

export default function CounterStrikeParser(): Data[] {
  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("release") && lowerTitle.includes("note")) {
      return "update";
    }
    return "general";
  }

  let documents: Data[] = [];
  const grid: Element = document.querySelector("div#post_container");
  const articles: NodeListOf<Element> = grid.querySelectorAll("div.inner_post");
  for (let i = 0; i < articles.length; i++) {
    const article: Element = articles[i];
    const anchor: HTMLAnchorElement = article.querySelector("h2").querySelector("a");
    const dateDiv: HTMLParagraphElement = article.querySelector(
      "p.post_date"
    ) as HTMLParagraphElement;

    const link: string = anchor.href;
    const title: string = anchor.innerHTML;
    const rawDatetime: string = dateDiv.innerText.replace("-", "").trim();
    const category: string = getCategory(title);

    const doc: Data = {
      title: title,
      link: link,
      rawDatetime: rawDatetime,
      category: category,
    };
    documents.push(doc);
  }
  return documents;
}
