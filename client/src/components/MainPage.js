import React from "react";
import "./styles/mainpage.scss";

import { useSelector, shallowEqual } from "react-redux";
function MainPage() {
  //셀렉터 주의 : 같은 값을 디스패치해도 리액트에서는 다른 값으로본다.(ref가 다르다.) 가져올때 따로 가져오거나 shallowEqual를 사용
  const state = useSelector((state) => state.user.userData, shallowEqual); //얕은 복사
  console.log(state);

  return <div className="main-container">메인화면</div>;
}

export default MainPage;
