"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function RuneterraParser() {
    function getImageUrl(card) {
        return card.getElementsByTagName("img")[0].getAttribute("src");
    }
    let documents = [];
    const grid = document.querySelectorAll("ul[class^=src-component-block-NewsList]")[0];
    const cards = grid.getElementsByTagName("li");
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const anchor = card.getElementsByTagName("a")[0];
        const infoDiv = anchor.lastChild;
        const textList = infoDiv.getElementsByTagName("p");
        const link = anchor.href;
        const imageUrl = getImageUrl(card);
        const title = infoDiv.getElementsByTagName("h2")[0].innerText;
        const datetime = new Date(textList[0].innerText);
        const description = textList[1].innerText;
        const doc = {
            link: link,
            title: title,
            datetime: datetime,
            imageUrl: imageUrl,
            description: description,
        };
        documents.push(doc);
    }
    return documents;
}
exports.default = RuneterraParser;
//# sourceMappingURL=RuneterraParser.js.map