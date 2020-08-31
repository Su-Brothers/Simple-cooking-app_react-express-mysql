import React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import "./App.scss";
import MainPage from "./components/MainPage";
import NavBar from "./components/NavBar";
import RankPage from "./components/RankPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Auth from "./components/hoc/auth";
import MyPage from "./components/MyPage";
import AsideBar from "./components/AsideBar";
import AsideChef from "./components/AsideChef";
import WritePage from "./components/writes/WritePage";

function App(props) {
  return (
    <BrowserRouter>
      <NavBar />
      <AsideBar />
      <AsideChef />
      <main>
        <Switch>
          <Route exact path="/" component={Auth(MainPage)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route path="/ranking" component={Auth(RankPage)} />
          <Route path="/signup" component={Auth(SignupPage, false)} />
          <Route path="/mypage" component={Auth(MyPage, true)} />
          <Route path="/write" component={Auth(WritePage, true)} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
