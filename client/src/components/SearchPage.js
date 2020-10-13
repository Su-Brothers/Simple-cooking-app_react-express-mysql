import Axios from "axios";
import React from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { debounce } from "lodash";
import SkeletonLoading from "./loadingCompo/SkeletonLoading";
import "./styles/postsStyle/tag-page.scss";
import TimeLine from "./TimeLine";
import NotFound from "./NotFound";
function SearchPage({ match }) {
  const [sort, setSort] = useState("popular");
  const [postList, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setisFirst] = useState(true);
  const [prevName, setPrevName] = useState(""); //라우트로 이동시 전페이지의 값과 비교하기 위해 사용

  const limitItem = useRef(0); //페이징 처리용 리미트
  const isMounted = useRef(null);
  const sortList = [
    //정렬 리스트
    { name: "popular", koName: "인기순" },
    { name: "latest", koName: "최신순" },
    { name: "views", koName: "조회순" },
  ];
  const onSortChange = (target) => () => {
    //데이터가 중첩되지 않도록 방지한다.
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
        return <NotFound item={"검색결과"} />;
      }
    } else {
      return null;
    }
  };

  const getPosts = (target, params = match.params.name) => {
    window.scrollTo(0, 0);
    limitItem.current = 0; //0으로 초기화
    setLoading(false);
    setIsEnd(false);
    Axios.get(
      `${process.env.REACT_APP_SERVER_HOST}/api/post/search/${params}/${target}/${limitItem.current}`
    )
      .then((res) => {
        if (isMounted.current) {
          if (res.data.success) {
            setList(res.data.result);
            if (res.data.result.length < 10) {
              setIsEnd(true); //10개씩 가져오는데 그것 보다 작으면 그것이 최대이다.
            } else {
              if (limitItem.current === 0) {
                //중복 방지
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
    if (!isEnd && prevName === match.params.name) {
      Axios.get(
        `${process.env.REACT_APP_SERVER_HOST}/api/post/search/${match.params.name}/${target}/${limitItem.current}`
      )
        .then((res) => {
          if (isMounted.current) {
            if (res.data.success) {
              setList([...postList, ...res.data.result]);
              if (res.data.result.length < 10) {
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
  const onChangeRoute = useCallback(
    debounce(
      (params) => {
        //뒤로가기나 앞으로가기를 과도하게 누를 경우 데이터가 손실,변경될 수 있으므로 디바운스처리
        //라우트가 과도하게 변경될때에 대한 디바운스처리로, match를 deps에 넣으면 무조건 바뀌므로 인자로 받아온다.
        if (prevName && prevName !== params && isMounted.current) {
          setPrevName(params);
          getPosts("popular", params);
          setSort("popular");
        }
      },
      300,
      { leading: true }
    ),
    [prevName]
  );

  const onScrollHandler = useCallback(() => {
    const { clientHeight } = document.documentElement; //요소 높이
    const scrollTop = //남은 높이
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = //총 높이
      document.documentElement.scrollHeight || document.body.scrollHeight;
    //document.documentElement만 참조는 위험'

    if (
      Math.round(scrollTop) + clientHeight === scrollHeight &&
      clientHeight !== scrollHeight &&
      loading
    ) {
      loadPosts(sort);
    }

    //deps를 넣어줘야 최신 상태를 유지할 수 있다.
  }, [postList, isEnd, sort, loading]);

  useEffect(() => {
    isMounted.current = true;
    if (isFirst) {
      getPosts("popular");
      setisFirst(false);
      setPrevName(match.params.name);
    }
    onChangeRoute(match.params.name);
    window.addEventListener("scroll", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
      isMounted.current = false;
    };
  }, [onScrollHandler, match.params.name]);

  return (
    <div className="tag-page-container">
      <div className="tag-page-title">
        <span className="tag-page-title-tag">{`"${match.params.name}"`}</span>
        <span>에 대한 검색결과가 </span>
        <span className="tag-page-title-index">{postList.length}</span>
        <span>개 있습니다.</span>
      </div>
      <div className="sort-box">{sortItem}</div>
      <SkeletonLoading limit={5} active={loading} />
      {postsData()}
    </div>
  );
}

export default SearchPage;
