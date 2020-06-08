import constructScraper from "../Helpers/ConstructScraper";
import Scraper from "../Models/Scraper";
import Request from "../Models/Request";
import Data from "../Models/Data";

describe("Test the parsers", () => {
  it("apex legends", async (done) => {
    jest.setTimeout(12000);
    const requestMessage: Request = {
      gameID: 1,
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBe(18);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.description).not.toBeNull();
    expect(firstArticle.category).not.toBeNull();
    expect(firstArticle.imageUrl).not.toBeNull();
    expect(firstArticle.link).not.toBeNull();
    expect(firstArticle.rawDatetime).not.toBeNull();
    done();
  });

  it("Counter strike News", async (done) => {
    const requestMessage: Request = {
      gameID: 2,
      type: "news",
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(3);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.description).toBeUndefined();
    expect(firstArticle.category).toBe("general");
    expect(firstArticle.link).not.toBeNull();
    expect(firstArticle.rawDatetime).not.toBeNull();
    done();
  });

  it("Counter strike News", async (done) => {
    const requestMessage: Request = {
      gameID: 2,
      type: "patch",
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(3);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.description).toBeUndefined();
    expect(firstArticle.category).toBe("update");
    expect(firstArticle.link).not.toBeNull();
    expect(firstArticle.rawDatetime).not.toBeNull();
    done();
  });

  it("Hearthstone", async (done) => {
    const requestMessage: Request = {
      gameID: 4,
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(10);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.description).not.toBeUndefined();
    expect(firstArticle.category).not.toBeUndefined();
    expect(firstArticle.link).not.toBeUndefined();
    expect(firstArticle.rawDatetime).not.toBeUndefined();
    done();
  });

  it("League of Legends", async (done) => {
    const requestMessage: Request = {
      gameID: 5,
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(6);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.imageUrl).not.toBeUndefined();
    expect(firstArticle.description).toBeUndefined();
    expect(firstArticle.category).not.toBeUndefined();
    expect(firstArticle.link).not.toBeUndefined();
    expect(firstArticle.rawDatetime).not.toBeUndefined();
    done();
  });

  it("Overwatch patch notes", async (done) => {
    const requestMessage: Request = {
      gameID: 6,
      type: "patch",
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(0);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.imageUrl).toBeUndefined();
    expect(firstArticle.description).toBeUndefined();
    expect(firstArticle.category).toBe("update");
    expect(firstArticle.link).not.toBeUndefined();
    expect(firstArticle.rawDatetime).not.toBeUndefined();
    done();
  });

  it("Overwatch news notes", async (done) => {
    const requestMessage: Request = {
      gameID: 6,
      type: "news",
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBe(4);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.imageUrl).not.toBeUndefined();
    expect(firstArticle.description).toBeUndefined();
    expect(firstArticle.category).toBe("general");
    expect(firstArticle.rawDatetime).toBeUndefined();
    done();
  });

  it("Overwatch details", async (done) => {
    const requestMessage: Request = {
      gameID: 6,
      type: "details",
      article: {
        title: "Overwatch Double XP Weekend | June 5-9",
        link: "https://playoverwatch.com/en-us/news/23445048/overwatch-double-xp-weekend-june-5-9",
        imageUrl: "bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/sv/SVP92ZTXU8M21591062501006.png",
        category: "general",
      },
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBe(1);
    expect(firstArticle.title).toBe("Overwatch Double XP Weekend | June 5-9");
    expect(firstArticle.imageUrl).not.toBeUndefined();
    expect(firstArticle.description).toBeUndefined();
    expect(firstArticle.category).toBe("general");
    expect(firstArticle.rawDatetime).toBe("6/5/2020");
    done();
  });

  it("Runeterra", async (done) => {
    const requestMessage: Request = {
      gameID: 7,
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(6);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.imageUrl).not.toBeUndefined();
    expect(firstArticle.description).not.toBeUndefined();
    expect(firstArticle.category).not.toBeUndefined();
    expect(firstArticle.link).not.toBeUndefined();
    expect(firstArticle.rawDatetime).not.toBeUndefined();
    done();
  });

  it("Valorant", async (done) => {
    const requestMessage: Request = {
      gameID: 8,
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(6);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.imageUrl).not.toBeUndefined();
    expect(firstArticle.description).not.toBeUndefined();
    expect(firstArticle.category).not.toBeUndefined();
    expect(firstArticle.link).not.toBeUndefined();
    expect(firstArticle.rawDatetime).not.toBeUndefined();
    done();
  });

  it("Teamfight Tactics", async (done) => {
    const requestMessage: Request = {
      gameID: 9,
    };
    const scraper: Scraper = constructScraper(requestMessage);
    const scrapedArticles: Data[] = await scraper.scrape();
    const firstArticle: Data = scrapedArticles[0];
    expect(scrapedArticles.length).toBeGreaterThan(4);
    expect(typeof firstArticle.title).toBe("string");
    expect(firstArticle.imageUrl).not.toBeUndefined();
    expect(firstArticle.description).not.toBeUndefined();
    expect(firstArticle.category).not.toBeUndefined();
    expect(firstArticle.link).not.toBeUndefined();
    expect(firstArticle.rawDatetime).not.toBeUndefined();
    done();
  });
});
