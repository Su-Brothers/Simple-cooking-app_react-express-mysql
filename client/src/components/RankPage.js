import React, { useState, useEffect, useRef } from "react";
import Cooking from "../icons/cooking.svg";
import "./styles/rankpage.scss";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import timeline from "./TimeLine";
import TimeLine from "./TimeLine";

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
    <div>
      <div className="pictures">
        <img src={Cooking} width="100px" heigh="100px" />
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
      <div className="content_container">
        {" "}
        <TimeLine />
      </div>
    </div>
  );
}

export default RankPage;
