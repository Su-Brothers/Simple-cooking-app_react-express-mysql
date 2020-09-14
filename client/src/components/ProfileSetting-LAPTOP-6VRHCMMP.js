import React, { useState } from "react";
import "./styles/profile-setting.scss";
import { FaTimes, FaCamera } from "react-icons/fa";
import { changeHandler } from "../modules/user";

function ProfileSetting(props) {
  const [changeinfo, setchangeinfo] = useState({
    email: "",
    userId: "",
    password: "",
    newPassword: "",
    newPasswordCheck: "",
    userNickname: "",
    file: null,
    fileName: "",
  });

  const {
    email,
    userId,
    password,
    newPassword,
    newPasswordCheck,
    userNickname,
    file,
    fileName,
  } = changeinfo;

  /*  const onchange = (e) => {
    e.preventDefault();
    dispatch(changeHandler(userId, userNickname, history));
  };
*/
  return (
    <div className="outter">
      <div className="setting_container animation_inner">
        <div className="x_box">
          <FaTimes onClick={props.onClose} />
        </div>
        <div className="profile">
          <div className="title_image">
            <img
              src="https://placeimg.com/100/100/any"
              width="100%"
              height="100%"
              alt="프로필사진"
            />
          </div>
          <div className="camera">
            <FaCamera
              style={{ width: "30px", height: "30px", overflow: "hidden" }}
            />
          </div>
          <div className="title_Name">김정수</div>
        </div>
        <div className="modify_container">
          <div className="profile_picture item">
            <div className="block">사진변경</div>
            <input
              type="text"
              name="file"
              accept="image/*"
              file={changeinfo.file}
              value={changeinfo.fileName}
            />
          </div>
          <div className="text">
            사진을 변경하시려면 위 프로필 사진을 눌러서 변경해주세요.
          </div>
          <div className="nicName item">
            <div className="block">닉네임</div>
            <input type="text" name="nicname" value={changeinfo.userNickname} />
          </div>
          <div className="introduce item">
            <div className="block" style={{ marginBottom: "5px" }}>
              자기소개
            </div>
            <textarea type="text" name="intro" />
          </div>
          <div className="current_password item">
            <div className="block">현재 비밀번호</div>
            <input
              type="password"
              name="password"
              value={changeinfo.password}
            />
          </div>
          <div className="new_password item">
            <div className="block">새 비밀번호</div>
            <input
              type="password"
              name="n_password"
              value={changeinfo.newPassword}
            />
          </div>
          <div className="new_password item">
            <div className="block">비밀번호 확인</div>
            <input
              type="password"
              name="n_password"
              value={changeinfo.newPasswordCheck}
            />
          </div>
        </div>
        <div className="btn_location">
          <button type="submit" className="save_btn">
            {" "}
            저장
          </button>
          <button type="button" className="close_btn" onClick={props.onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;
