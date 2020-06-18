import React, { createRef } from "react";
import "./styles/App.css";

import { CSSTransition } from "react-transition-group";
import GameContainer from "./components/GameContainer";
import GameDetails from "./components/GameDetails";
import SettingsCog from "./components/Buttons/SettingsCog";
import DarkModeIcon from "./components/Buttons/DarkModeIcon";

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/Themes/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes/Themes";
/* global chrome */

// TODO: Starts light theme then goes dark / takes time to load subscribed games... I need to put a loading somewhere!
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      subscribedGames: [],
      articles: {},
      selectedGame: null,
      theme: "light",
    };
    this.titleRef = createRef();
  }

  componentDidMount = () => {
    // chrome.storage.local.remove(["subscriptions"]);
    // chrome.storage.local.remove(["articles"]);

    // chrome.storage.local.set({ subscriptions: [8, 4] }, () => {
    //   console.log("set subscriptions value");
    // });

    chrome.storage.local.get(["theme", "subscriptions", "articles"], (result) => {
      if (result.theme) this.setState({ theme: result.theme });
      if (result.articles) this.setState({ articles: result.articles });
      if (result.subscriptions) {
        const subscribedGames = games.filter((game) =>
          result.subscriptions.some((subscriptionID) => game.id === subscriptionID)
        );
        subscribedGames.sort((a, b) => (a.title > b.title ? 1 : -1));
        this.setState({ subscribedGames: subscribedGames });
      }
    });
  };

  handleGameClick = (e, gameObj) => {
    this.setState({ selectedGame: gameObj });
  };

  calculateHeight = (element) => {
    const titleHeight = this.titleRef.current.offsetHeight;
    const height = element.offsetHeight + titleHeight + 15;
    this.setState({ height: height });
  };

  switchTheme = () => {
    const result = this.state.theme === "light" ? "dark" : "light";
    this.setState({ theme: result });
    chrome.storage.local.set({ theme: result });
  };

  render() {
    return (
      <ThemeProvider theme={this.state.theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div
          className="App"
          style={{ height: this.state.height, width: this.state.selectedGame ? 300 : 200 }}
        >
          <div style={{ position: "relative" }}>
            <h3 ref={this.titleRef}>ESports News</h3>
            <DarkModeIcon onClick={this.switchTheme} />
            <SettingsCog />
          </div>

          <CSSTransition
            in={this.state.selectedGame === null}
            timeout={600}
            classNames="primary"
            unmountOnExit
            onEnter={this.calculateHeight}
          >
            <GameContainer games={this.state.subscribedGames} onClick={this.handleGameClick} />
          </CSSTransition>

          <CSSTransition
            in={this.state.selectedGame !== null}
            timeout={600}
            classNames="secondary"
            unmountOnExit
            onEnter={this.calculateHeight}
          >
            <GameDetails
              game={this.state.selectedGame}
              articleList={
                this.state.selectedGame ? this.state.articles[this.state.selectedGame.id] : []
              }
              goBack={() => this.setState({ selectedGame: null })}
            />
          </CSSTransition>
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
