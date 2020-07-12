let numNewArticles = 0;
chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });

// TODO: If connection does not work then we still want to calculate new articles?
const connection = new WebSocket("ws://34.208.195.208:9000");
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
      determineNewArticles(currentArticles[key], newArticles[key]);
      currentArticles[key] = newArticles[key];
    });
    chrome.storage.local.set({ articles: currentArticles });
    calculateNewArticles();
  });
}

function determineNewArticles(currentArticles, newArticles) {
  newArticles.forEach((incoming) => {
    const existingArticle = currentArticles
      ? currentArticles.find((current) => current.id === incoming.id)
      : undefined;

    if (!existingArticle || !existingArticle.visited) {
      incoming.visited = false;
    } else {
      incoming.visited = true;
    }
  });
}

function sendUpdates(updates) {
  if (updates) {
    const message = {
      type: "update",
      updates: updates,
    };
    const messageStr = JSON.stringify(message);
    connection.send(messageStr);
  }
}

function calculateNewArticles() {
  chrome.storage.local.get(["articles", "subscriptions"], (result) => {
    let numberNew = 0;
    const articles = result.articles;
    const subscriptions = result.subscriptions;
    if (!articles || !subscriptions) return;
    for (let i = 0; i < subscriptions.length; i++) {
      const gameID = subscriptions[i];
      const gameArticles = articles[gameID];
      if (!gameArticles) continue;
      for (let j = 0; j < gameArticles.length; j++) {
        const article = gameArticles[j];
        if (!article.visited) numberNew = numberNew + 1;
      }
    }
    const text = numberNew > 0 ? String(numberNew) : "";
    chrome.browserAction.setBadgeText({ text: text });
    numNewArticles = numberNew;
  });
}

function decrementCount() {
  const res = numNewArticles - 1;
  numNewArticles = res;
  if (res > 0) {
    chrome.browserAction.setBadgeText({ text: String(res) });
  } else chrome.browserAction.setBadgeText({ text: "" });
}

function markAllRead() {
  chrome.storage.local.get(["articles", "subscriptions"], (result) => {
    const articles = result.articles;
    const subscriptions = result.subscriptions;
    if (!articles || !subscriptions) return;
    for (let i = 0; i < subscriptions.length; i++) {
      const gameID = subscriptions[i];
      const gameArticles = articles[gameID];
      for (let j = 0; j < gameArticles.length; j++) {
        const article = gameArticles[j];
        article.visited = true;
      }
    }
    chrome.storage.local.set({ articles: articles });
    chrome.browserAction.setBadgeText({ text: "" });
  });
}
