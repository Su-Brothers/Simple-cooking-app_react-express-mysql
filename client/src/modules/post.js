import axios from "axios";
//패치값 재사용을 위해 리덕스 사용
const LOADING_POST = "LOADING_POST";
const LOADING_POSTS = "LOADING_POSTS";
const READ_MORE_POSTS = "READ_MORE_POSTS";

const READ_POSTS = "READ_POSTS";
const READ_POST = "READ_POST"; //포스트 상세정보

const READ_COMMENT = "READ_COMMENT"; //댓글 리로드

const READ_VIEWS = "READ_VIEWS"; //조회수 리로드

const READ_USER_RANKING = "READ_USER_RANKING"; //금주의 요리사 랭킹
const READ_USER_LOADING = "READ_USER_LOADING";

export const readHandler = (type, limit, isEnd) => async (dispatch) => {
  const foodType = typeGender(type);
  dispatch({
    type: LOADING_POSTS,
  });
  const data = await axios
    .get(`/api/post/getposts/${foodType}/${limit}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  if (data.success) {
    if (data.posts.length < 10) {
      isEnd();
    }
    dispatch({
      type: READ_POSTS,
      payload: data.posts,
    });
  } else {
    alert(data.message);
  }
};

export const readMoreHandler = (type, limit, isEnd) => async (dispatch) => {
  const foodType = typeGender(type);
  const data = await axios
    .get(`/api/post/getposts/${foodType}/${limit}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  console.log(data);
  if (data.success) {
    if (data.posts.length < 10) {
      isEnd();
    }
    dispatch({
      type: READ_MORE_POSTS,
      payload: data.posts,
    });
  } else {
    alert(data.message);
  }
};
const typeGender = (target) => {
  //디비에 있는 값으로 치환
  if (target === "allFood") {
    return "typeAll";
  } else if (target === "korea") {
    return "typeKo";
  } else if (target === "china") {
    return "typeChin";
  } else if (target === "japan") {
    return "typeJa";
  } else if (target === "western") {
    return "typeWest";
  }
};

export const readDetail = (id) => async (dispatch) => {
  dispatch({
    type: LOADING_POST,
  });
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

export const readViews = (id) => async (dispatch) => {
  const data = await axios
    .get(`/api/post/${id}/views`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  if (data.success) {
    //리로드
    console.log(data);
    dispatch({
      type: READ_VIEWS,
      payload: data.result,
    });
  } else {
    alert(data.message);
  }
};

export const getUserRanking = () => async (dispatch) => {
  dispatch({
    type: READ_USER_LOADING,
  });
  console.log("시작");
  const data = await axios
    .get("/api/users/ranking")
    .then((res) => res.data)
    .catch((err) => console.log(err));
  console.log(data);
  if (data.success) {
    dispatch({
      type: READ_USER_RANKING,
      payload: data.result,
    });
  } else {
    alert(data.message);
  }
};

const initialState = {
  posts: [],
  postsLoading: false,
  post: {
    header: {
      board_no: "",
      user_no: "",
      title: "",
      description: "",
      cook_time: "",
      cook_diff: "",
      board_img: "",
      food_type: "",
      board_views: "",
      created_date: "",
    },
    ingre: [],
    recipe: [],
    tag: [],
    comment: [],
    isLoading: false,
  },
  userRanking: [],
  userLoading: false,
};

export default function post(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case LOADING_POST:
      return {
        ...state,
        post: {
          ...state.post,
          isLoading: false,
        },
      };
    case LOADING_POSTS:
      return {
        ...state,
        postsLoading: false,
      };

    case READ_POSTS:
      return {
        ...state,
        posts: payload,
        postsLoading: true,
      };

    case READ_MORE_POSTS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
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
    case READ_VIEWS:
      return {
        ...state,
        post: {
          ...state.post,
          header: {
            ...state.post.header,
            board_views: payload,
          },
        },
      };
    case READ_USER_RANKING:
      return {
        ...state,
        userRanking: payload,
        userLoading: true,
      };
    case READ_USER_LOADING:
      return {
        ...state,
        userLoading: false,
      };

    default:
      return state;
  }
}
