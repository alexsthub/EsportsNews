import React from "react";
import GameListing from "./GameListing";
import PropTypes from "prop-types";
import "../styles/App.css";
/* global chrome */

export default class GameContainer extends React.Component {
  goToSubscriptions = (e) => {
    e.stopPropagation();
    chrome.runtime.openOptionsPage();
  };

  render() {
    const gameList =
      this.props.subscriptions.length > 0 ? (
        this.props.subscriptions.map((game) => {
          return (
            <GameListing
              key={game.name}
              game={game}
              articles={this.props.articles[game.id]}
              onClick={(e, game) => this.props.onClick(e, game)}
            />
          );
        })
      ) : (
        <div>
          <p>You aren't subscribed to any games. Click below to subscribe to some!</p>
          <div className="go-subscriptions hover-background" onClick={this.goToSubscriptions}>
            <p>Subscriptions</p>
          </div>
        </div>
      );

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
