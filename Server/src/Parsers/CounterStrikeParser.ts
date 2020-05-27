import Data from "../Models/Data";

export default function CounterStrikeParser(): Data[] {
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
    const datetime: Date = new Date(dateDiv.innerText.replace("-", "").trim());
    const doc = {
      title: title,
      link: link,
      datetime: datetime,
    };
    documents.push(doc);
  }
  return documents;
}
