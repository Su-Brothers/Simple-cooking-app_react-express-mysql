import React from "react";
import {
  FaEye,
  FaRegClock,
  FaQuoteRight,
  FaQuoteLeft,
  FaFireAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/postsStyle/post-header.scss";
import { RiEarthLine } from "react-icons/ri";
import PostLike from "./PostLike";
import Axios from "axios";
import Views from "./Views";
import {
  pGenderTime,
  pGenderDiff,
  pGenderType,
} from "../../custom-module/typeGender";
function PostHeader({
  title,
  board_img,
  description,
  cook_time,
  cook_diff,
  food_type,
  created_date,
  history,
  user,
  postId,
  userNo,
  profile,
  writerNo,
  writer,
}) {
  console.log("dd");
  const onDelete = async () => {
    const result = window.confirm(
      "정말로 삭제하시겠습니까? (삭제한 내용은 복구할 수 없습니다.)"
    );
    if (result) {
      //서버 요청
      const data = await Axios.delete(`/api/post/${postId}/delete`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data.success) {
        alert(data.message);
        history.push("/");
      }
    } else {
      return;
    }
  };

  return (
    <div className="post-item post-header">
      <div className="header-box post-item-box">
        <div className="post-date">
          <span>{`date: ${created_date}`}</span>
        </div>
        {user ? (
          <div className="edit-btn-box">
            <button
              type="button"
              className="edit-btn"
              onClick={() => history.push(`${history.location.pathname}/edit`)}
            >
              수정
            </button>
            <button type="button" className="delete-btn" onClick={onDelete}>
              삭제
            </button>
          </div>
        ) : null}

        <div className="post-header-middle">
          <img
            src={`http://localhost:5000/${board_img}`}
            alt="대표 이미지"
            className="header-food-img"
          />
          <Link to={`/chef/${writerNo}`}>
            <div className="profile-background">
              <div className="profile-name">
                {writer}
                <br />
                프로필보기
              </div>
            </div>
            {profile ? (
              <img
                src={`http://localhost:5000/${profile}`}
                alt="대표 이미지"
                className="header-profile-img"
              />
            ) : (
              <img
                src="http://localhost:5000/uploads/normal-profile.png"
                alt="대표 이미지"
                className="header-profile-img"
              />
            )}
          </Link>

          <div className="post-views">
            <FaEye />
            <Views />
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
            <span>{pGenderTime(cook_time)}</span>
          </div>
          <div className="post-category-item diff">
            <FaFireAlt />
            <span>{pGenderDiff(cook_diff)}</span>
          </div>
          <div className="post-category-item">
            <RiEarthLine />
            {pGenderType(food_type)}
          </div>
          <PostLike user={userNo} postId={postId} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostHeader);
