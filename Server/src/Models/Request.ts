import Data from "./Data";

export default interface Request {
  gameID: number;
  type?: string;
  article?: Data;
}
