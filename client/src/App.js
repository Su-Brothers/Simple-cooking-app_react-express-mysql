import React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import "./App.scss";
import MainPage from "./components/MainPage";
import NavBar from "./components/NavBar";
import RankPage from "./components/RankPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Auth from "./components/hoc/auth";
import AsideBar from "./components/AsideBar";

function App(props) {
  return (
    <BrowserRouter>
      <NavBar />
      <AsideBar />
      <main>
        <Switch>
          <Route exact path="/" component={Auth(MainPage)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route path="/ranking" component={Auth(RankPage)} />
          <Route path="/signup" component={Auth(SignupPage, false)} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
