import React, { useState } from "react";
import "../styles/signup-page.scss";
import logo from "../../images/jabakLogo_v4.png";
import { useDispatch } from "react-redux";
import { signupHandler } from "../../modules/user";
import { debounce } from "lodash";
import LoadingSpinner from "../loadingCompo/LoadingSpinner";
import { useRef } from "react";
import { useEffect } from "react";
function SignupPage({ history }) {
  const [info, setInfo] = useState({
    email: "",
    userId: "",
    password: "",
    passwordCheck: "",
    userNickname: "",
  });
  const isMounted = useRef(null);

  const [clickLoading, setClickLoading] = useState(false);
  const [emailBool, setEmailBool] = useState(""); //이메일 일치 상태
  const [idBool, setIdBool] = useState(""); //id 일치 상태
  const [passwordBool, setpasswordBool] = useState(""); //비밀번호 일치 상태
  const [passwordCheckBool, setPasswordCheckBool] = useState(""); //비밀번호 확인 일치 상태
  const [nicknameBool, setNicknameBool] = useState(""); //닉네임 일치 상태

  const { email, userId, password, passwordCheck, userNickname } = info;
  const dispatch = useDispatch();
  const onInputHandler = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };
  const emailCheckHandler = () => {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/; //정규식 사용
    if (email.length === 0) {
      setEmailBool("이메일을 입력해주십시오.");
    } else {
      if (!reg_email.test(email)) {
        setEmailBool("이메일 형식에 맞지 않습니다.");
      } else {
        setEmailBool("");
      }
    }
  };
  const passwordCheckHandler = () => {
    if (password !== passwordCheck) {
      setPasswordCheckBool("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordCheckBool("");
    }
  };

  const onSignup = debounce(
    () => {
      setClickLoading(true);
      dispatch(
        signupHandler(
          email,
          userId,
          password,
          userNickname,
          history,
          completeLoading
        )
      );
    },
    300,
    { leading: true, trailing: false }
  );
  const onDebounceSignUp = (e) => {
    e.preventDefault();
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/; //정규식 사용
    const checkInfo =
      Object.values(info).every((x) => x !== "") &&
      password.length > 7 &&
      password === passwordCheck &&
      reg_email.test(email); //하나라도 비어있고 형식에 안맞으면 x x
    if (!checkInfo) {
      alert("입력하신 정보가 일치하지 않습니다.");
    } else {
      onSignup();
    }
  };

  const completeLoading = () => {
    if (!isMounted.current) return;
    setClickLoading(false);
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <div className="signup_container">
      <div className="signup_container_logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="signup_container_info">
        <div className="signup_container_info_title">SIGN UP</div>
        <form>
          <input
            type="text"
            name="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={onInputHandler}
            onBlur={emailCheckHandler}
          />
          <div style={{ fontSize: "0.8rem", color: "red" }}>{emailBool}</div>
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={userId}
            onChange={onInputHandler}
            onBlur={() =>
              userId.length > 0
                ? setIdBool("")
                : setIdBool("아이디를 입력해주세요.")
            }
          />
          <div style={{ fontSize: "0.8rem", color: "red" }}>{idBool}</div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={onInputHandler}
            onBlur={() =>
              password.length > 7
                ? setpasswordBool("")
                : setpasswordBool("비밀번호는 8자리 이상이여야합니다.")
            }
          />
          <div style={{ fontSize: "0.8rem", color: "red" }}>{passwordBool}</div>
          <input
            type="password"
            name="passwordCheck"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={onInputHandler}
            onBlur={passwordCheckHandler}
          />
          <div style={{ fontSize: "0.8rem", color: "red" }}>
            {passwordCheckBool}
          </div>
          <input
            type="text"
            name="userNickname"
            placeholder="닉네임"
            value={userNickname}
            onChange={onInputHandler}
            onBlur={() =>
              userNickname.length > 0
                ? setNicknameBool("")
                : setNicknameBool("닉네임을 입력해주세요.")
            }
          />
          <div style={{ fontSize: "0.8rem", color: "red" }}>{nicknameBool}</div>
          <button
            type="submit"
            className="singup_btn"
            onClick={onDebounceSignUp}
          >
            회원가입
          </button>
          {clickLoading && (
            <div className="loading-box">
              <LoadingSpinner />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
