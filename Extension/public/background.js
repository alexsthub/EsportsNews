function constructMessageToServer(subscriptions, articles) {
  const subs = {};
  if (!subscriptions || subscriptions.length === 0) return null;
  subscriptions.forEach((subscriptionID) => {
    const currentArticles = articles ? articles[subscriptionID] : null;
    if (currentArticles) {
      const ids = currentArticles.map((article) => article.id);
      subs[subscriptionID] = ids;
    } else {
      subs[subscriptionID] = [];
    }
  });
  const ret = {
    type: "init",
    subscriptions: subs,
  };
  return JSON.stringify(ret);
}

const connection = new WebSocket("ws://127.0.0.1:9000");
connection.addEventListener("open", () => {
  chrome.storage.local.get(["subscriptions", "articles"], (result) => {
    const subscriptions = result.subscriptions;
    const articles = result.articles;
    const message = constructMessageToServer(subscriptions, articles);
    connection.send(message);
  });
});

connection.addEventListener("message", (event) => {
  const message = event.data;
  const newArticles = JSON.parse(message);
  console.log(newArticles);
  chrome.storage.local.get(["articles"], (result) => {
    // TODO: Should the server just return the 5 so that I can just assign the values instead of get the difference?
  });
});

chrome.browserAction.setBadgeText({ text: "1" });
chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });
