import React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import "./App.scss";
import MainPage from "./components/MainPage";
import NavBar from "./components/NavBar";
import RankPage from "./components/RankPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App(props) {
  return (
    <BrowserRouter>
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route path="/ranking" component={RankPage} />
          <Route path="/signup" component={SignupPage} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
