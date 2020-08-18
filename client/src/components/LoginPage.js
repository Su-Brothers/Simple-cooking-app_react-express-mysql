import React from "react";
import "./styles/loginpage.scss";
import logo from "../images/jabakLogo_v4.png";
function LoginPage() {
  return (
    <>
      <div className="login_container">
        <div className="login_container_img">
          <img src={logo} alt="logo" />
        </div>
        <div className="login_container_info">
          LOGIN
          <form>
            <input type="text" name="userId" placeholder="아이디" />
            <input type="text" name="userPassword" placeholder="비밀번호" />
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
