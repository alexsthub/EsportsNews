import constructScraper from "./Helpers/ConstructScraper";
import GenericScraper from "./Models/Scraper";

const scraper: GenericScraper = constructScraper("Apex");
scraper.scrape();
