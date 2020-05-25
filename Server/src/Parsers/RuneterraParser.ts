import Data from "../Models/Data";

export default function RuneterraParser(): Data[] {
  function getImageUrl(card: HTMLLIElement): string {
    return card.getElementsByTagName("img")[0].getAttribute("src");
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
    const title = infoDiv.getElementsByTagName("h2")[0].innerText;
    const datetime = new Date(textList[0].innerText);
    const description = textList[1].innerText;

    const doc = {
      link: link,
      title: title,
      datetime: datetime,
      imageUrl: imageUrl,
      description: description,
    };
    documents.push(doc);
  }

  return documents;
}
