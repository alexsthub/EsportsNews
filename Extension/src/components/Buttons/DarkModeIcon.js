import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";

export default class DarkModeIcon extends React.Component {
  handleSettings = () => {
    console.log("GO TO SETTINGS SOMEHOW");
  };

  render() {
    return (
      <div
        className="cog"
        style={{ position: "absolute", bottom: 1.5, left: 5 }}
        onClick={this.props.onClick}
      >
        <FontAwesomeIcon style={{ strokeWidth: 50 }} icon={faMoon} />
      </div>
    );
  }
}
