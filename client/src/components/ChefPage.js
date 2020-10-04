import React, { useState } from "react";
import "./styles/mypage.scss";
import { FaQuoteLeft, FaQuoteRight, FaCog } from "react-icons/fa";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import TimeLine from "./TimeLine";
import Axios from "axios";
import { useCallback } from "react";
import { useRef } from "react";

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
  const [isEnd, setIsEnd] = useState(false); //더 이상 가져올 수 있는 데이터가 있는지
  const [isFirst, setisFirst] = useState(true);
  const [prevName, setPrevName] = useState(""); //라우트로 이동시 전페이지의 값과 비교하기 위해 사용
  const limitItem = useRef(0); //페이징 처리용 리미트

  const { user_nickname, user_description, user_img } = userInfo;
  const sortList = [
    //정렬 리스트
    { name: "mypost", koName: "레시피" },
    { name: "scrap", koName: "스크랩" },
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

  const getUser = () => {
    Axios.get(`/api/users/profile/${match.params.no}`)
      .then((res) => {
        if (res.data.success) {
          setUserInfo(res.data.result);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
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
      return "loading...";
    }
  };
  console.log(match.params.no);
  const getPosts = (target) => {
    limitItem.current = 0; //0으로 초기화
    setLoading(false);
    setIsEnd(false);
    Axios.get(
      `/api/users/posts/${match.params.no}/${target}/${limitItem.current}`
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
    if (!isEnd) {
      console.log(isEnd);
      Axios.get(
        `/api/users/posts/${match.params.no}/${target}/${limitItem.current}`
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
    if (
      Math.round(scrollTop) + clientHeight === scrollHeight &&
      clientHeight !== scrollHeight
    ) {
      console.log("맨끝");
      console.log(scrollTop);
      console.log(clientHeight);
      console.log(scrollHeight);
      loadPosts(sort);
    }

    //deps를 넣어줘야 최신 상태를 유지할 수 있다.
  }, [postList.length, isEnd, sort]);
  useEffect(() => {
    console.log("asdsad");
    if (isFirst) {
      getPosts("mypost");
      getUser();
      setisFirst(false);
      setPrevName(match.params.no);
    } else if (prevName !== match.params.no) {
      console.log("성공");
      getPosts("mypost");
      getUser();
      setSort("mypost");
      setPrevName(match.params.no);
    }
    window.addEventListener("scroll", onScrollHandler);
    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [onScrollHandler, match.params.no, user_nickname]);

  return (
    <>
      <div className="mypage-container">
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
        {postsData()}
      </div>
    </>
  );
}

export default ChefPage;
