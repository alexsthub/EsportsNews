"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ApexParser() {
    let documents = [];
    const grid = document
        .getElementsByTagName("ea-grid")[1]
        .shadowRoot.getElementById("catalogContainer");
    const cards = grid.getElementsByTagName("ea-tile");
    const title = cards[0].getElementsByTagName("h3")[0].innerHTML;
    const doc = {
        title: title,
    };
    documents.push(doc);
    return documents;
}
exports.default = ApexParser;
//# sourceMappingURL=ApexParser.js.map