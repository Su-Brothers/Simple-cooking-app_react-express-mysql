import React from "react";
import WriteHeader from "./WriteHeader";
import WriteIngredients from "./WriteIngredients";
import WriteOrder from "./WriteOrder";
import WriteTag from "./WriteTag";
import "../styles/writeStyle/writepage.scss";
import { submitHandler } from "../../modules/write";
import { useDispatch } from "react-redux";
function WritePage({ history }) {
  const dispatch = useDispatch();
  return (
    <div className="write-container">
      <div className="write-container-title">레시피 만들기</div>
      <WriteHeader />
      <WriteIngredients />
      <WriteOrder />
      <WriteTag />
      <div className="write-container-btn-box">
        <button
          type="button"
          className="submit-btn"
          onClick={() => dispatch(submitHandler(history))}
        >
          등록하기
        </button>
        <button type="button">취소하기</button>
      </div>
    </div>
  );
}

export default WritePage;
