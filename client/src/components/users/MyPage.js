import React, { useState } from "react";
import "../styles/mypage.scss";
import { FaQuoteLeft, FaQuoteRight, FaCog } from "react-icons/fa";
import ProfileSetting from "./ProfileSetting";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import TimeLine from "../TimeLine";
import Axios from "axios";
import { useCallback } from "react";
import { useRef } from "react";
import SkeletonLoading from "../loadingCompo/SkeletonLoading";
import normalProfile from "../../images/normal-profile.png";

function MyPage() {
  const user = useSelector((state) => state.user.userData, shallowEqual);
  const [sort, setSort] = useState("mypost");
  const [modal, setmodal] = useState(false);
  const [postList, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setisFirst] = useState(true);

  const limitItem = useRef(0); //페이징 처리용 리미트
  const isMounted = useRef(null);
  const sortList = [
    //정렬 리스트
    { name: "mypost", koName: "내가 쓴 글" },
    { name: "scrap", koName: "스크랩" },
  ];
  const onSortChange = (target) => () => {
    if (loading) {
      setSort(target);
      getPosts(target);
    }
  };
  const sortItem = sortList.map((item, index) => (
    //만들어논 리스트를 맵으로 돌린후 저장한다.
    //이 과정에서 item의 이름이 현재 상태와 같으면 active를 클래스로 준다.
    <button
      type="button"
      className={`${sort === item.name ? "active" : ""}`}
      onClick={onSortChange(item.name)}
      key={item.name}
    >
      {item.koName}
    </button>
  ));

  const onModalHandler = () => {
    setmodal(!modal); //모달 핸들러
  };

  const postsData = () => {
    //렌더링 될 포스트 데이터
    if (loading) {
      if (postList.length) {
        return postList.map((item, index) => (
          <TimeLine
            title={item.title}
            writer={item.writer}
            writerNo={item.user_no}
            profile={item.user_img}
            photo={item.board_img}
            date={item.date}
            url={item.board_no}
            likes={item.likes}
            co={item.co}
            type={item.food_type}
            views={item.board_views}
            des={item.description}
            key={item.board_no}
          />
        ));
      } else {
        //로딩이 다되었음에도 불구하고 length 가 0이면 결과가 없는것이다.
        return "조건에 맞는 데이터가 없습니다.";
      }
    } else {
      return null;
    }
  };

  const getPosts = (target) => {
    window.scrollTo(0, 0);
    limitItem.current = 0; //0으로 초기화
    setLoading(false);
    setIsEnd(false);
    Axios.get(
      `${process.env.REACT_APP_SERVER_HOST}/api/users/posts/${user._no}/${target}/${limitItem.current}`
    )
      .then((res) => {
        if (isMounted.current) {
          if (res.data.success) {
            setList(res.data.result);
            if (res.data.result.length < 10) {
              setIsEnd(true); //10개씩 가져오는데 그것 보다 작으면 그것이 최대이다.
            } else {
              if (limitItem.current === 0) {
                limitItem.current += 10; //10개보다 크거나 같을때만 +10을 해준다.
              }
            }
            setLoading(true);
          } else {
            alert(res.data.message);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const loadPosts = (target) => {
    if (!isEnd) {
      console.log(isEnd);
      Axios.get(
        `${process.env.REACT_APP_SERVER_HOST}/api/users/posts/${user._no}/${target}/${limitItem.current}`
      )
        .then((res) => {
          if (isMounted.current) {
            if (res.data.success) {
              setList([...postList, ...res.data.result]);
              if (res.data.result.length < 10) {
                console.log("isEnd");
                setIsEnd(true); //10개씩 가져오는데 그것 보다 작으면 그것이 최대이다.
              } else {
                limitItem.current += 10; //10개보다 크거나 같을때만 +10을 해준다.
              }
            } else {
              alert(res.data.message);
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("no Data");
    }
  };

  const onScrollHandler = useCallback(() => {
    const { clientHeight } = document.documentElement; //요소 높이
    const scrollTop = //남은 높이
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = //총 높이
      document.documentElement.scrollHeight || document.body.scrollHeight;
    //document.documentElement만 참조는 위험'
    if (
      Math.round(scrollTop) + clientHeight === scrollHeight &&
      clientHeight !== scrollHeight
    ) {
      loadPosts(sort);
    }

    //deps를 넣어줘야 최신 상태를 유지할 수 있다.
  }, [postList, isEnd, sort, user.isAuth]);
  useEffect(() => {
    isMounted.current = true;
    if (isFirst && user.isAuth) {
      getPosts("mypost");
      setisFirst(false);
    }
    window.addEventListener("scroll", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
      isMounted.current = false;
    };
  }, [onScrollHandler]);

  return (
    <>
      <div className="mypage-container">
        <div className="my-top">
          <div className="my-top-description-box">
            <button
              type="button"
              className="setting-btn"
              onClick={onModalHandler}
            >
              <FaCog />
              <span> 프로필 설정</span>
            </button>
            <div className="description-text">
              <FaQuoteLeft className="quote-left" />
              <span>
                {user._description
                  ? user._description
                  : "등록된 자기소개가 없습니다."}
              </span>
              <FaQuoteRight className="quote-right" />
            </div>
          </div>
          <div className="my-top-sort-box">
            <div className="my-img-box">
              {user._imgFile ? (
                <img
                  src={`${process.env.REACT_APP_IMG_URL}/${user._imgFile}`}
                  alt="프로필사진"
                />
              ) : (
                <img src={normalProfile} alt="프로필사진" />
              )}
            </div>
            {sortItem}
            <div className="user-name">{user._nickname}</div>
          </div>
        </div>
        <SkeletonLoading limit={5} active={loading} />
        {postsData()}
      </div>
      {modal && (
        <ProfileSetting
          onClose={onModalHandler}
          emailData={user._email}
          imgData={user._imgFile}
          nickData={user._nickname}
          desData={user._description}
          noData={user._no}
        />
      )}
    </>
  );
}

export default MyPage;
