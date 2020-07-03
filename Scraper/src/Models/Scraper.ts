export default interface Scraper {
  getUrl: () => string;
  scrape: () => any;
}
