import React, { createRef } from "react";
import "./App.css";

import { CSSTransition } from "react-transition-group";
import GameContainer from "./components/GameContainer";

const games = [
  "Apex Legends",
  "Counter Strike: GO",
  "Fortnite",
  "League of Legends",
  "Legends of Runeterra",
  "Team Fight Tactics",
  "Valorant",
];

// TODO: Animation is choppy? Why?
// TODO: Add different game logos to each
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      activeState: "primary",
    };
    this.titleRef = createRef();
  }

  handleGameClick = (e) => {
    console.log(e.target);
    this.setState({ activeState: "secondary" });
  };

  calculateHeight = (element) => {
    const titleHeight = this.titleRef.current.offsetHeight;
    const height = element.offsetHeight + titleHeight + 15;
    this.setState({ height: height });
  };

  render() {
    return (
      <div className="App" style={{ height: this.state.height }}>
        <h3 ref={this.titleRef}>ESports News</h3>

        <CSSTransition
          in={this.state.activeState === "primary"}
          timeout={800}
          classNames="primary"
          unmountOnExit
          onEnter={this.calculateHeight}
        >
          <GameContainer games={games} onClick={this.handleGameClick} />
        </CSSTransition>

        <CSSTransition
          in={this.state.activeState === "secondary"}
          timeout={800}
          classNames="secondary"
          unmountOnExit
          onEnter={this.calculateHeight}
        >
          <div onClick={() => this.setState({ activeState: "primary" })}>
            <p>GO BACK</p>
          </div>
        </CSSTransition>
      </div>
    );
  }
}
