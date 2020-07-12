import Data from "../Models/Data";

function OverwatchArticleDateParser(): string {
  const dateElement: Element = document.querySelector("span.publish-date");
  if (dateElement) {
    const rawDatetime: string = dateElement.innerHTML;
    return rawDatetime;
  }
  return null;
}

function OverwatchNewsParser(): Data[] {
  function getImageUrl(article: HTMLAnchorElement): string {
    const imageDiv: HTMLDivElement = article.querySelector(".Card-thumbnail") as HTMLDivElement;
    const rawUrl: string = imageDiv.style.backgroundImage;
    let imageUrl: string = rawUrl.substr(7, rawUrl.length - 9);
    if (!imageUrl.startsWith("http")) imageUrl = "https://" + imageUrl;

    return imageUrl;
  }

  let documents: Data[] = [];

  const featuredDiv: Element = document.querySelector("section.NewsHeader-featured");
  const featuredArticles: NodeListOf<Element> = featuredDiv.querySelectorAll("a.CardLink");
  for (let i = 0; i < featuredArticles.length; i++) {
    const article: HTMLAnchorElement = featuredArticles[i] as HTMLAnchorElement;

    const imageUrl: string = getImageUrl(article);
    const link: string = article.href;
    const title: string = article.querySelector("h1.Card-title").innerHTML;
    const category: string = "general";

    const doc: Data = {
      title: title,
      link: link,
      imageUrl: imageUrl,
      category: category,
    };
    documents.push(doc);
  }

  return documents;
}

function OverwatchPatchParser(): Data[] {
  function getLink(): string {
    const currentDate = new Date();
    const baseUrl: string = "https://playoverwatch.com/en-us/news/patch-notes/live/"; // year/month
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    const link: string = baseUrl + year + "/" + month;

    return link;
  }

  let documents: Data[] = [];
  const body: Element = document.querySelector("div.PatchNotes-body");
  const articles: NodeListOf<Element> = body.querySelectorAll("div.PatchNotes-patch");
  const link: string = getLink();
  for (let i = 0; i < articles.length; i++) {
    const article: Element = articles[i];

    const title: string = article.querySelector("h3").innerHTML;
    const rawDatetime: string = article.querySelector("div.PatchNotes-date").innerHTML;
    const category: string = "update";

    const doc: Data = {
      rawDatetime: rawDatetime,
      title: title,
      category: category,
      link: link,
    };
    documents.push(doc);
  }

  return documents;
}

export { OverwatchArticleDateParser, OverwatchNewsParser, OverwatchPatchParser };
