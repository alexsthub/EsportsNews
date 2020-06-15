import { Article, ArticleStore } from "../Websocket/ArticleStore";
import * as iconv from "iconv-lite";
import { insertArticlesToDatabase } from "../Helpers/PostScrapeHelpers";
iconv.encodingExists("foo");

describe("Article store", () => {
  let store: ArticleStore;
  beforeEach(() => {
    store = new ArticleStore(2);
    const articleA: Article = {
      id: 1,
      title: "Second",
      link: "Test",
      date_published: new Date("6/10/2020"),
      game_id: 1,
      category: "general",
    };
    const articleB: Article = {
      id: 2,
      title: "First",
      link: "Test",
      date_published: new Date(),
      game_id: 1,
      category: "general",
    };
    store.insert(articleA);
    store.insert(articleB);
  });

  it("first article should be most recent", () => {
    const first: Article = store.getArticles().get(1)[0];
    expect(first.title).toBe("First");
  });

  it("will pop the last element if full capacity", () => {
    const newArticle: Article = {
      id: 3,
      title: "NewArticle",
      link: "Test",
      date_published: new Date("6/10/2020"),
      game_id: 1,
      category: "general",
    };
    store.insert(newArticle);
    const last: Article = store.getArticles().get(1)[1];
    expect(last.title).toBe("NewArticle");
  });

  it("will not add a duplicate", () => {
    const duplicate: Article = {
      id: 2,
      title: "Duplicate",
      link: "Test",
      date_published: new Date(),
      game_id: 1,
      category: "general",
    };
    store.insert(duplicate);
    const last: Article = store.getArticles().get(1)[1];
    expect(last.title).toBe("Second");
  });
});
