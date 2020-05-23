import React from "react";
import PropTypes from "prop-types";

import "../App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default class GameListing extends React.Component {
  render() {
    return (
      <div className="game-listing" onClick={this.props.onClick}>
        <p>{this.props.game}</p>
        <FontAwesomeIcon className="listing-icon" icon={faChevronRight} />
      </div>
    );
  }
}

GameListing.propTypes = {
  game: PropTypes.string,
  onClick: PropTypes.func,
};
