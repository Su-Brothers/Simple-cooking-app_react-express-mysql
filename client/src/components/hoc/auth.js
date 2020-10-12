import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authHandler } from "../../modules/user";
import { withRouter } from "react-router-dom";

function Auth(AuthComponent, option = null) {
  //고차 컴포넌트 구현
  //옵션 false => 로그인 안 된 사람만 들어온다.
  //옵션 true =? 로그인 된 사람만 들어온다.
  function CheckAuth(props) {
    const dispatch = useDispatch();
    //auth로 감싸진 모든 컴포넌트로 이동할때마다 호출
    useEffect(() => {
      dispatch(authHandler(option, props.history));
    }, [dispatch, props.history]);
    return <AuthComponent {...props} />;
    //props의 불변성을 지켜줘야함
  }
  return withRouter(CheckAuth);
}
export default Auth;
