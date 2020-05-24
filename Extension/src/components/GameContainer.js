import React from "react";
import GameListing from "./GameListing";
import PropTypes from "prop-types";
import "../App.css";

export default class GameContainer extends React.Component {
  componentDidMount = () => {
    console.log("MOUNTING");
  };

  render() {
    const gameList = this.props.games.map((game) => {
      return (
        <GameListing key={game.name} game={game} onClick={this.props.onClick} />
      );
    });

    return (
      <div className="games-container">
        <h4>Games</h4>
        {gameList}
      </div>
    );
  }
}

GameContainer.propTypes = {
  game: PropTypes.array,
  onClick: PropTypes.func,
};
