import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "../../styles/App.css";

/* global chrome */

export default class SettingsCog extends React.Component {
  handleSettings = (e) => {
    e.stopPropagation();
    chrome.runtime.openOptionsPage();
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
