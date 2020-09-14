import React from "react";
import logo from "../images/jabakLogo_v3.png";
import "./styles/loading.scss";
function Loading() {
  return (
    <div className="loading">
      <img src={logo} alt="Logo" className="loading-logo" />
    </div>
  );
}

export default Loading;
