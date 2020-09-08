import axios from "axios";
//패치값 재사용을 위해 리덕스 사용
const READ_POSTS = "READ_POSTS";
const READ_POST = "READ_POST"; //포스트 상세정보

const READ_COMMENT = "READ_COMMENT"; //댓글 리로드

export const readHandler = () => async (dispatch) => {
  const data = await axios
    .get("/api/post/getposts")
    .then((res) => res.data)
    .catch((err) => console.log(err));

  if (data.success) {
    dispatch({
      type: READ_POSTS,
      payload: data.posts,
    });
  } else {
    alert(data.message);
  }
};

export const readDetail = (id) => async (dispatch) => {
  const data = await axios //포스트 디테일페이지 로드
    .get(`/api/post/${id}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  if (data.success) {
    dispatch({
      type: READ_POST,
      payload: data.result,
    });
  } else {
    alert(data.message);
  }
};

export const readComment = (id) => async (dispatch) => {
  const data = await axios //코멘트를 추가하거나 제거할때 리로드
    .get(`/api/post/getcomments/${id}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  if (data.success) {
    dispatch({
      type: READ_COMMENT,
      payload: data.result,
    });
  } else {
    alert(data.message);
  }
};

const initialState = {
  posts: [],
  post: {
    header: {
      board_img: "",
      cook_diff: "",
      cook_time: "",
      created_date: "",
      description: "",
      food_type: "",
      title: "",
    },
    ingre: [],
    recipe: [],
    tag: [],
    comment: [],
  },
};

export default function post(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case READ_POSTS:
      return {
        ...state,
        posts: payload,
      };

    case READ_POST:
      return {
        ...state,
        post: payload,
      };

    case READ_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comment: payload,
        },
      };

    default:
      return state;
  }
}
