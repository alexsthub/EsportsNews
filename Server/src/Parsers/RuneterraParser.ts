import Data from "../Models/Data";

export default function RuneterraParser(): Data[] {
  function getImageUrl(card: HTMLLIElement): string {
    return card.getElementsByTagName("img")[0].getAttribute("src");
  }

  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("patch") && lowerTitle.includes("notes")) {
      return "update";
    }
    return "general";
  }

  let documents: Data[] = [];
  const grid: Element = document.querySelectorAll("ul[class^=src-component-block-NewsList]")[0];
  const cards: HTMLCollectionOf<HTMLLIElement> = grid.getElementsByTagName("li");
  for (let i = 0; i < cards.length; i++) {
    const card: HTMLLIElement = cards[i];
    const anchor: HTMLAnchorElement = card.getElementsByTagName("a")[0];
    const infoDiv: HTMLDivElement = anchor.lastChild as HTMLDivElement;
    const textList: HTMLCollectionOf<HTMLParagraphElement> = infoDiv.getElementsByTagName("p");

    const link: string = anchor.href;
    const imageUrl: string = getImageUrl(card);
    const title: string = infoDiv.getElementsByTagName("h2")[0].innerText;
    const rawDatetime: string = textList[0].innerText;
    const description: string = textList[1].innerText;
    const category: string = getCategory(title);

    const doc = {
      link: link,
      title: title,
      rawDatetime: rawDatetime,
      imageUrl: imageUrl,
      description: description,
      category: category,
    };
    documents.push(doc);
  }

  return documents;
}
