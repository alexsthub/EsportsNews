import Data from "../Models/Data";

export default function ApexParser(): Data[] {
  function getLinkUrl(card: Element): string {
    const anchorParent: Element = card.querySelector("ea-cta");
    const anchor = anchorParent ? anchorParent.querySelector("a") : null;
    return anchor ? anchor.href : null;
  }

  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("patch notes") || lowerTitle.includes("update")) {
      return "update";
    }
    return "general";
  }

  let documents: Data[] = [];
  const grid: Element = document
    .querySelector(
      "body > iron-pages > div.iron-selected > ea-section > ea-section-column > ea-grid"
    )
    .shadowRoot.querySelector("#catalogContainer");

  const cards: HTMLCollectionOf<Element> = grid.getElementsByTagName("ea-tile");
  for (let i = 0; i < cards.length; i++) {
    const card: Element = cards[i];

    const title: string = card.getAttribute("title-text");
    const imageUrl: string = card.getAttribute("media");
    const link: string = getLinkUrl(card);
    const description: string = card.querySelector("ea-tile-copy").innerHTML.trim();
    const rawDatetime: string = card.getAttribute("eyebrow-secondary-text");
    const category: string = getCategory(title);

    const doc: Data = {
      title: title,
      imageUrl: imageUrl,
      link: link,
      description: description,
      rawDatetime: rawDatetime,
      category: category,
    };
    documents.push(doc);
  }

  return documents;
}
