export interface Article {
  id: number;
  title: string;
  game_id: number;
  category: string;
  link: string;
  date_published: Date;
  imageUrl?: string;
  description?: string;
}

export class ArticleStore {
  private articles: Map<number, Article[]>;
  private maxArticlesPerGame: number;

  constructor(maxArticlesPerGame: number) {
    this.maxArticlesPerGame = maxArticlesPerGame;
    this.articles = new Map<number, Article[]>();
  }

  getArticles(): Map<number, Article[]> {
    return this.articles;
  }

  insert(article: Article): void {
    const gameID: number = article.game_id;
    if (!this.articles.has(gameID)) this.articles.set(gameID, []);
    const gameArticleList: Article[] = this.articles.get(gameID);
    this.sortedInsert(gameArticleList, article);
    if (gameArticleList.length >= this.maxArticlesPerGame + 1) {
      gameArticleList.pop();
    }
  }

  private sortedInsert(gameArticleList: Article[], article: Article): void {
    for (let i = 0; i < gameArticleList.length; i++) {
      const currentArticle = gameArticleList[i];
      if (article.title === currentArticle.title) return;
      if (article.date_published >= currentArticle.date_published) {
        gameArticleList.splice(i, 0, article);
        return;
      }
    }
    if (gameArticleList.length < this.maxArticlesPerGame) gameArticleList.push(article);
    return;
  }
}
