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
import LoadingSpinner from "../loadingCompo/LoadingSpinner";
import normalProfile from "../../images/normal-profile.png";
import { useState } from "react";
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDelete = async () => {
    const result = window.confirm(
      "정말로 삭제하시겠습니까? (삭제한 내용은 복구할 수 없습니다.)"
    );
    if (result) {
      //서버 요청
      setDeleteLoading(true);
      const data = await Axios.delete(
        `${process.env.REACT_APP_SERVER_HOST}/api/post/${postId}/delete`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data.success) {
        alert(data.message);
        history.push("/");
      } else {
        setDeleteLoading(false);
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
          {deleteLoading && <LoadingSpinner size={"small"} />}
          {user && !deleteLoading ? (
            <div className="edit-btn-box">
              <button
                type="button"
                className="edit-btn"
                onClick={() =>
                  history.push(`${history.location.pathname}/edit`)
                }
              >
                수정
              </button>
              <button type="button" className="delete-btn" onClick={onDelete}>
                삭제
              </button>
            </div>
          ) : null}
        </div>

        <div className="post-header-middle">
          <img
            src={`${process.env.REACT_APP_IMG_URL}/${board_img}`}
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
                src={`${process.env.REACT_APP_IMG_URL}/${profile}`}
                alt="프로필 이미지"
                className="header-profile-img"
              />
            ) : (
              <img
                src={normalProfile}
                alt="프로필 이미지"
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
