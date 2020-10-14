import axios from "axios";
import { debounce } from "lodash";
//액션
const READ_POST = "edit/READ_POST"; //수정할 포스트  데이터 가져옴
const READ_POST_SERVER = "edit/READ_POST_SERVER"; //수정할 포스트  데이터 서버에서 가져옴

const H_INPUT_CHANGE = "edit/H_INPUT_CHANGE"; //헤더 인풋
const H_OPTION_CHANGE = "edit/H_OPTION_CHANGE"; //헤더 옵션 (카테고리)
const H_IMAGE_HANDLER = "edit/H_IMAGE_HANDLER"; //헤더 이미지 추가

const INGRE_HANDLER = "edit/INGRE_HANDLER"; //재료 수 추가
const INGRE_REMOVE_HANDLER = "edit/INGRE_REMOVE_HANDLER"; //재료 제거
const INGRE_INPUT_HANDLER = "edit/INGRE_INPUT_HANDLER"; //재료 인풋

const ORDER_HANDLER = "edit/ORDER_HANDLER"; //요리 순서 수 추가
const ORDER_REMOVE_HANDLER = "edit/ORDER_REMOVE_HANDLER"; //순서 제거
const ORDER_INPUT_HANDLER = "edit/ORDER_INPUT_HANDLER"; //순서 인풋
const ORDER_IMAGE_HANDLER = "edit/ORDER_IMAGE_HANDLER"; //순서 이미지 추가

const TAG_HANDLER = "edit/TAG_HANDLER"; //태그 추가
const TAG_REMOVE_HANDLER = "edit/TAG_REMOVE_HANDLER"; //태그 제거

const START_LOADING = "edit/START_LOADING"; //로딩 시작
const COMPLETE_LOADING = "edit/COMPLETE_LOADING"; //로딩 완료
//액션 생성 함수

export const getPostData = (user, history, match) => async (
  dispatch,
  getState
) => {
  const post = getState().post.post; //라우트로 reload없이 이동하면 있음.
  console.log(post);
  if (user.isAuth === null) {
    //유저 상태가 들어올때까지 기다린다.
  } else {
    //유저 정보 들어왔으면 실행
    if (user.isAuth) {
      //로그인이 되어 있다면 수정 권한이 있는지 확인
      if (post.header.board_no) {
        //전 값이 있으면 이미 인증이 된 사람. (권한인증 되야 버튼 있음)
        dispatch({
          type: READ_POST,
          payload: post,
        });
        const { ingre, recipe, tag } = post;
        setId(ingre, recipe, tag);
      } else {
        //원래 401 리다이렉트인데 맞는 유저가 url로 접근할 가능성 염두.
        //서버에서 유저 넘버와 포스트 아이디를 넣고 값이 있으면 가져온다.
        dispatch(getPostServer(history, user, match));
      }
    }
  }
};

const getPostServer = (history, user, match) => async (dispatch) => {
  //서버에서 가져오기
  const data = await axios
    .get(
      `${process.env.REACT_APP_SERVER_HOST}/api/post/${match.params.postId}/edit/getpost/${user._no}`
    )
    .then((res) => res.data)
    .catch((err) => console.log(err));

  if (data.success) {
    dispatch({
      type: READ_POST_SERVER,
      payload: data.result,
    });
    const { Ingredients, cookingOrder, tag } = data.result;
    setId(Ingredients, cookingOrder, tag);
  } else {
    alert(data.message);
    history.push("/");
  }
};

const setId = (ingre, order, tag) => {
  //초기 아이디 설정(원래 있던 아이디의 최고값보다 무조건 커야지 겹치지않음)
  iId = ingre[ingre.length - 1].ingre_no + 1;
  cId = order[order.length - 1].text_no + 1;
  tId = tag ? tag[tag.length - 1].tag_no + 1 : 0;
  console.log(`${iId} ${cId} ${tId}`);
};

export const hInputHandler = (target, value) => {
  return {
    type: H_INPUT_CHANGE,
    payload: { target: target, value: value },
  };
};
export const hOInputHandler = (target, value) => {
  //헤더 카테고리 핸들러
  return {
    type: H_OPTION_CHANGE,
    payload: { target: target, value: value },
  };
};
export const hImgHandelr = (file) => async (dispatch) => {
  let formData = new FormData(); //파일 데이터 형식을 받기 위해 사용
  formData.append("headerimg", file[0]);
  const config = {
    header: { "content-type": "multipart/form-data" }, //파일 형식을 서버에 보내려면 타입을 명시해줘야함
  };
  try {
    const result = await axios
      .post(
        `${process.env.REACT_APP_SERVER_HOST}/api/write/upload/headerimg`,
        formData,
        config
      )
      .then((res) => res.data);

    if (result.success) {
      dispatch({
        type: H_IMAGE_HANDLER,
        payload: result.url,
      });
    } else {
      alert("업로드 실패");
    }
  } catch (err) {
    alert("서버에 오류가 발생했습니다.");
  }
};

export const ingreHandler = () => {
  //재료 추가 핸들러
  return {
    type: INGRE_HANDLER,
    payload: { iId: iId++, ingre_name: "", ingre_volume: "" },
  };
};

