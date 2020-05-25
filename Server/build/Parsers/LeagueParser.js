"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function LeagueParser() {
    function getFullUrl(url) {
        const baseUrl = "https://na.leagueoflegends.com/";
        if (url.startsWith("/")) {
            return baseUrl + url;
        }
        return url;
    }
    function getAuthors(cardInfo) {
        const authorDiv = cardInfo.lastChild.lastChild;
        const authors = authorDiv.getElementsByTagName("span");
        if (authors && authors.length > 0) {
            const authorText = authors[0].textContent;
            const authorArray = authorText.split(",").map((auth) => {
                return auth.trim();
            });
            return authorArray;
        }
        else {
            return null;
        }
    }
    function getImageUrl(card) {
        const imageParent = card.firstChild;
        const imageElement = imageParent.getElementsByTagName("img");
        if (imageElement && imageElement.length > 0) {
            return imageElement[0].getAttribute("src");
        }
        return null;
    }
    // TODO: eventually some filtering?
    let documents = [];
    const newsList = document.getElementsByTagName("ol")[1];
    const newsCards = newsList.getElementsByTagName("a");
    for (let i = 0; i < newsCards.length; i++) {
        const card = newsCards[i];
        const cardInfo = card.lastChild.lastChild;
        const link = getFullUrl(card.getAttribute("href"));
        const title = cardInfo.getElementsByTagName("h2")[0].innerText;
        const datetime = new Date(cardInfo.getElementsByTagName("time")[0].getAttribute("datetime"));
        const authors = getAuthors(cardInfo);
        const imageUrl = getImageUrl(card);
        const document = {
            link: link,
            title: title,
            datetime: datetime,
            authors: authors,
            imageUrl: imageUrl,
        };
        documents.push(document);
    }
    return documents;
}
exports.default = LeagueParser;
//# sourceMappingURL=LeagueParser.js.map