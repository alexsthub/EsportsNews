import React from "react";
import PropTypes from "prop-types";
import "../ArticleStyle.css";
import "../App.css";

// TODO: Include image if exists
// TODO: Include description if exists?
export default class Article extends React.Component {
  handleClick = (e, link) => {
    e.stopPropagation();
    window.open(link, "_blank");
  };

  convertDate = (dateString) => {
    const date = new Date(dateString);
    const res =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + String(date.getFullYear()).substr(2);
    return res;
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const article = this.props.article;
    const date = this.convertDate(article.date_published);

    return (
      <div className="article" onClick={(e) => this.handleClick(e, article.link)}>
        <div>
          <p>Hello</p>
        </div>
        <div>
          <p className="article-title">{article.title}</p>
          <div className="horizontal article-info">
            <p>{date}</p>
            <p>{this.capitalizeFirstLetter(article.category)}</p>
          </div>
        </div>
      </div>
    );
  }
}

Article.propTypes = {
  article: PropTypes.object,
};