export const ingreRemoveHandler = (id) => {
  //재료 제거 핸들러
  return {
    type: INGRE_REMOVE_HANDLER,
    payload: id,
  };
};

export const ingreInputHandler = (id, target, value) => {
  //재료 input값 핸들러
  //id가 iId 일 수 도 있고 ingre_no 일 수도 있다.
  return {
    type: INGRE_INPUT_HANDLER,
    payload: { id: id, target: target, value: value },
  };
};

export const orderHandler = () => {
  //요리순서 추가 핸들러
  return {
    type: ORDER_HANDLER,
    payload: { cId: cId++, main_text: "", img_file: "" },
  };
};

export const orderRemoveHandler = (id) => {
  //순서 제거 핸들러
  return {
    type: ORDER_REMOVE_HANDLER,
    payload: id,
  };
};

export const orderInputHandler = (id, value) => {
  //순서 input값 핸들러
  return {
    type: ORDER_INPUT_HANDLER,
    payload: { id: id, value: value },
  };
};

export const orderImgHandelr = (id, file) => async (dispatch) => {
  //서버 요청은 비동기니까 thunk를 안쓰면 안된다. 바로 반환이 안되니까말이다.
  let formData = new FormData(); //파일 데이터 형식을 받기 위해 사용
  formData.append("orderimg", file[0]);
  const config = {
    header: { "content-type": "multipart/form-data" }, //파일 형식을 서버에 보내려면 타입을 명시해줘야함
  };
  try {
    const result = await axios
      .post(
        `${process.env.REACT_APP_SERVER_HOST}/api/write/upload/orderimg`,
        formData,
        config
      )
      .then((res) => res.data);

    if (result.success) {
      dispatch({
        type: ORDER_IMAGE_HANDLER,
        payload: { id: id, url: result.url },
      });
    } else {
      alert("업로드 실패");
    }
  } catch (err) {
    alert("서버에 오류가 발생했습니다.");
  }
};

export const tagHandler = (value) => {
  //태그 추가 핸들러

  return {
    type: TAG_HANDLER,
    payload: { tId: tId++, tag_name: value },
  };
};

export const tagRemoveHandler = (id) => {
  return {
    type: TAG_REMOVE_HANDLER,
    payload: id,
  };
};

