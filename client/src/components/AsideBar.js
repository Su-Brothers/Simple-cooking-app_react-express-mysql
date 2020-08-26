import React from "react";
import "./styles/aside-bar.scss";
import { Link, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaTrophy,
  FaUtensils,
  FaStar,
  FaEdit,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Axios from "axios";
function AsideBar({ location }) {
  const userState = useSelector((state) => state.user.userData.isAuth);

  const logoutHandler = async (e) => {
    e.preventDefault();
    const data = await Axios.get("/api/users/logout")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (data.success) {
      //삭제 되었으면 메인페이지로 이동.
      //history.push 는 새로고침이 안됨.
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  };

  return location.pathname !== "/login" && location.pathname !== "/signup" ? (
    <aside className="left-aside">
      <div className="left-aside-list">
        <div className="left-aside-item">
          <Link to="/mypage">
            <FaUser />
            마이페이지
          </Link>
        </div>
        <div className="left-aside-item">
          <Link to="/ranking">
            <FaTrophy className="icon-borderd item-ranking" />
            랭킹
          </Link>
        </div>
        <div className="left-aside-item">
          <Link to="/">
            <FaStar className="icon-borderd item-star" />
            찜목록
          </Link>
        </div>
        <div className="left-aside-item">
          <Link to="/">
            <FaUtensils className="icon-borderd item-spoonfork" />
            COOK
          </Link>
        </div>
        <div className="left-aside-item">
          <Link to="/">
            <FaEdit />
            글쓰기
          </Link>
        </div>
        <div className="left-aside-item">
          {userState ? (
            <a href="#" onClick={logoutHandler}>
              <FaSignOutAlt />
              로그아웃
            </a>
          ) : (
            <Link to="/login">
              <FaSignInAlt />
              로그인
            </Link>
          )}
        </div>
      </div>
    </aside>
  ) : null;
}

export default withRouter(AsideBar);
