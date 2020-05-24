import React from "react";
import PropTypes from "prop-types";

import "../App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default class GameListing extends React.Component {
  render() {
    return (
      <div className="game-listing horizontal" onClick={this.props.onClick}>
        <div className="horizontal align-center">
          <img
            className="game-logo"
            src={`/gamelogos/${this.props.game.src}`}
            alt={this.props.game.alt}
          />
          <p className="game-title">{this.props.game.name}</p>
        </div>
        {/* <FontAwesomeIcon className="listing-icon" icon={faChevronRight} /> */}
      </div>
    );
  }
}

GameListing.propTypes = {
  game: PropTypes.string,
  onClick: PropTypes.func,
};
