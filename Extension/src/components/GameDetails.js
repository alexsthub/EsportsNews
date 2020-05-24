import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

// TODO: We need to transition back but if we do, game prop is null
export default class GameDetails extends React.Component {
  render() {
    if (!this.props.game) return null;
    return (
      <div
        className="back-details horizontal align-center"
        onClick={this.props.goBack}
      >
        <FontAwesomeIcon
          style={{ marginLeft: 10, marginRight: 10, fontSize: "1.5rem" }}
          icon={faArrowCircleLeft}
        />
        <h4>{this.props.game.name}</h4>
      </div>
    );
  }
}

GameDetails.propTypes = {
  game: PropTypes.object,
  goBack: PropTypes.func,
};
