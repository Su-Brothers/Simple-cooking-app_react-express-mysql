import React from "react";
import "./styles/nav-var.scss";
import { FaSearch, FaUserAlt, FaUtensils, FaCog } from "react-icons/fa";
import logo from "../images/jabakLogo_v4.png";
import { withRouter, Link } from "react-router-dom";
import { useState } from "react";

function NavBar({ location, history }) {
  const [search, setSearch] = useState("");

  const onSearchHandler = (e) => {
    setSearch(e.target.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    history.push(`/search/${search}`);
  };
  return location.pathname !== "/login" && location.pathname !== "/signup" ? (
    <header>
      <div className="header-left-menu">
        <div className="header-title-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="header-title-icon" />
          </Link>
        </div>
        <div className="header-search">
          <form type="submit" onSubmit={onSubmitHandler}>
            <button type="submit" onClick={onSubmitHandler}>
              <FaSearch className="header-search-icon" />
            </button>
            <input
              type="text"
              placeholder="레시피를 입력하세요..."
              value={search}
              onChange={onSearchHandler}
            />
          </form>
        </div>
      </div>

      <div className="header-right-menu">
        <Link to="/">
          <FaUserAlt />
        </Link>
        <Link to="/">
          <FaUtensils />
        </Link>
        <Link to="/">
          <FaCog />
        </Link>
      </div>
    </header>
  ) : null;
}

export default withRouter(NavBar);
