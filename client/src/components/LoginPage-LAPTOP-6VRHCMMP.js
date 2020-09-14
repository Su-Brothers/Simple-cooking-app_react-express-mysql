import React, { useState } from "react";
import "./styles/loginpage.scss";
import logo from "../images/jabakLogo_v4.png";
import { loginHandler } from "../modules/user";
import { useDispatch } from "react-redux";
function LoginPage({ history }) {
  console.log("2");
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    userId: "",
    userPassword: "",
  });
  const { userId, userPassword } = userInfo;
  const onSignup = (e) => {
    e.preventDefault();
    history.push("/signup");
  };
  const onLogin = (e) => {
    e.preventDefault();
    if (userId !== "" && userPassword !== "") {
      dispatch(loginHandler(userId, userPassword, history));
    } else {
      alert("정보를 모두 입력하세요.");
    }
  };
  const onInputHandler = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
    console.log(userInfo);
  };
  return (
    <>
      <div className="login_container">
        <div className="login_container_logo">
          <div className="login_container_logo_title">환영합니다!</div>
          <img src={logo} alt="logo" />
        </div>
        <div className="login_container_info">
          <div className="login_container_info_title">LOGIN</div>
          <form>
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={userId}
              onChange={onInputHandler}
            />
            <input
              type="text"
              name="userPassword"
              placeholder="비밀번호"
              value={userPassword}
              onChange={onInputHandler}
            />
            <button type="submit" className="login_btn" onClick={onLogin}>
              로그인
            </button>
            <div className="hr-text">계정이 없으신가요?</div>
            <button type="button" className="singup_btn" onClick={onSignup}>
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
