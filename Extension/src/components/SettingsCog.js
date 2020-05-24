import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

// TODO: Go to settings
export default class SettingsCog extends React.Component {
  handleSettings = () => {
    console.log("GO TO SETTINGS SOMEHOW");
  };

  render() {
    return (
      <div
        className="cog"
        style={{ position: "absolute", bottom: 1.5, right: 5 }}
        onClick={this.handleSettings}
      >
        <FontAwesomeIcon icon={faCog} />
      </div>
    );
  }
}
