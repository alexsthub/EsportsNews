import React from "react";
import "./App.css";

import { CSSTransition } from "react-transition-group";
import GameListing from "./components/GameListing";

const games = [
  "Apex Legends",
  "Counter Strike: GO",
  "Fortnite",
  "League of Legends",
  "Legends of Runeterra",
  "Team Fight Tactics",
  "Valorant",
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeState: "primary",
    };
  }

  handleGameClick = (e) => {
    this.setState({ activeState: "secondary" });
  };

  render() {
    const gameList = games.map((g) => {
      return <GameListing key={g} game={g} onClick={this.handleGameClick} />;
    });

    return (
      <div className="App">
        <h3>ESports News</h3>

        <CSSTransition
          in={this.state.activeState === "primary"}
          timeout={500}
          classNames="primary"
          unmountOnExit
        >
          <div className="games-container">
            <h4>Games</h4>
            {gameList}
          </div>
        </CSSTransition>

        <CSSTransition
          in={this.state.activeState === "secondary"}
          timeout={500}
          classNames="secondary"
          unmountOnExit
        >
          <div onClick={() => this.setState({ activeState: "primary" })}>
            <p>GO BACK</p>
          </div>
        </CSSTransition>
      </div>
    );
  }
}
