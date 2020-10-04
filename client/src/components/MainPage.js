import React, { useState } from "react";
import "./styles/mainpage.scss";
import { FaPenFancy } from "react-icons/fa";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TimeLine from "./TimeLine";
import { useEffect } from "react";
import { readHandler, readMoreHandler } from "../modules/post";
import { useRef } from "react";
import { useCallback } from "react";
function MainPage({ history }) {
  //셀렉터 주의 : 같은 값을 디스패치해도 리액트에서는 다른 값으로본다.(ref가 다르다.) 가져올때 따로 가져오거나 shallowEqual를 사용
  const state = useSelector((state) => state.user.userData, shallowEqual); //얕은 복사
  const posts = useSelector((state) => state.post.posts);
  const isLoading = useSelector((state) => state.post.postsLoading); //로딩창
  const [sort, setSort] = useState("allFood");
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setIsFirst] = useState(true); //처음렌더링인지 확인

  const limitItem = useRef(0); //페이징 처리용 리미트

  const dispatch = useDispatch();
  const sortList = [
    //정렬 리스트
    { name: "allFood", koName: "전체" },
    { name: "korea", koName: "한식" },
    { name: "china", koName: "중식" },
    { name: "japan", koName: "일식" },
    { name: "western", koName: "양식" },
  ];
  const onSortChange = (target) => () => {
    setSort(target);
    limitItem.current = 0;
    setIsEnd(false);
    dispatch(readHandler(target, limitItem.current, onEndHandler));
    limitItem.current += 10;
  };

  const sortItem = sortList.map((item, index) => (
    //만들어논 리스트를 맵으로 돌린후 저장한다.
    //이 과정에서 item의 이름이 현재 상태와 같으면 active를 클래스로 준다.
    <div
      className={`main-category-item ${sort === item.name ? "active" : ""}`}
      key={item.name}
      onClick={onSortChange(item.name)}
    >
      {item.koName}
    </div>
  ));

  const postsData = () => {
    //렌더링 될 포스트 데이터
    if (isLoading) {
      //데이터를 다 받아오면 true가된다.
      if (posts.length) {
        return posts.map((item, index) => (
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
        return "결과가 없습니다.";
      }
    } else {
      return "loading...";
    }
  };

  const onScrollHandler = useCallback(() => {
    const { clientHeight } = document.documentElement; //요소 높이
    const scrollTop = //남은 높이
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = //총 높이
      document.documentElement.scrollHeight || document.body.scrollHeight;
    //document.documentElement만 참조는 위험'
    console.log(sort);
    if (
      Math.round(scrollTop) + clientHeight === scrollHeight &&
      clientHeight !== scrollHeight
    ) {
      console.log("맨끝");
      //loadPosts(sort);
      if (!isEnd) {
        console.log(posts.length);
        console.log(limitItem.current);
        dispatch(readMoreHandler(sort, limitItem.current, onEndHandler));
        limitItem.current += 10;
      } else {
        console.log("데이터가 없습니다.");
      }
    }
    //이벤트리스너에 등록하는경우 props나 state를 따르지 않는다.
  }, [posts.length, isEnd, sort]);
  const onEndHandler = () => {
    setIsEnd(true);
  };
  useEffect(() => {
    if (isFirst) {
      console.log("처음");
      dispatch(readHandler("allFood", limitItem.current, onEndHandler));
      limitItem.current += 10;
      setIsFirst(false);
    }
    window.addEventListener("scroll", onScrollHandler);
    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [onScrollHandler]);

  return (
    <div className="main-container">
      <div className="main-category">{sortItem}</div>
      <Link to="/" className="main-write-feed">
        <div className="main-write-box">
          {state.isAuth && state._imgFile ? (
            <img
              src={`http://localhost:5000/${state._imgFile}`}
              alt="프로필사진"
            />
          ) : (
            <img
              src={`http://localhost:5000/uploads/normal-profile.png`}
              alt="프로필사진"
            />
          )}
          <div className="main-write-input">
            {state.isAuth ? `${state._nickname}님` : "어서오세요"}, 당신만의
            자취사전을 등록해주세요!
          </div>
          <div className="main-write-feed-btn">
            <FaPenFancy />
          </div>
        </div>
      </Link>
      {postsData()}
    </div>
  );
}

export default MainPage;
