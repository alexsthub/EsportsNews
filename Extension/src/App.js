import React, { createRef } from "react";
import "./App.css";

import { CSSTransition } from "react-transition-group";
import GameContainer from "./components/GameContainer";
import GameDetails from "./components/GameDetails";
import SettingsCog from "./components/SettingsCog";

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
    name: "League of Legends",
    src: "league.png",
    alt: "League of Legends Logo",
  },
  {
    id: 5,
    name: "Legends of Runeterra",
    src: "runeterra.png",
    alt: "Legends of Runeterra Logo",
  },
  {
    id: 6,
    name: "Team Fight Tactics",
    src: "tft.png",
    alt: "Team Fight Tactics Logo",
  },
  {
    id: 7,
    name: "Valorant",
    src: "valorant.png",
    alt: "Valorant Logo",
  },
];

// TODO: Animation is choppy? Why?
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      selectedGame: null,
    };
    this.titleRef = createRef();
  }

  handleGameClick = (e, gameObj) => {
    // console.log(e.target.textContent);
    // console.log(gameObj);
    this.setState({ selectedGame: gameObj });
  };

  calculateHeight = (element) => {
    const titleHeight = this.titleRef.current.offsetHeight;
    const height = element.offsetHeight + titleHeight + 15;
    this.setState({ height: height });
  };

  render() {
    return (
      <div className="App" style={{ height: this.state.height }}>
        <div style={{ position: "relative" }}>
          <h3 ref={this.titleRef}>ESports News</h3>
          <SettingsCog />
        </div>

        <CSSTransition
          in={this.state.selectedGame === null}
          timeout={600}
          classNames="primary"
          unmountOnExit
          onEnter={this.calculateHeight}
        >
          <GameContainer games={games} onClick={this.handleGameClick} />
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
            goBack={() => this.setState({ selectedGame: null })}
          />
        </CSSTransition>
      </div>
    );
  }
}
