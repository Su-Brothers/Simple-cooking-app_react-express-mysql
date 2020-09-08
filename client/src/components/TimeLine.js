import React, { useState } from "react";
import "./styles/timeline.scss";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import { useEffect } from "react";

function TimeLine({ title, writer, photo, date }) {
  const [like, setLike] = useState(false);

  const likeButtonHandler = () => {
    setLike(!like);
  };

  useEffect(() => {
    console.log(title);
  });
  return (
    <div className="timeline_container">
      {" "}
      {/*타임라인 컨테이너*/}
      <div className="title_container">
        {" "}
        {/*타임라인 유저 정보 컨테이너*/}
        <div className="title_image">
          <img
            src="https://placeimg.com/100/100/any"
            width="100%"
            height="100%"
          />
        </div>
        <div className="title_Name">
          {" "}
          {/*유저의 이름*/}
          {writer}
        </div>
      </div>
      <div className="timeline_image">
        {" "}
        {/*메인 피드 이미지*/}
        <img
          src={`http://localhost:5000/${photo}`}
          width="100%"
          height="240px"
        />
      </div>
      <div className="timeline_text">{title}</div>
      <br />
      <div className="timeline_conainer_bottom">
        {" "}
        {/*하단부 좋아요 댓글 등등 영역*/}
        <div style={{ display: "flex" }}>
          <div>
            <a className="button_style" onClick={likeButtonHandler}>
              {" "}
              {like ? <FaRegHeart /> : <FaHeart />} 좋아요
            </a>
          </div>
          <div>
            <a className="button_style">
              <FaRegComment /> 댓글 달기
            </a>
          </div>
          <div>
            <a className="button_style">
              <FaExpandArrowsAlt /> 스크랩
            </a>
          </div>
        </div>
        <div className="time">{date}</div>
      </div>
    </div>
  );
}

export default React.memo(TimeLine);
