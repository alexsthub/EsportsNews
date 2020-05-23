import React from "react";
import GameListing from "./GameListing";
import PropTypes from "prop-types";
import "../App.css";

export default class GameContainer extends React.Component {
  render() {
    const gameList = this.props.games.map((g) => {
      return <GameListing key={g} game={g} onClick={this.props.onClick} />;
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
