import Data from "../Models/Data";

function OverwatchArticleDateParser(): Date {
  const dateElement: Element = document.querySelector("span.publish-date");
  if (dateElement) {
    const datetime: Date = new Date(dateElement.innerHTML);
    return datetime;
  }
  return null;
}

function OverwatchNewsParser(): Data[] {
  function getImageUrl(article: HTMLAnchorElement): string {
    const imageDiv: HTMLDivElement = article.querySelector(".Card-thumbnail") as HTMLDivElement;
    const rawUrl: string = imageDiv.style.backgroundImage;
    return rawUrl.substr(7, rawUrl.length - 9);
  }

  let documents: Data[] = [];

  const featuredDiv: Element = document.querySelector("section.NewsHeader-featured");
  const featuredArticles: NodeListOf<Element> = featuredDiv.querySelectorAll("a.CardLink");
  for (let i = 0; i < featuredArticles.length; i++) {
    const article: HTMLAnchorElement = featuredArticles[i] as HTMLAnchorElement;

    const imageUrl: string = getImageUrl(article);
    const link: string = article.href;
    const title: string = article.querySelector("h1.Card-title").innerHTML;

    const doc: Data = {
      title: title,
      link: link,
      imageUrl: imageUrl,
    };
    documents.push(doc);
  }

  return documents;
}

function OverwatchPatchParser(): Data[] {
  let documents: Data[] = [];
  const body: Element = document.querySelector("div.PatchNotes-body");
  const articles: NodeListOf<Element> = body.querySelectorAll("div.PatchNotes-patch");
  for (let i = 0; i < articles.length; i++) {
    const article: Element = articles[i];

    const title: string = article.querySelector("h3").innerHTML;
    const splitString: string[] = title.split("–");
    const datetime: Date = new Date(splitString[1].trim());

    const doc: Data = {
      datetime: datetime,
      title: title,
    };

    documents.push(doc);
  }

  return documents;
}

export { OverwatchArticleDateParser, OverwatchNewsParser, OverwatchPatchParser };
