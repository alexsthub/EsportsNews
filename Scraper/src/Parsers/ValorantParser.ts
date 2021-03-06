import Data from "../Models/Data";

export default function ValorantParser(): Data[] {
  function getImageUrl(body: HTMLAnchorElement): string {
    const imageDiv: Element = body.querySelector("div[class*=imageWrapper]");
    const imageUrl: string = imageDiv.querySelector("span").style.backgroundImage;
    return imageUrl.substr(5, imageUrl.length - 7);
  }

  function getCategory(title: string): string {
    const lowerTitle: string = title.toLowerCase();
    if (lowerTitle.includes("patch") && lowerTitle.includes("notes")) {
      return "update";
    }
    return "general";
  }

  let documents: Data[] = [];
  const grid: Element = document.querySelector("[class^=NewsArchive-module--content]");
  const articles: HTMLCollection = grid.children;
  for (let i = 0; i < articles.length; i++) {
    const article: Element = articles[i];
    const body: HTMLAnchorElement = article.querySelector("a");
    const textContent: HTMLDivElement = body.querySelector(
      "div[class^=NewsCard-module--copyContainer]"
    );

    const link: string = body.href;
    const rawDatetime: string = textContent.children[0].innerHTML;
    const title: string = textContent.children[1].innerHTML;
    const description: string = textContent.children[2].innerHTML;
    const imageUrl: string = getImageUrl(body);
    const category: string = getCategory(title);

    const doc = {
      link: link,
      rawDatetime: rawDatetime,
      title: title,
      description: description,
      imageUrl: imageUrl,
      category: category,
    };
    documents.push(doc);
  }

  return documents;
}
