import React from "react";
import "../styles/nav-var.scss";
import {
  FaSearch,
  FaUserAlt,
  FaUtensils,
  FaTrophy,
  FaUser,
  FaEdit,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

import logo from "../../images/jabakLogo_v4.png";
import { withRouter, Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useEffect } from "react";
import { debounce } from "lodash";
import { useRef } from "react";
import CookModal from "../cooks/CookModal";
import AsideChefMini from "./AsideChefMini";

function NavBar({ location, history }) {
  const userState = useSelector((state) => state.user.userData.isAuth);

  const [search, setSearch] = useState("");
  const [userIcon, setUserIcon] = useState(false); //유저 모달 관리
  const [cookModal, setCookModal] = useState(false); //쿡모달 관리
  const [userRanking, setUserRanking] = useState(false); //요리사 랭킹
  const scrollPos = useRef(0);

  const onSearchHandler = (e) => {
    setSearch(e.target.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (search === "") {
      return;
    }
    setSearch("");
    history.push(`/search/${search}`);
  };

  const logoutHandler = debounce(
    async () => {
      const data = await Axios.get(
        `${process.env.REACT_APP_SERVER_HOST}/api/users/logout`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (data.success) {
        //삭제 되었으면 메인페이지로 이동.
        //history.push 는 새로고침이 안됨.
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    },
    300,
    { leading: true, trailing: false }
  );

  const onDebounceLogOut = (e) => {
    //디바운스 처리
    e.preventDefault();
    logoutHandler();
  };

  const onModalHandler = (e) => {
    //isChange는 주소가 변경되었을시에 true가 온다.
    if (e) {
      //aside에 있는 cook은 a태그임으로 전파를 막아줘야한다.
      e.preventDefault();
    }
    //모달창 띄웠을때 body의 스크롤 이벤트를 막는다.
    if (!cookModal) {
      //위치를 기억해놨다가 close할때 그 위치로 이동시킨다.
      scrollPos.current =
        document.documentElement.scrollTop || document.body.scrollTop;
      document.body.className = "modal";
      document.body.style.top = `-${scrollPos.current}px`;
    } else {
      document.body.className = "";
      document.body.style.removeProperty("top");
      window.scrollTo(0, scrollPos.current);
    }
    setCookModal(!cookModal);
    setUserIcon(false);
    setUserRanking(false);
  };

  const onUserHandler = (e) => {
    e.preventDefault();
    setUserIcon(!userIcon);
    setCookModal(false);
    setUserRanking(false);
  };
  const onChefHandler = (e) => {
    e.preventDefault();
    setUserRanking(!userRanking);
    setUserIcon(false);
    setCookModal(false);
  };

  const routeHandler = () => {
    //라우트 이동할때 모달창 닫는 용도
    setUserRanking(false);
    setUserIcon(false);
    setCookModal(false);
  };

  useEffect(() => {
    routeHandler();
    return () => {
      document.body.className = "";
      document.body.style.removeProperty("top");
      window.scrollTo(
        0,
        document.documentElement.scrollTop || document.body.scrollTop
      );
    };
  }, [location.pathname]);

  return location.pathname !== "/login" && location.pathname !== "/signup" ? (
    <>
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
          <div className="right-menu-item item-user">
            <div className={`user-box ${userIcon ? "active" : ""}`}>
              <Link to="/mypage">
                <FaUser />
                마이페이지
              </Link>
              <Link to="/write">
                <FaEdit />
                레시피 작성
              </Link>
              {userState ? (
                <a
                  href="_blank"
                  onClick={onDebounceLogOut}
                  className="right-menu-item-link"
                >
                  <FaSignOutAlt />
                  로그아웃
                </a>
              ) : (
                <Link to="/login" className="right-menu-item-link">
                  <FaSignInAlt />
                  로그인
                </Link>
              )}
            </div>
            <a
              href="_blank"
              onClick={onUserHandler}
              className="right-menu-item-link"
            >
              <FaUserAlt />
            </a>
          </div>

          <div className="right-menu-item">
            <a
              href="_blank"
              className="right-menu-item-link"
              onClick={onModalHandler}
            >
              <FaUtensils />
            </a>
          </div>

          <div className="right-menu-item item-rank">
            {userRanking ? <AsideChefMini /> : null}

            <a
              href="_blank"
              className="right-menu-item-link"
              onClick={onChefHandler}
            >
              <FaTrophy />
            </a>
          </div>
        </div>
      </header>
      {cookModal ? (
        <CookModal history={history} onExit={onModalHandler} />
      ) : null}
    </>
  ) : null;
}

export default withRouter(NavBar);
