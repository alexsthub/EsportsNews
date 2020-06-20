import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default class NotificationBell extends React.Component {
  render() {
    const number = this.props.number;
    const numberElement = number ? (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 1,
          height: 10,
          width: 10,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          backgroundColor: "red",
        }}
      >
        <p style={{ fontSize: 7 }}>{number}</p>
      </div>
    ) : null;
    return (
      <div style={{ marginRight: 8, position: "relative" }}>
        {numberElement}
        <FontAwesomeIcon style={{ width: 20, height: 20, zIndex: 1 }} icon={faBell} />
      </div>
    );
  }
}
