import React from "react";
import GameListing from "./GameListing";
import PropTypes from "prop-types";
import "../styles/App.css";

export default class GameContainer extends React.Component {
  render() {
    const gameList = this.props.games.map((game) => {
      return (
        <GameListing
          key={game.name}
          game={game}
          onClick={(e, game) => this.props.onClick(e, game)}
        />
      );
    });

    return (
      <div className="games-container">
        <h4>My Games</h4>
        {gameList}
      </div>
    );
  }
}

GameContainer.propTypes = {
  game: PropTypes.array,
  onClick: PropTypes.func,
};
