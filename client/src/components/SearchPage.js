import Axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/postsStyle/tag-page.scss";
import TimeLine from "./TimeLine";
function SearchPage({ match }) {
  const [sort, setSort] = useState("popular");
  const [postList, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortList = [
    //정렬 리스트
    { name: "popular", koName: "인기순" },
    { name: "latest", koName: "최신순" },
    { name: "views", koName: "조회순" },
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

  const getPosts = (target) => {
    console.log(match.params.name);
    setLoading(false);
    Axios.get(`/api/post/search/${match.params.name}/${target}`)
      .then((res) => {
        if (res.data.success) {
          setList(res.data.result);
          setLoading(true);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPosts("popular");
  }, [match.params.name]);

  return (
    <div className="tag-page-container">
      <div className="tag-page-title">
        <span className="tag-page-title-tag">{`"${match.params.name}"`}</span>
        <span>에 대한 검색결과가 </span>
        <span className="tag-page-title-index">{postList.length}</span>
        <span>개 있습니다.</span>
      </div>
      <div className="sort-box">{sortItem}</div>
      {postList.length && loading
        ? postList.map((item) => (
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
          ))
        : "Loading..."}
    </div>
  );
}

export default SearchPage;
