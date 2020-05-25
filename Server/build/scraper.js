"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const ValorantParser_1 = __importDefault(require("./Parsers/ValorantParser"));
function requestPage(url, parser) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            headless: true,
        });
        const page = yield browser.newPage();
        yield page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        yield page.goto(url, { waitUntil: "networkidle2" });
        let data = yield page.evaluate(parser);
        console.log(data);
        // TODO: Do something with the data.
        debugger;
        yield browser.close();
    });
}
// requestPage("https://www.ea.com/en-gb/games/apex-legends/news#news", ApexParser);
// requestPage("https://na.leagueoflegends.com/en-us/news/game-updates/", LeagueParser);
// https://playhearthstone.com/en-us/news
// https://www.epicgames.com/fortnite/en-US/news
// requestPage("https://playruneterra.com/en-us/news", RuneterraParser);
// requestPage("https://playruneterra.com/en-us/news", RuneterraParser);
// requestPage("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
requestPage("https://beta.playvalorant.com/en-us/news/", ValorantParser_1.default);
//# sourceMappingURL=scraper.js.map