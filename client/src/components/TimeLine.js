import React, { useState } from "react";
import "./styles/timeline.scss";
import {
  FaRegStar,
  FaRegEye,
  FaRegCommentDots,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { pGenderType } from "../custom-module/typeGender";
function TimeLine({
  title,
  writer,
  photo,
  date,
  url,
  likes,
  co,
  views,
  type,
  des,
}) {
  return (
    <Link to={`/post/${url}`} className="timeline-link">
      <div className="timeline-container">
        <div className="timeline-top">
          <img src="https://placeimg.com/100/100/any" />
          <div className="timeline-writer">
            <span className="writer"> {writer}</span>
            <span>{`·${pGenderType(type)}`}</span>
          </div>
        </div>
        <div className="timeline-middle">
          <div className="des-box">
            <div className="des">
              <FaQuoteLeft />
              <span>{des}</span>
              <FaQuoteRight />
            </div>
          </div>
          <img src={`http://localhost:5000/${photo}`} />
          <div className="timeline-title">{title}</div>
        </div>
        <div className="timeline-bottom">
          <div className="timeline-bottom-left">
            <div className="timeline-like">
              <FaRegStar />
              <span>{likes}</span>
            </div>
            <div className="timeline-comment">
              <FaRegCommentDots />
              <span>{co}</span>
            </div>
            <div className="timeline-views">
              <FaRegEye />
              <span>{views}</span>
            </div>
          </div>
          <div className="timeline-bottom-right">{date}</div>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(TimeLine);
