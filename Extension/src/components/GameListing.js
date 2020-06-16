import React from "react";
import PropTypes from "prop-types";

import "../App.css";

export default class GameListing extends React.Component {
  render() {
    return (
      <div
        className="game-listing horizontal hover-background"
        onClick={(e) => this.props.onClick(e, this.props.game)}
      >
        <div className="horizontal align-center">
          <img
            className="game-logo"
            src={`/gamelogos/${this.props.game.src}`}
            alt={this.props.game.alt}
          />
          <p className="game-title">{this.props.game.name}</p>
        </div>
      </div>
    );
  }
}

GameListing.propTypes = {
  game: PropTypes.object,
  onClick: PropTypes.func,
};
