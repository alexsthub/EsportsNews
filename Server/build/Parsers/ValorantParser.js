"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ValorantParser() {
    function getImageUrl(body) {
        const imageDiv = body.querySelector("div[class*=imageWrapper]");
        const imageUrl = imageDiv.querySelector("span").style.backgroundImage;
        return imageUrl.substr(5, imageUrl.length - 7);
    }
    let documents = [];
    const grid = document.querySelector("[class^=NewsArchive-module--content]");
    const articles = grid.children;
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const body = article.querySelector("a");
        const textContent = body.querySelector("div[class^=NewsCard-module--copyContainer]");
        // TODO: Get image
        const link = body.href;
        const datetime = new Date(textContent.children[0].innerHTML);
        const title = textContent.children[1].innerHTML;
        const description = textContent.children[2].innerHTML;
        const imageUrl = getImageUrl(body);
        const doc = {
            link: link,
            datetime: datetime,
            title: title,
            description: description,
            imageUrl: imageUrl,
        };
        documents.push(doc);
    }
    return documents;
}
exports.default = ValorantParser;
//# sourceMappingURL=ValorantParser.js.map