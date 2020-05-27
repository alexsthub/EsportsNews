import Data from "../Models/Data";

export default function ValorantParser(): Data[] {
  function getImageUrl(body: HTMLAnchorElement): string {
    const imageDiv: Element = body.querySelector("div[class*=imageWrapper]");
    const imageUrl: string = imageDiv.querySelector("span").style.backgroundImage;
    return imageUrl.substr(5, imageUrl.length - 7);
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

    const link = body.href;
    const datetime = new Date(textContent.children[0].innerHTML);
    const title = textContent.children[1].innerHTML;
    const description = textContent.children[2].innerHTML;
    const imageUrl: string = getImageUrl(body);

    const doc = {
      link: link,
      datetime: datetime,
      title: title,
      description: description,
      imageUrl: imageUrl,
    };
    documents.push(doc);
  }

  return documents;
}
