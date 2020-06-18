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

// chrome.storage.local.get(["subscriptions"], (result) => {
//   const subscriptions = result.subscriptions;
//   games.forEach(game => {
//     if (subscriptions.includes(game.id)) {
//       subscribed.push(game);
//     } else {
//       unsubscribed.push(game);
//     }
//   })
//   subscribed.sort((a,b) => a.name > b.name)
//   unsubscribed.sort((a,b) => a.name > b.name)
// });

function getSubscribedGames() {
  const subscriptions = [2, 8];
  games.forEach((game) => {
    if (subscriptions.includes(game.id)) {
      subscribed.push(game);
    } else {
      unsubscribed.push(game);
    }
  });
}

function renderGames(subscribed, unsubscribed) {
  subscribed.sort((a, b) => (a.name > b.name ? 1 : -1));
  unsubscribed.sort((a, b) => (a.name > b.name ? 1 : -1));
  $("div.subscribed-games").empty();
  $("div.unsubscribed-games").empty();
  renderGame(subscribed, true);
  renderGame(unsubscribed, false);
}

function renderGame(games, isSubscribed) {
  const container = isSubscribed ? $("div.subscribed-games") : $("div.unsubscribed-games");
  games.forEach((game) => {
    const gameElement = $(`
      <div class="game">
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
  renderGames(subscribed, unsubscribed);
}

getSubscribedGames();
renderGames(subscribed, unsubscribed);

// TODO: track if there are updates and only when they hit save will I save to storage and send to websocket
// TODO: Do not allow user to save until valid changes.

// TODO:
// chrome.extension.getBackgroundPage().test();
// chrome.runtime.getBackgroundPage().update(myData)
