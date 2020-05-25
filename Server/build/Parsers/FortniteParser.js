"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function FortniteParser() {
    let documents = [];
    const grid = document
        .querySelector("div.row")
        .getElementsByTagName("a");
    for (let i = 0; i < grid.length; i++) {
        const card = grid[i];
        const gridContent = card.querySelector(".grid-content");
        const link = card.href;
        const imageUrl = card.querySelector("img").src;
        const datetime = new Date(gridContent.querySelector(".date").innerHTML);
        const title = gridContent.querySelector(".title").innerHTML;
        const doc = {
            title: title,
            link: link,
            imageUrl: imageUrl,
            datetime: datetime,
        };
        documents.push(doc);
    }
    return documents;
}
exports.default = FortniteParser;
//# sourceMappingURL=FortniteParser.js.map