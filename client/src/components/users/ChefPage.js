import React, { useState } from "react";
import "../styles/mypage.scss";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useEffect } from "react";
import TimeLine from "../TimeLine";
import Axios from "axios";
import { debounce } from "lodash";
import { useCallback } from "react";
import { useRef } from "react";
import SkeletonLoading from "../loadingCompo/SkeletonLoading";
import SkeletonMypage from "../loadingCompo/SkeletonMypage";
import NotFound from "../NotFound";

function ChefPage({ match }) {
  //다른 유저들의 페이지
  const [sort, setSort] = useState("mypost");
  const [postList, setList] = useState([]);
  const [userInfo, setUserInfo] = useState({
    user_nickname: "",
    user_description: "",
    user_img: "",
  });
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setisFirst] = useState(true);
  const [prevName, setPrevName] = useState(""); //라우트로 이동시 전페이지의 값과 비교하기 위해 사용
  const limitItem = useRef(0); //페이징 처리용 리미트
  const isMounted = useRef(null);

  const { user_nickname, user_description, user_img } = userInfo;
  const sortList = [
    //정렬 리스트
    { name: "mypost", koName: "레시피" },
    { name: "scrap", koName: "스크랩" },
  ];
  const onSortChange = (target) => () => {
    if (loading) {
      setSort(target);
      if (user_nickname) {
        getPosts(target);
      }
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

  const getUser = (params = match.params.no) => {
    setUserLoading(false);
    Axios.get(`/api/users/profile/${params}`)
      .then((res) => {
        if (isMounted.current) {
          if (res.data.success) {
            setUserInfo(res.data.result);
            setUserLoading(true);
          } else {
            alert(res.data.message);
          }
        }
      })
      .catch((err) => console.log(err));
  };
  const userData = () => {
    //렌더링 될 포스트 데이터
    if (userLoading) {
      if (user_nickname) {
        return (
          <div className="my-top">
            <div className="my-top-description-box">
              <div className="description-text">
                <FaQuoteLeft className="quote-left" />
                <span>
                  {user_description
                    ? user_description
                    : "등록된 자기소개가 없습니다."}
                </span>
                <FaQuoteRight className="quote-right" />
              </div>
            </div>
            <div className="my-top-sort-box">
              <div className="my-img-box">
                {user_img ? (
                  <img
                    src={`http://localhost:5000/${user_img}`}
                    alt="프로필사진"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/uploads/normal-profile.png`}
                    alt="프로필사진"
                  />
                )}
              </div>
              {sortItem}
              <div className="user-name">{user_nickname}</div>
            </div>
          </div>
        );
      } else {
        //로딩이 다되었음에도 불구하고 length 가 0이면 결과가 없는것이다.
        return <NotFound item={"유저"} />;
      }
    } else {
      return null;
    }
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
        return null;
      }
    } else {
      return "loading...";
    }
  };
  const getPosts = (target, params = match.params.no) => {
    limitItem.current = 0; //0으로 초기화
    setLoading(false);
    setIsEnd(false);
    Axios.get(`/api/users/posts/${params}/${target}/${limitItem.current}`)
      .then((res) => {
        if (isMounted.current) {
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
        }
      })
      .catch((err) => console.log(err));
  };

  const loadPosts = (target) => {
    console.log(target);
    if (!isEnd) {
      console.log(isEnd);
      Axios.get(
        `/api/users/posts/${match.params.no}/${target}/${limitItem.current}`
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
      console.log("데이터가 없습니다.");
    }
  };

  const onChangeRoute = useCallback(
    debounce(
      (params) => {
        //라우트가 과도하게 변경될때에 대한 디바운스처리로, match를 deps에 넣으면 무조건 바뀌므로 인자로 받아온다.
        if (prevName && prevName !== params && isMounted.current) {
          window.scrollTo(0, 0);
          setPrevName(params); //요청이 먼저 가버리면 다시 실행되기 때문에 가장 먼저 변경
          console.log("성공");
          getPosts("mypost", params);
          getUser(params);
          setSort("mypost");
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
    console.log(sort);
    if (
      Math.round(scrollTop) + clientHeight === scrollHeight &&
      clientHeight !== scrollHeight &&
      loading
    ) {
      console.log("맨끝");
      console.log(scrollTop);
      console.log(clientHeight);
      console.log(scrollHeight);
      loadPosts(sort);
    }

    //deps를 넣어줘야 최신 상태를 유지할 수 있다.
  }, [postList, isEnd, sort, loading]);

  useEffect(() => {
    isMounted.current = true;
    console.log("asdsad");
    console.log(match.params.no);
    if (isFirst) {
      window.scrollTo(0, 0);
      getPosts("mypost");
      getUser();
      setisFirst(false);
      setPrevName(match.params.no);
    }
    onChangeRoute(match.params.no);
    window.addEventListener("scroll", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
      isMounted.current = false;
    };
  }, [onScrollHandler, match.params.no, user_nickname]);

  return (
    <>
      <div className="mypage-container">
        <SkeletonMypage active={userLoading} />
        {userData()}
        <SkeletonLoading limit={5} active={loading} />
        {postsData()}
      </div>
    </>
  );
}

export default ChefPage;
