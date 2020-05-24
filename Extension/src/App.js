import React, { createRef } from "react";
import "./App.css";

import { CSSTransition } from "react-transition-group";
import GameContainer from "./components/GameContainer";

const games = [
  {
    name: "Apex Legends",
    src: "apex.png",
    alt: "Apex Legends Logo",
  },
  {
    name: "Counter Strike: GO",
    src: "counterstrike.png",
    alt: "Counter Strike Global Offensive Logo",
  },
  {
    name: "Fortnite",
    src: "fortnite.png",
    alt: "Fortnite Logo",
  },
  {
    name: "League of Legends",
    src: "league.png",
    alt: "League of Legends Logo",
  },
  {
    name: "Legends of Runeterra",
    src: "runeterra.png",
    alt: "Legends of Runeterra Logo",
  },
  {
    name: "Team Fight Tactics",
    src: "tft.png",
    alt: "Team Fight Tactics Logo",
  },
  {
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
          timeout={600}
          classNames="primary"
          unmountOnExit
          onEnter={this.calculateHeight}
        >
          <GameContainer games={games} onClick={this.handleGameClick} />
        </CSSTransition>

        <CSSTransition
          in={this.state.activeState === "secondary"}
          timeout={600}
          classNames="secondary"
          unmountOnExit
          onEnter={this.calculateHeight}
        >
          <Test onClick={() => this.setState({ activeState: "primary" })} />
        </CSSTransition>
      </div>
    );
  }
}

class Test extends React.Component {
  componentDidMount = () => {
    console.log("MOUNTING TEST");
  };

  render() {
    return (
      <div onClick={this.props.onClick}>
        <p>GO BACK</p>
      </div>
    );
  }
}
