import axios from "axios";
import { debounce } from "lodash";
//액션
const H_INPUT_CHANGE = "write/H_INPUT_CHANGE"; //헤더 인풋
const H_OPTION_CHANGE = "write/H_OPTION_CHANGE"; //헤더 옵션 (카테고리)
const H_IMAGE_HANDLER = "write/H_IMAGE_HANDLER"; //헤더 이미지 추가

const INGRE_HANDLER = "write/INGRE_HANDLER"; //재료 수 추가
const INGRE_REMOVE_HANDLER = "write/INGRE_REMOVE_HANDLER"; //재료 제거
const INGRE_INPUT_HANDLER = "write/INGRE_INPUT_HANDLER"; //재료 인풋

const ORDER_HANDLER = "write/ORDER_HANDLER"; //요리 순서 수 추가
const ORDER_REMOVE_HANDLER = "write/ORDER_REMOVE_HANDLER"; //순서 제거
const ORDER_INPUT_HANDLER = "write/ORDER_INPUT_HANDLER"; //순서 인풋
const ORDER_IMAGE_HANDLER = "write/ORDER_IMAGE_HANDLER"; //순서 이미지 추가

const TAG_HANDLER = "write/TAG_HANDLER"; //태그 추가
const TAG_REMOVE_HANDLER = "write/TAG_REMOVE_HANDLER"; //태그 제거
//액션 생성 함수

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
    payload: { iId: iId++, name: "", volume: "" },
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
  return {
    type: INGRE_INPUT_HANDLER,
    payload: { id: id, target: target, value: value },
  };
};

export const orderHandler = () => {
  //요리순서 추가 핸들러
  return {
    type: ORDER_HANDLER,
    payload: { cId: cId++, text: "", orderPhoto: "" },
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
    payload: { tId: tId++, tagName: value },
  };
};

export const tagRemoveHandler = (id) => {
  return {
    type: TAG_REMOVE_HANDLER,
    payload: id,
  };
};

export const submitHandler = (history, onLoading, completeLoading) => async (
  dispatch,
  getState
) => {
  let board = getState().write;
  const user = getState().user.userData._no;
  board = {
    ...board,
    writer: user,
  };
  //모든 항목이 비지 않았는지 확인
  if (!board.title) {
    alert("제목을 입력해주세요.");
    return;
  } else if (!board.description) {
    alert("요리소개를 입력해주세요.");
    return;
  } else if (!board.mainPhoto) {
    alert("대표 사진이 필요합니다.");
    return;
  } else if (board.category) {
    for (let key in board.category) {
      if (!board.category[key]) {
        alert("요리 정보의 항목을 모두 선택해주세요.");
        return;
      }
    }

    if (!board.Ingredients.length)
      return alert("재료 정보는 하나 이상 필요합니다.");
    for (let key in board.Ingredients) {
      if (!board.Ingredients[key].name || !board.Ingredients[key].volume) {
        alert("재료 정보를 모두 입력해주세요.");
        return;
      }
    }
    if (!board.cookingOrder.length)
      return alert("조리 순서는 하나 이상 필요합니다.");
    for (let key in board.cookingOrder) {
      if (!board.cookingOrder[key].text) {
        alert("조리 순서를 입력해주세요.");
        return;
      }
    }
    //아니라면 서버 요청
    onDebouncSubmit(board, history, onLoading, completeLoading);
  }
};

const onDebouncSubmit = debounce(
  async (board, history, onLoading, completeLoading) => {
    try {
      onLoading();
      const data = await axios
        .post(
          `${process.env.REACT_APP_SERVER_HOST}/api/write/upload/board`,
          board
        )
        .then((res) => res.data);
      if (data.success) {
        alert("게시글 등록완료");
        history.push("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);

      alert("서버에 오류가 발생했습니다.");
    } finally {
      completeLoading();
    }
  },
  500,
  { leading: true, trailing: false }
);

//초기 상태
let iId = 3; //재료 순서 아이디
let cId = 1; //요리 순서 아이디
let tId = 0; //태그 순서 아이디
const initialState = {
  title: "", //제목
  description: "", //요리설명
  mainPhoto: null, //대표 사진
  category: { time: "", difficulty: "", type: "" }, //요리종류(요리시간,난이도,나라)
  Ingredients: [
    { iId: 0, name: "", volume: "" },
    { iId: 1, name: "", volume: "" },
    { iId: 2, name: "", volume: "" },
  ], //재료 (이름,양)
  cookingOrder: [{ cId: 0, text: "", orderPhoto: null }], //조리순서 (본문,사진)
  tag: [],
};

//리듀서
export default function write(state = initialState, action) {
  switch (action.type) {
    case H_INPUT_CHANGE: //제목,소개
      return {
        ...state,
        [action.payload.target]: action.payload.value,
      };
    case H_OPTION_CHANGE: //요리 정보
      return {
        ...state,
        category: {
          ...state.category,
          [action.payload.target]: action.payload.value,
        },
      };

    case H_IMAGE_HANDLER: //요리 정보
      return {
        ...state,
        mainPhoto: action.payload,
      };
    case INGRE_HANDLER: //재료 추가
      return {
        ...state,
        Ingredients: [...state.Ingredients, action.payload],
      };
    case INGRE_REMOVE_HANDLER: //재료 제거
      return {
        ...state,
        Ingredients: state.Ingredients.filter(
          (item) => item.iId !== action.payload
        ),
      };
    case INGRE_INPUT_HANDLER: //재료 인풋
      return {
        ...state,
        Ingredients: state.Ingredients.map((item, index) =>
          item.iId === action.payload.id
            ? {
                //원래 있던 정보는 스프레드를 통해 남기고 액션으로 넘어온 인풋 정보의 값을 바꾼다.
                ...item,
                [action.payload.target]: action.payload.value,
              }
            : item
        ),
      };
    case ORDER_HANDLER: //요리순서 추가
      return {
        ...state,
        cookingOrder: [...state.cookingOrder, action.payload],
      };
    case ORDER_REMOVE_HANDLER: //요리순서 제거
      return {
        ...state,
        cookingOrder: state.cookingOrder.filter(
          (item) => item.cId !== action.payload
        ),
      };
    case ORDER_INPUT_HANDLER: //요리순서 인풋
      return {
        ...state,
        cookingOrder: state.cookingOrder.map((item, index) =>
          item.cId === action.payload.id
            ? {
                //원래 있던 정보는 스프레드를 통해 남기고 액션으로 넘어온 인풋 정보의 값을 바꾼다.
                ...item,
                text: action.payload.value,
              }
            : item
        ),
      };
    case ORDER_IMAGE_HANDLER: //요리순서 이미지 추가
      return {
        ...state,
        cookingOrder: state.cookingOrder.map((item, index) =>
          item.cId === action.payload.id
            ? {
                //원래 있던 정보는 스프레드를 통해 남기고 액션으로 넘어온 인풋 정보의 값을 바꾼다.
                ...item,
                orderPhoto: action.payload.url,
              }
            : item
        ),
      };
    case TAG_HANDLER: //태그 추가
      return {
        ...state,
        tag: [...state.tag, action.payload],
      };

    case TAG_REMOVE_HANDLER: //요리순서 제거
      return {
        ...state,
        tag: state.tag.filter((item) => item.tId !== action.payload),
      };

    default:
      return state;
  }
}
