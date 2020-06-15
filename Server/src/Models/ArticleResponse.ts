export default interface ArticleResponse {
  id: number;
  title: string;
  game_id: number;
  category: string;
  link: string;
  date_published: Date;
  imageUrl?: string;
  description?: string;
}
