import React from "react";
import "./styles/mainpage.scss";

import { useSelector } from "react-redux";
function MainPage() {
  const state = useSelector((state) => state.user);
  console.log(state);
  return <div className="main-container">메인화면</div>;
}

export default MainPage;
