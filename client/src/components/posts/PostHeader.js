import React from "react";
import {
  FaEye,
  FaRegClock,
  FaHeart,
  FaQuoteRight,
  FaQuoteLeft,
  FaFireAlt,
} from "react-icons/fa";
import "../styles/postsStyle/post-header.scss";
import { RiEarthLine } from "react-icons/ri";
function PostHeader({
  title,
  board_img,
  description,
  cook_time,
  cook_diff,
  food_type,
  created_date,
}) {
  return (
    <div className="post-item post-header">
      <div className="header-box post-item-box">
        <div className="post-date">
          <span>{`date: ${created_date}`}</span>
        </div>
        <div className="post-header-middle">
          <img
            src={`http://localhost:5000/${board_img}`}
            alt="대표 이미지"
            className="header-food-img"
          />
          <img
            src="http://localhost:5000/uploads/normal-profile.png"
            alt="대표 이미지"
            className="header-profile-img"
          />
          <div className="post-views">
            <FaEye />
            <span>241</span>
          </div>
        </div>
        <span className="title">{title}</span>
        <div className="post-description">
          <FaQuoteLeft />
          <span>{description}</span>
          <FaQuoteRight />
        </div>
        <div className="post-category">
          <div className="post-category-item time">
            <FaRegClock />
            <span>{cook_time}</span>
          </div>
          <div className="post-category-item diff">
            <FaFireAlt />
            <span>{cook_diff}</span>
          </div>
          <div className="post-category-item">
            <RiEarthLine />
            {food_type}
          </div>
          <div className="post-category-item">
            <FaHeart />
            132
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostHeader);
