import React from "react";
import PropTypes from "prop-types";

import NotificationBell from "./NotificationBell";
import "../styles/App.css";

export default class GameListing extends React.Component {
  calculateNumberNew(articles) {
    let num = 0;
    articles.forEach((article) => {
      if (!article.visited) num += 1;
    });
    return num;
  }

  render() {
    const numberOfNewArticles = this.calculateNumberNew(this.props.articles);
    const numAlert =
      numberOfNewArticles > 0 ? <NotificationBell number={numberOfNewArticles} /> : null;

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
        {numAlert}
      </div>
    );
  }
}

GameListing.propTypes = {
  game: PropTypes.object,
  onClick: PropTypes.func,
};
