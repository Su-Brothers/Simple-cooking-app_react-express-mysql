import React, { useState } from "react";
import "./styles/mypage.scss";
import { FaQuoteLeft, FaQuoteRight, FaWhmcs } from "react-icons/fa";
import ModalPortal from "../ModalPortal";
import ProfileSetting from "./ProfileSetting";
import { useSelector } from "react-redux";

function MyPage() {
  const user = useSelector((state) => state.user);

  const [category, setcategory] = useState({
    noticeList: true,
    myPost: false,
    like: false,
    notification: false,
  });

  const { noticeList, myPost, like, notification } = category;
  const categoryHandler = (target) => () => {
    const result = Object.entries(category).reduce((obj, item, i) => {
      obj[item[0]] = item[0] === target ? true : false;
      return obj;
    }, {});
    setcategory(result);
  };

  const [modal, setmodal] = useState(false);

  const OpenModalHandler = () => {
    setmodal(true);
  };

  const CloseModalHandler = () => {
    setmodal(false);
  };

  return (
    <div className="mypage_container">
      <div className="mypage_top">
        <div className="setting">
          <FaWhmcs size="40px" onClick={OpenModalHandler} />
          {modal && (
            <ModalPortal>
              <ProfileSetting onClose={CloseModalHandler} />
            </ModalPortal>
          )}{" "}
          {""}
        </div>
        <div className="picture_line">
          <div className="mypage_picture">
            <img
              src="https://placeimg.com/100/100/any"
              width="100%"
              height="100%"
              alt="프로필사진"
            />
          </div>
          <div className="name">{user.nickname}</div>
          <div className="follower"> 팔로워 : 0명</div>
          <div className="introduce_container">
            <div className="l_q">
              <FaQuoteLeft />
            </div>
            <div className="introduction">회원 정보가 없습니다.</div>
            <div className="r_q">
              <FaQuoteRight />
            </div>
          </div>
        </div>
      </div>
      <div className="mypage_middle">
        <div className="inner">
          <ul className="category">
            <li
              className={`category-item ${noticeList ? "active" : ""}`}
              onClick={categoryHandler("noticeList")}
            >
              공지사항
            </li>
            <li
              className={`category-item ${myPost ? "active" : ""}`}
              onClick={categoryHandler("myPost")}
            >
              나의 글
            </li>
            <li
              className={`category-item ${like ? "active" : ""}`}
              onClick={categoryHandler("like")}
            >
              나의 찜 목록
            </li>
            <li
              className={`category-item ${notification ? "active" : ""}`}
              onClick={categoryHandler("notification")}
            >
              알림
            </li>
          </ul>
        </div>
      </div>
      <div className="mypage_bottom">
        <div className="main">이곳에는 메인 글이 올라와요</div>
      </div>
    </div>
  );
}

export default MyPage;
