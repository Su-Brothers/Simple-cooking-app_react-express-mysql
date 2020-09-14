import React, { useState } from "react";
import "./styles/mainpage.scss";
import { FaPenFancy } from "react-icons/fa";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TimeLine from "./TimeLine";
import { useEffect } from "react";
import { readHandler } from "../modules/post";
function MainPage() {
  useEffect(() => {
    dispatch(readHandler()); //2번째 인자에 빈배열을 넣어줌으로서 마운트될때 한 번만 실행되도록함.
  }, []);

  //셀렉터 주의 : 같은 값을 디스패치해도 리액트에서는 다른 값으로본다.(ref가 다르다.) 가져올때 따로 가져오거나 shallowEqual를 사용
  const state = useSelector((state) => state.user.userData, shallowEqual); //얕은 복사
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const [foodCategory, setFoodCategory] = useState({
    allFood: true,
    korea: false,
    china: false,
    japan: false,
    western: false,
  });

  const { allFood, korea, china, japan, western } = foodCategory;
  const categoryHandler = (target) => () => {
    const result = Object.entries(foodCategory).reduce((obj, item, i) => {
      obj[item[0]] = item[0] === target ? true : false;
      return obj;
    }, {});
    //배열로 변형시켜 순환시킨 다음 타겟과 이름이 클릭한 타겟과 이름이 같은것을 true로 반환
    setFoodCategory(result);
  };
  console.log(state);
  console.log(posts);
  return (
    <div className="main-container">
      <div className="main-category">
        <div
          className={`main-category-item ${allFood ? "active" : ""}`}
          onClick={categoryHandler("allFood")}
        >
          전체
        </div>
        <div
          className={`main-category-item ${korea ? "active" : ""}`}
          onClick={categoryHandler("korea")}
        >
          한식
        </div>
        <div
          className={`main-category-item ${china ? "active" : ""}`}
          onClick={categoryHandler("china")}
        >
          중식
        </div>
        <div
          className={`main-category-item ${japan ? "active" : ""}`}
          onClick={categoryHandler("japan")}
        >
          일식
        </div>
        <div
          className={`main-category-item ${western ? "active" : ""}`}
          onClick={categoryHandler("western")}
        >
          양식
        </div>
      </div>
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
      {posts.length > 0
        ? posts.map((item, index) => (
            <Link to={`/post/${item.board_no}`} key={item.board_no}>
              <TimeLine
                title={item.title}
                writer={item.writer}
                photo={item.board_img}
                date={item.date}
              />
            </Link>
          ))
        : "Loading..."}
    </div>
  );
}

export default MainPage;