export const submitHandler = (history, id) => async (dispatch, getState) => {
  let board = getState().edit;
  //모든 항목이 비지 않았는지 확인
  if (!board.post.title) {
    alert("제목을 입력해주세요.");
    return;
  } else if (!board.post.description) {
    alert("요리소개를 입력해주세요.");
    return;
  } else if (!board.post.mainPhoto) {
    alert("대표 사진이 필요합니다.");
    return;
  } else if (board.post.category) {
    for (let key in board.post.category) {
      if (!board.post.category[key]) {
        alert("요리 정보의 항목을 모두 선택해주세요.");
        return;
      }
    }
    if (!board.post.Ingredients.length)
      return alert("재료 정보는 하나 이상 필요합니다.");
    for (let key in board.post.Ingredients) {
      if (
        !board.post.Ingredients[key].ingre_name ||
        !board.post.Ingredients[key].ingre_volume
      ) {
        alert("재료 정보를 모두 입력해주세요.");
        return;
      }
    }
    if (!board.post.cookingOrder.length)
      return alert("조리 순서는 하나 이상 필요합니다.");
    for (let key in board.post.cookingOrder) {
      console.log(board.post.cookingOrder);
      if (!board.post.cookingOrder[key].main_text) {
        alert("조리 순서를 입력해주세요.");
        return;
      }
    }
    //아니라면 서버 요청
    onDebounceSubmit(board, history, id, dispatch);
  }
};
const onDebounceSubmit = debounce(
  async (board, history, id, dispatch) => {
    try {
      dispatch({
        type: START_LOADING,
      });
      const data = await axios
        .post(`${process.env.REACT_APP_SERVER_HOST}/api/post/${id}/edit`, board)
        .then((res) => res.data);
      if (data.success) {
        alert(data.message);
        window.location.href = `/post/${id}`;
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("서버에 오류가 발생했습니다.");
    } finally {
      dispatch({
        type: COMPLETE_LOADING,
      });
    }
  },
  500,
  { leading: true, trailing: false }
);

//초기 상태
let iId = 0; //재료 순서 아이디
let cId = 0; //요리 순서 아이디
let tId = 0; //태그 순서 아이디
const initialState = {
  post: {
    boardNo: "", //포스트 넘버
    userNo: "", //유저 넘버
    title: "", //제목
    description: "", //요리설명
    mainPhoto: null, //대표 사진
    category: { time: "", difficulty: "", type: "" }, //요리종류(요리시간,난이도,나라)
    Ingredients: [], //재료 (이름,양)
    cookingOrder: [], //조리순서 (본문,사진)
    tag: [],
  },
  deleteIngre: [], //삭제할 데이터들이 들어감.
  deleteOrder: [],
  deleteTag: [],
  loading: false, //버튼 클릭시 loading spinner
};

//리듀서
export default function edit(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case READ_POST: //포스트 데이터
      return {
        ...state,
        post: {
          boardNo: payload.header.board_no,
          userNo: payload.header.user_no,
          title: payload.header.title,
          description: payload.header.description, //요리설명
          mainPhoto: payload.header.board_img, //대표 사진
          category: {
            time: payload.header.cook_time,
            difficulty: payload.header.cook_diff,
            type: payload.header.food_type,
          }, //요리종류(요리시간,난이도,나라)
          Ingredients: payload.ingre, //재료 (이름,양)
          cookingOrder: payload.recipe, //조리순서 (본문,사진)
          tag: payload.tag,
        },
      };
    case READ_POST_SERVER:
      return {
        ...state,
        post: action.payload,
      };
    case H_INPUT_CHANGE: //제목,소개
      return {
        ...state,
        post: {
          ...state.post,
          [action.payload.target]: action.payload.value,
        },
      };
    case H_OPTION_CHANGE:
      return {
        ...state,
        post: {
          ...state.post,
          category: {
            ...state.post.category,
            [action.payload.target]: action.payload.value,
          },
        },
      };

    case H_IMAGE_HANDLER:
      return {
        ...state,
        post: {
          ...state.post,
          mainPhoto: action.payload,
        },
      };
    case INGRE_HANDLER: //재료 추가
      return {
        ...state,
        post: {
          ...state.post,
          Ingredients: [...state.post.Ingredients, action.payload],
        },
      };
    case INGRE_REMOVE_HANDLER: //재료 제거
      const deleteData = state.post.Ingredients.find(
        //하나를 찾아서 변수에 할당.
        (item) => (item.iId ? item.iId : item.ingre_no) === action.payload
      );
      console.log(deleteData);

      return {
        ...state,
        post: {
          ...state.post,
          Ingredients: state.post.Ingredients.filter(
            (item) => (item.iId ? item.iId : item.ingre_no) !== action.payload
          ),
        },
        deleteIngre: [...state.deleteIngre, deleteData],
      };
    case INGRE_INPUT_HANDLER: //재료 인풋
      return {
        ...state,
        post: {
          ...state.post,
          Ingredients: state.post.Ingredients.map((item, index) =>
            (item.iId ? item.iId : item.ingre_no) === action.payload.id
              ? {
                  //iId는 새로 추가된 데이터에만 있다.
                  ...item,
                  [action.payload.target]: action.payload.value,
                }
              : item
          ),
        },
      };
    case ORDER_HANDLER: //요리순서 추가
      return {
        ...state,
        post: {
          ...state.post,
          cookingOrder: [...state.post.cookingOrder, action.payload],
        },
      };
    case ORDER_REMOVE_HANDLER: //요리순서 제거
      const oDeleteData = state.post.cookingOrder.find(
        //하나를 찾아서 변수에 할당.
        (item) => (item.cId ? item.cId : item.text_no) === action.payload
      );
      console.log(oDeleteData);
      console.log(state.post.cookingOrder);
      return {
        ...state,
        post: {
          ...state.post,
          cookingOrder: state.post.cookingOrder.filter(
            (item) => (item.cId ? item.cId : item.text_no) !== action.payload
          ),
        },
        deleteOrder: [...state.deleteOrder, oDeleteData],
      };
    case ORDER_INPUT_HANDLER: //요리순서 인풋
      return {
        ...state,
        post: {
          ...state.post,
          cookingOrder: state.post.cookingOrder.map((item, index) =>
            (item.cId ? item.cId : item.text_no) === action.payload.id
              ? {
                  //iId는 새로 추가된 데이터에만 있다.
                  ...item,
                  main_text: action.payload.value,
                }
              : item
          ),
        },
      };
    case ORDER_IMAGE_HANDLER: //요리순서 이미지 추가
      return {
        ...state,
        post: {
          ...state.post,
          cookingOrder: state.post.cookingOrder.map((item, index) =>
            (item.cId ? item.cId : item.text_no) === action.payload.id
              ? {
                  //iId는 새로 추가된 데이터에만 있다.
                  ...item,
                  img_file: action.payload.url,
                }
              : item
          ),
        },
      };
    case TAG_HANDLER: //태그 추가
      return {
        ...state,
        post: {
          ...state.post,
          tag: state.post.tag
            ? [...state.post.tag, action.payload]
            : [action.payload],
        },
      };

    case TAG_REMOVE_HANDLER: //태그 제거
      const tDeleteData = state.post.tag.find(
        //하나를 찾아서 변수에 할당.
        (item) => (item.tId ? item.tId : item.tag_no) === action.payload
      );
      console.log(tDeleteData);

      return {
        ...state,
        post: {
          ...state.post,
          tag: state.post.tag.filter(
            (item) => (item.tId ? item.tId : item.tag_no) !== action.payload
          ),
        },
        deleteTag: [...state.deleteTag, tDeleteData],
      };

    case START_LOADING: //로딩 시작
      return {
        ...state,
        loading: true,
      };
    case COMPLETE_LOADING: //로딩 완료
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
