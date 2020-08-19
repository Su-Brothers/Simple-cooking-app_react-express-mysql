import React from "react";
import "./styles/loginpage.scss";
import logo from "../images/jabakLogo_v4.png";
function LoginPage() {
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
            <input type="text" name="userId" placeholder="아이디" />
            <input type="text" name="userPassword" placeholder="비밀번호" />
            <button type="submit" className="login_btn">
              로그인
            </button>
            <div className="hr-text">계정이 없으신가요?</div>
            <button type="submit" className="singup_btn">
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
