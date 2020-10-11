import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";
import MainPage from "./components/MainPage";
import NavBar from "./components/sides/NavBar";
import LoginPage from "./components/users/LoginPage";
import SignupPage from "./components/users/SignupPage";
import Auth from "./components/hoc/auth";
import AsideBar from "./components/sides/AsideBar";
import AsideChef from "./components/sides/AsideChef";
import WritePage from "./components/writes/WritePage";
import Post from "./components/posts/Post";
import EditPage from "./components/posts/edits/EditPage"; //수정 페이지
import TagPage from "./components/posts/TagPage"; //태그검색 페이지
import SearchPage from "./components/SearchPage"; //검색 페이지
import CookPage from "./components/cooks/CookPage"; //재료추천 페이지
import MyPage from "./components/users/MyPage";
import ChefPage from "./components/users/ChefPage"; //유저 페이지
import NotFound from "./components/NotFound"; //404
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
          <Route path="/signup" component={Auth(SignupPage, false)} />
          <Route path="/mypage" component={Auth(MyPage, true)} />
          <Route path="/write" component={Auth(WritePage, true)} />
          <Route path="/cook" component={Auth(CookPage)} />
          <Route exact path="/post/:postId" component={Auth(Post)} />
          <Route path="/post/:postId/edit" component={Auth(EditPage, true)} />
          <Route path="/post/tag/:name" component={Auth(TagPage)} />
          <Route path="/search/:name" component={Auth(SearchPage)} />
          <Route path="/chef/:no" component={Auth(ChefPage)} />
          <Route component={Auth(NotFound)} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
