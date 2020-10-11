import React from "react";
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
import { shallowEqual, useSelector } from "react-redux";
function TimeLine({
  title,
  writer,
  writerNo,
  profile,
  photo,
  date,
  url,
  likes,
  co,
  views,
  type,
  des,
}) {
  const user = useSelector((state) => state.user.userData, shallowEqual); //얕은 복사

  return (
    <div className="timeline-box">
      <Link to={`/post/${url}`} className="timeline-link">
        <div className="timeline-container">
          <div className="timeline-top">
            <div className="img-box">
              {profile ? (
                <img
                  src={`http://localhost:5000/${profile}`}
                  alt="프로필사진"
                />
              ) : (
                <img
                  src={`http://localhost:5000/uploads/normal-profile.png`}
                  alt="프로필사진"
                />
              )}
            </div>

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
            <img src={`http://localhost:5000/${photo}`} alt="요리이미지" />
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

      <div className="writer-link-box">
        <Link
          to={user && user._no === writerNo ? `mypage` : `/chef/${writerNo}`}
          className="link-box-writer"
        >
          <div className="writer-link"></div>
        </Link>
        <Link to={`/post/${url}`}>
          <div className="post-link"></div>
        </Link>
      </div>
    </div>
  );
}

export default React.memo(TimeLine);
