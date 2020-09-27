import React from "react";
import qs from "qs";
import { useEffect } from "react";
import { useState } from "react";
import "./styles/postsStyle/tag-page.scss";
import TimeLine from "./TimeLine";
import Axios from "axios";
import { useRef } from "react";
import { useCallback } from "react";
function CookPage({ location }) {
  const ingres = qs.parse(location.search, {
    ignoreQueryPrefix: true, //?뺴고 파싱
  });
  const [sort, setSort] = useState("exact");
  const [postList, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setisFirst] = useState(true);
  const [prevName, setPrevName] = useState("");

  const limitItem = useRef(0); //페이징 처리용 리미트
  const sortList = [
    //정렬 리스트
    { name: "exact", koName: "정확순" },
    { name: "latest", koName: "최신순" },
    { name: "popular", koName: "인기순" },
  ];
  const onSortChange = (target) => () => {
    setSort(target);
    getPosts(target);
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

  const postsData = () => {
    //렌더링 될 포스트 데이터
    if (loading) {
      if (postList.length) {
        return postList.map((item, index) => (
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
        return "조건에 맞는 데이터가 없습니다.";
      }
    } else {
      return "loading...";
    }
  };

  const getPosts = (target) => {
    limitItem.current = 0; //0으로 초기화
    setLoading(false);
    setIsEnd(false);
    Axios.get(
      `/api/post/cook/getposts/${ingres.names}/${target}/${limitItem.current}`
    )
      .then((res) => {
        if (res.data.success) {
          setList(res.data.result);
          if (res.data.result.length < 10) {
            console.log("isEnd");
            setIsEnd(true); //10개씩 가져오는데 그것 보다 작으면 그것이 최대이다.
          } else {
            limitItem.current += 10; //10개보다 크거나 같을때만 +10을 해준다.
          }
          setLoading(true);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };
  const loadPosts = (target) => {
    console.log(target);
    console.log(postList);
    if (!isEnd) {
      console.log(isEnd);
      Axios.get(
        `/api/post/cook/getposts/${ingres.names}/${target}/${limitItem.current}`
      )
        .then((res) => {
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
        })
        .catch((err) => console.log(err));
    } else {
      console.log("데이터가 없습니다.");
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
    if (scrollTop + clientHeight === scrollHeight) {
      console.log("맨끝");
      loadPosts(sort);
    }
    //postList의 길이를 넣어준 이유는 중첩객체이기 때문에 항상 다른값으로 인식한다.
    //deps를 넣어줘야 최신 상태를 유지할 수 있다. 이벤트리스너에 등록하는경우 props나 state를 따르지 않는다.
  }, [postList.length, isEnd, sort]);

  useEffect(() => {
    if (isFirst) {
      console.log("??");
      getPosts("exact");
      setisFirst(false);
      setPrevName(ingres.names);
    } else if (prevName !== ingres.names) {
      console.log("성공");
      getPosts("exact");
      setSort("exact");
      setPrevName(ingres.names);
    }
    window.addEventListener("scroll", onScrollHandler);
    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [onScrollHandler, ingres.names]);

  return (
    <div className="tag-page-container">
      <div className="tag-page-title">
        <span className="tag-page-title-tag">{`"${ingres.names}"`}</span>
        <span>에 대한 검색결과가 </span>
        <span className="tag-page-title-index">{postList.length}</span>
        <span>개 있습니다.</span>
      </div>
      <div className="sort-box">{sortItem}</div>
      {postsData()}
    </div>
  );
}

export default CookPage;
