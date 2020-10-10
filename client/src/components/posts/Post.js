import React from "react";
import "../styles/postsStyle/post.scss";
import PostHeader from "./PostHeader";
import PostInre from "./PostInre";
import PostRecipe from "./PostRecipe";
import PostTag from "./PostTag";
import Comment from "./Comment";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { readDetail, readViews } from "../../modules/post";
import Loading from "../loadingCompo/Loading";
import Axios from "axios";
import NotFound from "../NotFound";

function Post({ match, history }) {
  const { postId } = match.params;
  const dispatch = useDispatch();
  const header = useSelector((state) => state.post.post.header, shallowEqual);
  const user = useSelector((state) => state.user.userData, shallowEqual);
  const isLoading = useSelector((state) => state.post.post.isLoading); //로딩
  const postData = () => {
    if (isLoading) {
      console.log(header);
      if (header) {
        //header가 없으면 페이지는 없는 것 이다.
        return (
          <div className="post-box">
            <PostHeader
              title={header.title}
              board_img={header.board_img}
              description={header.description}
              cook_time={header.cook_time}
              cook_diff={header.cook_diff}
              food_type={header.food_type}
              created_date={header.created_date}
              history={history}
              user={
                user.isAuth && user._no === header.user_no
                  ? user._no
                  : null /*작성한 유저가 맞으면 보냄*/
              }
              postId={match.params.postId}
              userNo={user.isAuth ? user._no : ""}
              writerNo={header.user_no}
              writer={header.user_nickname}
              profile={header.user_img}
            />
            <PostInre />
            <PostRecipe />
            <PostTag />
            <Comment
              postId={match.params.postId}
              user={user.isAuth ? user._no : null /*인증이 되었으면 넘버보냄*/}
            />
          </div>
        );
      } else {
        return <NotFound />;
      }
    } else {
      return <Loading />;
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("ddd");
    console.log(header);
    console.log(postId);
    if (header && header.board_no != postId) {
      dispatch(readDetail(postId));
    } else if (header && header.board_no == postId) {
      //조회수 증가
      Axios.post(`/api/post/${postId}/views`)
        .then((res) => {
          if (res.data.success) {
            //리로드
            dispatch(readViews(postId));
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  }, [postId]);
  return <>{postData()}</>;
}

export default Post;
