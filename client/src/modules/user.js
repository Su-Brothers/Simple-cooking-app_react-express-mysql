import axios from "axios";
//액션
const LOGIN_USER = "LOGIN_USER";
const SIGNUP_USER = "SIGNUP_USER";

//액션 생성 함수
export const loginHandler = (id, password, history) => async (
  dispatch,
  getState
) => {
  const data = await axios
    .post("/api/users/login", { id: id, password: password })
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
  dispatch,
  getState
) => {
  const data = await axios
    .post("/api/users/signup", {
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

const initialState = {};
export default function post(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loginsuccess: action.payload,
      };
    case SIGNUP_USER:
      return {
        ...state,
        loginsuccess: action.payload,
      };

    default:
      return state;
  }
}
