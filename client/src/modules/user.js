import axios from "axios";
//액션
const LOGIN_USER = "LOGIN_USER";
const SIGNUP_USER = "SIGNUP_USER";
const AUTH_USER = "AUTH_USER";

//액션 생성 함수
export const loginHandler = (id, password, history) => async (dispatch) => {
  const data = await axios
    .post(
      `${process.env.REACT_APP_SERVER_HOST}/api/users/login`,
      {
        id: id,
        password: password,
      },
      { withCredentials: true }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err));
  if (data.success) {
    await dispatch({
      type: LOGIN_USER,
      payload: data,
    });
    history.push("/");
  } else {
    alert(data.message);
  }
};

export const signupHandler = (email, id, password, nickname, history) => async (
  dispatch
) => {
  const data = await axios
    .post(`${process.env.REACT_APP_SERVER_HOST}/api/users/signup`, {
      email: email,
      id: id,
      password: password,
      nickname: nickname,
    })
    .then((res) => res.data)
    .catch((err) => alert("서버에 오류가 발생했습니다."));

  if (data.success) {
    alert("회원가입을 성공하였습니다!");
    await dispatch({
      type: SIGNUP_USER,
      payload: data,
    });
    history.push("/");
  } else {
    alert(data.message);
  }
};

export const reloadUser = () => async (dispatch) => {
  //회원정보 수정 후 리로드
  const data = await axios
    .get(`${process.env.REACT_APP_SERVER_HOST}/api/users/auth`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  dispatch({
    type: AUTH_USER,
    payload: data,
  });
};
export const authHandler = (option, history) => async (dispatch) => {
  //페이지간 권한인증
  const data = await axios
    .get(`${process.env.REACT_APP_SERVER_HOST}/api/users/auth`, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  dispatch({
    type: AUTH_USER,
    payload: data,
  });

  if (data.isAuth === false) {
    alert(data.error); //토큰이 일치하지 않을때
    history.push("/login");
  } else if (data.isAuth === null) {
    //로그인 안되어 있을때
    if (option) {
      alert(data.error);
      history.push("/login");
    } else if (option === false) {
      return;
    } else {
      return;
    }
  } else if (data.isAuth === true) {
    //로그인 되어있을때
    if (option) {
      return;
    } else if (option === false) {
      history.push("/"); //안된사람만 가능
    } else {
      return;
    }
  }
};

const initialState = {
  loginsuccess: {},
  result: {},
  userData: {
    isAuth: null,
  },
};
export default function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loginsuccess: action.payload,
      };
    case SIGNUP_USER:
      return {
        ...state,
        result: action.payload, //로그인한 유저의 모든 정보
      };
    case AUTH_USER:
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
}
