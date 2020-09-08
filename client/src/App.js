import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
import NewMyPage from "./components/NewMyPage";
import WritePage from "./components/writes/WritePage";
import Post from "./components/posts/Post";

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
          <Route path="/newmypage" component={Auth(NewMyPage)} />
          <Route path="/write" component={Auth(WritePage, true)} />
          <Route path="/post/:postId" component={Auth(Post)} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
