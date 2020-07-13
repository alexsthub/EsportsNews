import React, { createRef } from "react";
import "./styles/App.css";

import GameContainer from "./components/GameContainer";
import GameDetails from "./components/GameDetails";
import SettingsCog from "./components/Buttons/SettingsCog";
import DarkModeIcon from "./components/Buttons/DarkModeIcon";

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/Themes/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes/Themes";
/* global chrome */

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribedGames: [],
      articles: {},
      selectedGame: null,
      theme: "light",
    };
    this.titleRef = createRef();
  }

  componentDidMount = () => {
    chrome.storage.local.get(["theme", "subscriptions", "articles"], (result) => {
      if (result.theme) this.setState({ theme: result.theme });
      if (result.articles) this.setState({ articles: result.articles });
      if (result.subscriptions) {
        const subscribedGames = games.filter((game) =>
          result.subscriptions.some((subscriptionID) => game.id === subscriptionID)
        );
        subscribedGames.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.setState({ subscribedGames: subscribedGames });
      }
    });
  };

  handleGameClick = (e, gameObj) => {
    this.setState({ selectedGame: gameObj });
  };

  handleArticleClick = (e, article) => {
    e.stopPropagation();
    const currentArticles = this.state.articles;
    const currentGameArticles = currentArticles[article.game_id];

    for (let i = 0; i < currentGameArticles.length; i++) {
      const art = currentGameArticles[i];
      if (art.id === article.id && article.visited === false) {
        art.visited = true;
        chrome.runtime.getBackgroundPage((page) => {
          page.decrementCount();
        });
        chrome.storage.local.set({ articles: currentArticles });
        this.setState({ articles: currentArticles });
        break;
      }
    }
    window.open(article.link, "_blank");
  };

  switchTheme = () => {
    const result = this.state.theme === "light" ? "dark" : "light";
    this.setState({ theme: result });
    chrome.storage.local.set({ theme: result });
  };

  render() {
    let body;
    if (this.state.selectedGame === null) {
      body = (
        <GameContainer
          subscriptions={this.state.subscribedGames}
          articles={this.state.articles}
          onClick={this.handleGameClick}
        />
      );
    } else {
      body = (
        <GameDetails
          game={this.state.selectedGame}
          articleList={
            this.state.selectedGame ? this.state.articles[this.state.selectedGame.id] : []
          }
          goBack={() => this.setState({ selectedGame: null })}
          onClick={this.handleArticleClick}
        />
      );
    }

    return (
      <ThemeProvider theme={this.state.theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div className="App" style={{ width: this.state.selectedGame ? 300 : 200 }}>
          <div style={{ position: "relative" }}>
            <h3 ref={this.titleRef}>Official Game News</h3>
            <DarkModeIcon onClick={this.switchTheme} />
            <SettingsCog />
          </div>

          {body}
        </div>
      </ThemeProvider>
    );
  }
}

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
