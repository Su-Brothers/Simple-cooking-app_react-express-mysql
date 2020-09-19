import React, { useState } from "react";
import "./styles/mainpage.scss";
import { FaPenFancy } from "react-icons/fa";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TimeLine from "./TimeLine";
import { useEffect } from "react";
import { readHandler } from "../modules/post";
function MainPage() {
  //셀렉터 주의 : 같은 값을 디스패치해도 리액트에서는 다른 값으로본다.(ref가 다르다.) 가져올때 따로 가져오거나 shallowEqual를 사용
  const state = useSelector((state) => state.user.userData, shallowEqual); //얕은 복사
  const posts = useSelector((state) => state.post.posts);
  const isLoading = useSelector((state) => state.post.postsLoading); //로딩창
  const [sort, setSort] = useState("allFood");
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
    dispatch(readHandler(target));
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

  useEffect(() => {
    dispatch(readHandler("allFood")); //2번째 인자에 빈배열을 넣어줌으로서 마운트될때 한 번만 실행되도록함.
  }, []);
  return (
    <div className="main-container">
      <div className="main-category">{sortItem}</div>
      <Link to="/" className="main-write-feed">
        <div className="main-write-box">
          <img src="https://placeimg.com/100/100/any" alt="프로필 이미지" />
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
