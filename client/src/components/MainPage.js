import React, { useState, useCallback, useRef, useEffect } from "react";
import "./styles/mainpage.scss";
import { FaPenFancy } from "react-icons/fa";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TimeLine from "./TimeLine";
import normalProfile from "../images/normal-profile.png"; //기본 이미지 사진
import { readHandler, readMoreHandler } from "../modules/post";
import SkeletonLoading from "./loadingCompo/SkeletonLoading";
import NotFound from "./NotFound";
function MainPage() {
  //셀렉터 주의 : 같은 값을 디스패치해도 리액트에서는 다른 값으로본다.(ref가 다르다.) 가져올때 따로 가져오거나 shallowEqual를 사용
  const state = useSelector((state) => state.user.userData, shallowEqual); //얕은 복사
  const posts = useSelector((state) => state.post.posts);
  const isLoading = useSelector((state) => state.post.postsLoading); //로딩창
  const [sort, setSort] = useState("allFood");
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setIsFirst] = useState(true); //처음렌더링인지 확인

  const limitItem = useRef(0); //페이징 처리용 리미트
  const isMounted = useRef(null);
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
    if (!isLoading) {
      return;
    }
    setSort(target);
    limitItem.current = 0;
    setIsEnd(false);
    dispatch(readHandler(target, limitItem.current, onEndHandler));
    if (limitItem.current === 0) {
      limitItem.current += 10;
    }
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
        return <NotFound item={"데이터"} />;
      }
    } else {
      return null;
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
      //loadPosts(sort);
      if (!isEnd) {
        dispatch(readMoreHandler(sort, limitItem.current, onEndHandler));
        limitItem.current += 10;
      } else {
        console.log("no data");
      }
    }
    //이벤트리스너에 등록하는경우 props나 state를 따르지 않는다.
  }, [posts, isEnd, sort, dispatch]);
  const onEndHandler = () => {
    if (isMounted.current) {
      //리덕스에서 이 함수를 사용하기 때문에 마운트가 되어 있을때만 되도록함
      setIsEnd(true);
    }
  };
  useEffect(() => {
    isMounted.current = true;
    if (isFirst) {
      dispatch(readHandler("allFood", limitItem.current, onEndHandler));
      limitItem.current += 10;
      setIsFirst(false);
    }
    window.addEventListener("scroll", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
      isMounted.current = false;
    };
  }, [onScrollHandler, dispatch, isFirst]);

  return (
    <div className="main-container">
      <div className="main-category">{sortItem}</div>
      <Link to="/write" className="main-write-feed">
        <div className="main-write-box">
          <div className="writer-img-box">
            {state.isAuth && state._imgFile ? (
              <img
                src={`${process.env.REACT_APP_IMG_URL}/${state._imgFile}`}
                alt="프로필사진"
              />
            ) : (
              <img src={normalProfile} alt="프로필사진" />
            )}
          </div>

          <div className="main-write-input">
            {state.isAuth ? `${state._nickname}님` : "어서오세요"}, 당신만의
            자취사전을 등록해주세요!
          </div>
          <div className="main-write-feed-btn">
            <FaPenFancy />
          </div>
        </div>
      </Link>
      <SkeletonLoading limit={5} active={isLoading} />
      {postsData()}
    </div>
  );
}

export default MainPage;
