import React from "react";
import "./styles/nav-var.scss";
import {
  FaCarrot,
  FaSearch,
  FaUserAlt,
  FaUtensils,
  FaCog,
} from "react-icons/fa";
function NavBar() {
  return (
    <header>
      <div className="header-left-menu">
        <div className="header-title-container">
          <FaCarrot className="header-title-icon" /> {/*임시*/}
          <span
            style={{
              color: "#f57c00",
              fontSize: "1.7rem",
              transform: "rotate(10deg)",
            }}
          >
            자
          </span>
          취요리
          <span
            style={{
              color: "#388e3c",
              fontSize: "1.7rem",
              transform: "rotate(-10deg)",
            }}
          >
            백
          </span>
          과사전
        </div>
        <div className="header-searader-search">
          <FaSearch className="header-search-icon" />
          <input type="text" placeholder="레시피를 입력하세요..." />
        </div>
      </div>

      <div className="header-right-menu">
        <FaUserAlt />
        <FaUtensils />
        <FaCog />
      </div>
    </header>
  );
}

export default NavBar;
