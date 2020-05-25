import Data from "../Models/Data";
export default function ApexParser(): Data[] {
  let documents: Data[] = [];
  const grid = document
    .getElementsByTagName("ea-grid")[1]
    .shadowRoot.getElementById("catalogContainer");
  const cards = grid.getElementsByTagName("ea-tile");
  const title: string = cards[0].getElementsByTagName("h3")[0].innerHTML;

  const doc: Data = {
    title: title,
  };

  documents.push(doc);
  return documents;
}
