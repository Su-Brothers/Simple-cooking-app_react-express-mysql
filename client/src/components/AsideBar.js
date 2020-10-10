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
import CookModal from "./CookModal";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { debounce } from "lodash";
function AsideBar({ location, history, match }) {
  const userState = useSelector((state) => state.user.userData.isAuth);
  const [isModal, setIsModal] = useState(false);
  const scrollPos = useRef(0);
  const logoutHandler = debounce(
    async () => {
      console.log("logout");
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
    if (!isModal) {
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
    setIsModal(!isModal);
  };
  useEffect(() => {
    setIsModal(false);
    return () => {
      document.body.className = "";
      document.body.style.removeProperty("top");
      window.scrollTo(
        0,
        document.documentElement.scrollTop || document.body.scrollTop
      );
    };
  }, [location.pathname]);

  return location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/write" ? (
    <>
      <aside className="left-aside">
        <div className="left-aside-list">
          <div className="left-aside-item">
            <Link to="/mypage">
              <FaUser />
              마이페이지
            </Link>
          </div>
          <div className="left-aside-item">
            <a href="_blank" onClick={onModalHandler}>
              <FaUtensils className="icon-borderd item-spoonfork" />
              COOK
            </a>
          </div>
          <div className="left-aside-item">
            <Link to="/write">
              <FaEdit />
              글쓰기
            </Link>
          </div>
          <div className="left-aside-item">
            {userState ? (
              <a href="_blank" onClick={onDebounceLogOut}>
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
      {isModal ? <CookModal history={history} onExit={onModalHandler} /> : null}
    </>
  ) : null;
}

export default withRouter(AsideBar);
