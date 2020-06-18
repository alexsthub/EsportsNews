let numNewArticles = 0;
chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });

const connection = new WebSocket("ws://127.0.0.1:9000");
connection.addEventListener("open", () => {
  chrome.storage.local.get(["subscriptions"], (result) => {
    const subscriptions = result.subscriptions;
    const message = constructMessageToServer(subscriptions);
    if (message) connection.send(message);
  });
});

connection.addEventListener("message", (event) => {
  const message = event.data;
  const newArticles = JSON.parse(message);
  updateLocalArticles(newArticles);
});

function constructMessageToServer(subscriptions) {
  if (!subscriptions || subscriptions.length === 0) return null;
  const ret = {
    type: "init",
    subscriptions: subscriptions,
  };
  return JSON.stringify(ret);
}

function updateLocalArticles(newArticles) {
  chrome.storage.local.get(["articles"], (result) => {
    let currentArticles = result.articles;
    if (!currentArticles) currentArticles = {};
    Object.keys(newArticles).forEach((key) => {
      numNewArticles += calculateNumberOfNewArticles(currentArticles[key], newArticles[key]);
      currentArticles[key] = newArticles[key];
    });
    chrome.storage.local.set({ articles: currentArticles });
    if (numNewArticles > 0) chrome.browserAction.setBadgeText({ text: String(numNewArticles) });
  });
}

function calculateNumberOfNewArticles(currentArticles, newArticles) {
  if (!currentArticles || currentArticles.length === 0) return newArticles.length;
  const difference = newArticles.filter((a) => !currentArticles.some((b) => a.id === b.id));
  return difference.length;
}

function sendUpdates(updates) {
  console.log(updates);
}
