import React from "react";
import "../styles/postsStyle/post.scss";
import PostHeader from "./PostHeader";
import PostInre from "./PostInre";
import PostRecipe from "./PostRecipe";
import PostTag from "./PostTag";
import Comment from "./Comment";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { readDetail } from "../../modules/post";
import Loading from "../Loading";

function Post({ match, history }) {
  const { postId } = match.params;
  const dispatch = useDispatch();
  const header = useSelector((state) => state.post.post.header, shallowEqual);
  const user = useSelector((state) => state.user.userData, shallowEqual);
  const isLoading = useSelector((state) => state.post.post.isLoading); //로딩
  useEffect(() => {
    if (header.board_no != postId) {
      window.scrollTo(0, 0);
      dispatch(readDetail(postId));
    }
  }, [postId]);
  return (
    <>
      {isLoading ? (
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
          />
          <PostInre />
          <PostRecipe />
          <PostTag />
          <Comment
            postId={match.params.postId}
            user={user.isAuth ? user._no : null /*인증이 되었으면 넘버보냄*/}
          />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Post;
