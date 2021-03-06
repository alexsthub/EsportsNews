import ConstructScraper from "../Helpers/ConstructScraper";
import GenericScraper from "../Scrapers/GenericScraper";
import Request from "../Models/Request";

import { formatDate } from "../Helpers/PostScrapeHelpers";
import Scraper from "../Models/Scraper";

describe("Construct scraper", () => {
  it("should construct correct scraper", (done) => {
    const request: Request = {
      gameID: 5,
    };
    const scraper: Scraper = ConstructScraper(request);
    expect(scraper).toBeInstanceOf(GenericScraper);
    expect(scraper.getUrl()).toBe("https://na.leagueoflegends.com/en-us/latest-news/");
    done();
  });

  it("should return null when gameID does not exist", (done) => {
    const request: Request = {
      gameID: 100,
    };
    const scraper: Scraper = ConstructScraper(request);
    expect(scraper).toBe(null);
    done();
  });
});

describe("Format Date", () => {
  it("should format correct date", (done) => {
    const rawDate: string = "4/16/2020";
    const dateString: string = formatDate(rawDate);
    expect(dateString).toBe("2020-04-16");
    done();
  });

  it("should return null if cannot parse", (done) => {
    const rawDate: string = "hello";
    const dateString: string = formatDate(rawDate);
    expect(dateString).toBe(null);
    done();
  });
});
