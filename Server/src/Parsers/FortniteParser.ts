import Data from "../Models/Data";

export default function FortniteParser() {
  let documents: Data[] = [];

  const grid: HTMLCollectionOf<HTMLAnchorElement> = document
    .querySelector("div.row")
    .getElementsByTagName("a");

  for (let i = 0; i < grid.length; i++) {
    const card: HTMLAnchorElement = grid[i];
    const gridContent: Element = card.querySelector(".grid-content");

    const link: string = card.href;
    const imageUrl: string = card.querySelector("img").src;
    const rawDatetime: string = gridContent.querySelector(".date").innerHTML;
    const title: string = gridContent.querySelector(".title").innerHTML;

    const doc = {
      title: title,
      link: link,
      imageUrl: imageUrl,
      rawDatetime: rawDatetime,
    };

    documents.push(doc);
  }
  return documents;
}
