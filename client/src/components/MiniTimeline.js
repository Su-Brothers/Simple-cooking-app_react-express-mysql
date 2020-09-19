import React from "react";
import "./styles/minitimeline.scss";
import { FaHeart, FaEye, FaStopwatch } from "react-icons/fa";
import ranking from "../icons/ranking.svg";

function MiniTimeline() {
  return (
    <div className="minitime_container">
      <div className="picture_rank">
        <div className="picture">
          <img
            src="https://placeimg.com/100/100/any"
            width="100%"
            height="100%"
            alt="프로필사진"
          />
        </div>
        <div className="rank">
          <img src={ranking} width="40px" height="40px" alt="트로피" />
        </div>
      </div>
      <div className="text">여기는 제목</div>
      <div className="aaa">
        <div className="timeline_name_container">
          <div className="timeline_picture">
            <img
              src="https://placeimg.com/100/100/any"
              width="100%"
              height="100%"
              alt="메인피드사진"
            />
          </div>
          <div className="timeline_name"> 김정수 </div>
        </div>
        <div className="miniTimeline_bottom">
          <a href="/#">
            <FaHeart color="red" /> :{" "}
          </a>
          <a href="/#">
            <FaEye /> :{" "}
          </a>
          <a href="/#">
            <FaStopwatch /> :{" "}
          </a>
        </div>
      </div>
    </div>
  );
}

export default MiniTimeline;
