import React from "react";
import PropTypes from "prop-types";
import "../styles/ArticleStyle.css";
import "../styles/App.css";

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
    const imageDiv = article.imageUrl ? (
      <div className="image-container">
        <img className="article-image" src={article.imageUrl} alt={"article"} />
      </div>
    ) : null;

    const descriptionElement = article.description ? (
      <p className="article-description limit-text">{article.description}</p>
    ) : null;

    return (
      <div className="article hover-background" onClick={(e) => this.handleClick(e, article.link)}>
        {imageDiv}
        <div style={{ width: "100%" }}>
          <p className="article-title limit-text">{article.title}</p>
          {descriptionElement}
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
