let numNewArticles = 0;
chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });

// TODO: When a new message comes in and you have all unread articles (4), the total count will be 5 but you cannot access the 5th.
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
      numNewArticles += determineNewArticles(currentArticles[key], newArticles[key]);
      currentArticles[key] = newArticles[key];
    });
    chrome.storage.local.set({ articles: currentArticles });
    if (numNewArticles > 0) chrome.browserAction.setBadgeText({ text: String(numNewArticles) });
  });
}

function determineNewArticles(currentArticles, newArticles) {
  let numNew = 0;
  newArticles.forEach((incoming) => {
    const existingArticle = currentArticles
      ? currentArticles.find((current) => current.id === incoming.id)
      : undefined;

    if (!existingArticle || !existingArticle.visited) {
      incoming.visited = false;
      numNew += 1;
    } else {
      incoming.visited = true;
    }
  });
  return numNew;
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

function decrementCount() {
  const res = numNewArticles - 1;
  numNewArticles = res;
  if (res > 0) {
    chrome.browserAction.setBadgeText({ text: String(res) });
  } else chrome.browserAction.setBadgeText({ text: "" });
}
