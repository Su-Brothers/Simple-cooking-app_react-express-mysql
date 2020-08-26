import React, { useState } from "react";
import "./styles/rankpage.scss";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import MiniTimeline from "./MiniTimeline";
import korea from "../icons/korea.svg";
import japan from "../icons/japan.svg";
import italy from "../icons/italy.svg";
import china from "../icons/china.svg";

const TOTAL_SLIDES = 3;

function RankPage() {
  const [currentIdx, setcurrentIdx] = useState(0);
  const [returnFirst, setreturnFirst] = useState(0);
  const [transIdx, settransIdx] = useState(0);

  const nextBtn = () => {
    if (returnFirst >= TOTAL_SLIDES - 1) {
      setcurrentIdx(3);
      setTimeout(function () {
        settransIdx(0);
        setcurrentIdx(-1);
        setreturnFirst(-1);
      }, 500);
    } else {
      settransIdx(0.5);
      setcurrentIdx(currentIdx + 1);
      setreturnFirst(returnFirst + 1);
    }
  };

  const prevBtn = () => {
    if (returnFirst < 1) {
      settransIdx(0.5);
      setcurrentIdx(-1);
      setTimeout(function () {
        settransIdx(0);
        setreturnFirst(3);
        setcurrentIdx(3);
      }, 500);
    } else {
      settransIdx(0.5);
      setcurrentIdx(currentIdx - 1);
      setreturnFirst(returnFirst - 1);
    }
  };

  return (
    <div className="rank_container">
      <div className="rank_container_menu">
        <div className="picture_wrapper">
          <div
            className="pictures_slides"
            style={{
              transition: `${transIdx}s ease-out`,
              transform: `translateX(${currentIdx * -150 - 150}px)`,
            }}
          >
            <img src={italy} width="150px" height="150px" />
            <img src={korea} width="150px" height="150px" />
            <img src={china} width="150px" height="150px" />
            <img src={japan} width="150px" height="150px" />
            <img src={italy} width="150px" height="150px" />
          </div>
        </div>
        <div className="controls_box">
          <div className="controls">
            <a className="prev" onClick={prevBtn}>
              <FaAngleLeft />
            </a>
            <a className="next" onClick={nextBtn}>
              <FaAngleRight />
            </a>
          </div>
        </div>
        <div className="slide_wrapper">
          <ul
            className="slides"
            style={{
              transition: `${transIdx}s ease-out`,
              transform: `translateX(${currentIdx * -150 - 150}px)`,
            }}
          >
            <li>양식</li>
            <li>한식</li>
            <li>중식</li>
            <li>일식</li>
            <li>양식</li>
          </ul>
        </div>
      </div>
      <div className="minitimeline_list">
        <div className="content_container">
          <MiniTimeline />
        </div>
        <div className="content_container">
          <MiniTimeline />
        </div>
        <div className="content_container">
          <MiniTimeline />
        </div>
        <div className="content_container">
          <MiniTimeline />
        </div>
        <div className="content_container">
          <MiniTimeline />
        </div>
      </div>
    </div>
  );
}

export default RankPage;
