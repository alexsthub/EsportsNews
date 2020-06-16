import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/App.css";

import Article from "./Article";

const articles = [
  {
    id: 215,
    title: "The Masters Tour Online: Jönköping Champion is Here!",
    description: "The Masters Tour Online: Jönköping Champion Has Been Crowned!",
    link:
      "https://playhearthstone.com/en-us/news/23453348/the-masters-tour-online-jonkoping-champion-is-here",
    imageUrl:
      "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/m5/M5AKGW2KN8OJ1592177138948.jpg",
    category: "general",
    game_id: 4,
    date_published: "2020-06-14T00:00:00.000Z",
  },
  {
    id: 216,
    title: "Masters Tour Online: Jönköping Viewer’s Guide",
    description: "The third Masters Tour stop of 2020 is ready to begin!",
    link:
      "https://playhearthstone.com/en-us/news/23445056/masters-tour-online-jonkoping-viewer-s-guide",
    imageUrl:
      "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/dg/DGYI066KD7XT1591723519844.jpg",
    category: "general",
    game_id: 4,
    date_published: "2020-06-11T00:00:00.000Z",
  },
  {
    id: 217,
    title: "Grandmasters 2020 Season 1 Champions Are Heading to the World Championship!",
    description:
      "Grandmasters 2020 Season 1 has come to an epic end, and three players are heading to the Hearthstone World Championship later this year!",
    link:
      "https://playhearthstone.com/en-us/news/23445055/grandmasters-2020-season-1-champions-are-heading-to-the-world-championship",
    imageUrl:
      "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/qz/QZYMO6HQN8F41591722973768.jpg",
    category: "general",
    game_id: 4,
    date_published: "2020-06-09T00:00:00.000Z",
  },
  {
    id: 218,
    title: "Welcome to the Felfire Festival of Music and VENGEANCE",
    description:
      "The Felfire Festival brings Pirates to Battlegrounds, the Trial by Felfire Story Adventure, and more!",
    link:
      "https://playhearthstone.com/en-us/news/23440115/welcome-to-the-felfire-festival-of-music-and-vengeance",
    imageUrl:
      "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/0g/0GRDLTFI3PAO1591215496291.jpg",
    category: "general",
    game_id: 4,
    date_published: "2020-06-08T00:00:00.000Z",
  },
  {
    id: 219,
    title: "17.4 Patch Notes",
    description:
      "The Felfire Festival welcomes Pirates to Battlegrounds, the Trial by Felfire Solo Adventure, and more!",
    link: "https://playhearthstone.com/en-us/news/23440114/17-4-patch-notes",
    imageUrl:
      "https://bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/dz/DZN87DZTB8JE1590770110974.jpg",
    category: "update",
    game_id: 4,
    date_published: "2020-06-08T00:00:00.000Z",
  },
];

// TODO: We need to transition back but if we do, game prop is null
export default class GameDetails extends React.Component {
  render() {
    if (!this.props.game) return null;

    const articleList = articles.map((article) => {
      return <Article article={article} />;
    });

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
