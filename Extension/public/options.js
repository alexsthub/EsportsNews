const games = [
  {
    id: 1,
    name: "Apex Legends",
    src: "apex.png",
    alt: "Apex Legends Logo",
  },
  {
    id: 2,
    name: "Counter Strike: GO",
    src: "counterstrike.png",
    alt: "Counter Strike Global Offensive Logo",
  },
  {
    id: 3,
    name: "Fortnite",
    src: "fortnite.png",
    alt: "Fortnite Logo",
  },
  {
    id: 4,
    name: "Hearthstone",
    src: "hearthstone.png",
    alt: "Hearthstone Logo",
  },
  {
    id: 5,
    name: "League of Legends",
    src: "league.png",
    alt: "League of Legends Logo",
  },
  {
    id: 7,
    name: "Legends of Runeterra",
    src: "runeterra.png",
    alt: "Legends of Runeterra Logo",
  },
  {
    id: 6,
    name: "Overwatch",
    src: "overwatch.png",
    alt: "Overwatch Logo",
  },
  {
    id: 9,
    name: "Team Fight Tactics",
    src: "tft.png",
    alt: "Team Fight Tactics Logo",
  },
  {
    id: 8,
    name: "Valorant",
    src: "valorant.png",
    alt: "Valorant Logo",
  },
];
let subscribed = [];
let unsubscribed = [];
let changes = {};

function getSubscribedGames() {
  chrome.storage.local.get(["subscriptions"], (result) => {
    const subscriptions = result.subscriptions;
    games.forEach((game) => {
      if (subscriptions && subscriptions.includes(game.id)) {
        subscribed.push(game);
      } else {
        unsubscribed.push(game);
      }
    });
    renderGames(subscribed, unsubscribed);
  });
}

function renderGames(subscribed, unsubscribed) {
  subscribed.sort((a, b) => (a.name > b.name ? 1 : -1));
  unsubscribed.sort((a, b) => (a.name > b.name ? 1 : -1));
  $("div.subscribed-games").empty();
  $("div.unsubscribed-games").empty();
  renderGame(subscribed, true);
  renderGame(unsubscribed, false);

  renderButton(changes);
}

function renderButton(changes) {
  let changed = false;
  const button = $("div.save-button");
  for (const key in changes) {
    if (changes[key] === true) {
      button.addClass("button-active");
      changed = true;
      break;
    }
  }
  if (!changed) button.removeClass("button-active");
}

function renderGame(games, isSubscribed) {
  const container = isSubscribed ? $("div.subscribed-games") : $("div.unsubscribed-games");
  games.forEach((game) => {
    let className;
    const changed = changes[game.id];
    if (changed) className = "game changed-game";
    else className = "game";

    const gameElement = $(`
      <div class="${className}">
        <img class="game-logo" src="./gamelogos/${game.src}" alt="${game.alt}" />
        <p class="title">${game.name}</p>
        <div class="option-button">
          <i class="${isSubscribed ? "remove" : "add"} material-icons">${
      isSubscribed ? "remove" : "add"
    }_circle</i>
        </div>
      </div>;
    `);

    gameElement.click((event) => {
      event.stopPropagation();
      moveGame(game, isSubscribed);
    });

    gameElement.appendTo(container);
  });
}

function moveGame(game, isSubscribed) {
  if (isSubscribed) {
    subscribed = subscribed.filter((s) => s.id !== game.id);
    unsubscribed.push(game);
  } else {
    unsubscribed = unsubscribed.filter((s) => s.id !== game.id);
    subscribed.push(game);
  }
  if (game.id in changes) changes[game.id] = !changes[game.id];
  else changes[game.id] = true;

  renderGames(subscribed, unsubscribed);
}

function sendUpdatesToServer() {
  let updates = {};
  for (const strGameID in changes) {
    if (changes[strGameID]) {
      const gameID = parseInt(strGameID, 10);
      const addSubscription = subscribed.some((sub) => sub.id === gameID);
      if (addSubscription) {
        if (!updates.hasOwnProperty("additions")) updates.additions = [];
        updates.additions.push(gameID);
      } else {
        if (!updates.hasOwnProperty("removals")) updates.removals = [];
        updates.removals.push(gameID);
      }
    }
  }
  const subscribedIDs = subscribed.map((s) => s.id);
  chrome.storage.local.set({ subscriptions: subscribedIDs });
  chrome.extension.getBackgroundPage().sendUpdates(updates);
}

function existsInSubscriptions(subscribed, gameID) {
  for (let i = 0; i < subscribed.length; i++) {
    const game = subscribed[i];
    if (game.id === gameID) return true;
  }
  return false;
}

const saveButton = $("div.save-button");
saveButton.click((event) => {
  event.stopPropagation();
  if (saveButton.hasClass("button-active")) {
    // TODO: When you save, we need to calculate number of new articles again. Otherwise when you delete, you might have the same number but you shouldn't.
    sendUpdatesToServer();
    changes = {};
    renderGames(subscribed, unsubscribed);
  }
});

const markButton = $("div.mark-read");
markButton.click((event) => {
  event.stopPropagation();
  chrome.extension.getBackgroundPage().markAllRead();
});

getSubscribedGames();
