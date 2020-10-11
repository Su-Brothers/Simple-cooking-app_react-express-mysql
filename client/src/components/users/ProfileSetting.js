import React, { useState } from "react";
import "../styles/profile-setting.scss";
import { FaCamera } from "react-icons/fa";
import DropZone from "react-dropzone";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { reloadUser } from "../../modules/user";
import { useEffect } from "react";
import Axios from "axios";
import LoadingSpinner from "../loadingCompo/LoadingSpinner";
function ProfileSetting({
  onClose,
  imgData,
  nickData,
  desData,
  emailData,
  noData,
}) {
  const [info, setInfo] = useState({
    imgFile: "",
    email: "",
    userNickname: "",
    description: "",
    password: "",
    newPassword: "",
    passwordCheck: "",
  });
  const dispatch = useDispatch();

  const [clickLoading, setclickLoading] = useState(true); //submit시 로딩

  const [nickBool, setNickBool] = useState(""); //닉네임 체크
  const [emailBool, setEmailBool] = useState(""); //이메일 체크

  const [nowPsBool, setNowPsBool] = useState(""); //현재 비밀번호 체크
  const [psCheckBool, setPsCheckBool] = useState(""); //비밀번호 체크
  const [psBool, setPsBool] = useState(""); //비밀번호 확인체크

  const {
    imgFile,
    email,
    userNickname,
    description,
    password,
    newPassword,
    passwordCheck,
  } = info;

  const onInputHandler = (e) => {
    //인풋핸들러
    console.log(info);
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const imageUpload = async (file) => {
    console.log(file);
    let formData = new FormData(); //파일 데이터 형식을 받기 위해 사용
    formData.append("profile", file[0]);
    const config = {
      header: { "content-type": "multipart/form-data" }, //파일 형식을 서버에 보내려면 타입을 명시해줘야함
    };
    try {
      const result = await Axios.post(
        "/api/users/upload/profile",
        formData,
        config
      ).then((res) => res.data);

      if (result.success) {
        setInfo({
          ...info,
          imgFile: result.url,
        });
      } else {
        alert("업로드 실패");
      }
    } catch (err) {
      alert("서버에 오류가 발생했습니다.");
    }
  };

  const onSubmitHandler = debounce(
    () => {
      //디바운스 처리
      //한 번만 시도를 하지 않았을경우 틀린 것만 보여줘야하므로 처음에 초기화
      setEmailBool("");
      setNickBool("");
      setNowPsBool("");
      setPsBool("");
      setPsCheckBool("");
      console.log("submit");
      //닉네임 체크
      if (!userNickname) {
        return setNickBool("닉네임을 입력해주십시오.");
      }
      //이메일 체크
      const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/; //정규식 사용
      if (email.length === 0) {
        return setEmailBool("이메일을 입력해주십시오.");
      } else {
        if (!reg_email.test(email)) {
          return setEmailBool("이메일 형식에 알맞지 않습니다.");
        }
      }
      //비밀번호 체크
      if (password || newPassword || passwordCheck) {
        //세 인풋값이 전부 있을경우
        if (password && newPassword && passwordCheck) {
          if (newPassword !== passwordCheck) {
            //비밀번호확인과 비밀번호가 맞는지 체크한다
            return setPsCheckBool("비밀번호를 확인해주세요.");
          } else {
            //맞으면 8자리 이상인지 확인
            if (newPassword.length < 8) {
              return setPsBool("비밀번호는 8자리 이상입니다.");
            }
            //여기까지 통과되었으면 성공
            if (noData) {
              setclickLoading(false);
              console.log(noData);
              Axios.post(`/api/users/edit`, {
                userNo: noData,
                imgFile: imgFile,
                email: email,
                nickname: userNickname,
                description: description,
                password: password,
                newPassword: newPassword,
              }).then((res) => {
                if (res.data.success) {
                  setclickLoading(true);
                  alert(res.data.message);
                  dispatch(reloadUser());
                  onClose();
                } else {
                  setclickLoading(true);
                  alert(res.data.message);
                }
              });
            }
          }
        } else {
          if (!password) {
            return setNowPsBool("현재 비밀번호를 입력해주세요.");
          }
          if (newPassword.length < 8) {
            return setPsBool("비밀번호는 8자리 이상입니다.");
          }
          if (passwordCheck.length < 8) {
            return setPsCheckBool("비밀번호 확인을 정확히 입력해주세요.");
          }
        }
      } else {
        if (nickData) {
          console.log(noData);
          setclickLoading(false);
          Axios.post(`/api/users/edit`, {
            userNo: noData,
            imgFile: imgFile,
            email: email,
            nickname: userNickname,
            description: description,
            password: null,
            newPassword: null,
          }).then((res) => {
            if (res.data.success) {
              setclickLoading(true);
              alert(res.data.message);
              dispatch(reloadUser());
              onClose();
            } else {
              setclickLoading(true);
              alert(res.data.message);
            }
          });
        }
      }
    },
    300,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    setInfo((info) => ({
      ...info,
      imgFile: imgData || "",
      email: emailData || "",
      userNickname: nickData || "",
      description: desData || "",
      noData: noData || "",
    }));
  }, [imgData, emailData, nickData, desData, noData]);
  return (
    <>
      <div className="outter-box"></div>
      <div className="setting-modal">
        <div className="profile">
          <DropZone onDrop={imageUpload} multiple={false} maxSize={1000000}>
            {({ getRootProps, getInputProps }) => (
              <div className="title_image" {...getRootProps()}>
                <input {...getInputProps()} />
                {imgFile ? (
                  <img
                    src={`http://localhost:5000/${imgFile}`}
                    alt="프로필사진"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/uploads/normal-profile.png`}
                    alt="프로필사진"
                  />
                )}
                <div className="camera-box">
                  <FaCamera />
                </div>
              </div>
            )}
          </DropZone>
          <div className="user-name">{nickData}</div>
        </div>
        <div className="modify_container">
          <div className="input-box">
            이메일
            <input
              type="text"
              name="email"
              value={email}
              onChange={onInputHandler}
            />
          </div>
          <div className="bool-box">{emailBool}</div>
          <div className="input-box">
            닉네임
            <input
              type="text"
              name="userNickname"
              value={userNickname}
              onChange={onInputHandler}
            />
          </div>
          <div className="bool-box">{nickBool}</div>
          <div className="input-box-vertical-top">
            자기소개
            <textarea
              type="text"
              name="description"
              value={description}
              onChange={onInputHandler}
            />
          </div>
          <div className="input-box">
            현재 비밀번호
            <input
              type="password"
              name="password"
              value={password}
              onChange={onInputHandler}
            />
          </div>
          <div className="bool-box">{nowPsBool}</div>
          <div className="input-box">
            새 비밀번호
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={onInputHandler}
            />
          </div>
          <div className="bool-box">{psBool}</div>
          <div className="input-box">
            비밀번호 확인
            <input
              type="password"
              name="passwordCheck"
              value={passwordCheck}
              onChange={onInputHandler}
            />
          </div>
          <div className="bool-box">{psCheckBool}</div>
        </div>
        <div className="btn-location">
          <div className={`loading-box ${clickLoading ? "" : "active"}`}>
            <LoadingSpinner />
          </div>
          <button type="button" className="save-btn" onClick={onSubmitHandler}>
            저장
          </button>
          <button type="button" className="close-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </>
  );
}

export default React.memo(ProfileSetting);
