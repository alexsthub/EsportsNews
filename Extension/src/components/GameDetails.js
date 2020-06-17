import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/App.css";

import Article from "./Article";

// TODO: Why do I render 3 times when I click?
export default class GameDetails extends React.Component {
  render() {
    if (!this.props.game) return null;

    const articleList =
      this.props.articleList && this.props.articleList.length > 0 ? (
        this.props.articleList.map((article) => {
          return <Article article={article} />;
        })
      ) : (
        <p style={{ marginTop: 15 }}>There are no available articles at this time.</p>
      );

    return (
      <div>
        <div
          className="back-details horizontal align-center hover-background"
          onClick={this.props.goBack}
        >
          <FontAwesomeIcon
            style={{ marginLeft: 10, marginRight: 10, fontSize: "1.5rem" }}
            icon={faArrowCircleLeft}
          />
          <h4>{this.props.game.name}</h4>
        </div>
        {articleList}
      </div>
    );
  }
}

GameDetails.propTypes = {
  game: PropTypes.object,
  goBack: PropTypes.func,
};
