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

function Post({ match }) {
  const dispatch = useDispatch();
  const header = useSelector((state) => state.post.post.header, shallowEqual);
  const user = useSelector((state) => state.user.userData, shallowEqual);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(readDetail(match.params.postId));
  }, [match.params.postId]);
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
}

export default Post;
