import React from "react";
import WriteHeader from "./WriteHeader";
import WriteIngredients from "./WriteIngredients";
import WriteOrder from "./WriteOrder";
import WriteTag from "./WriteTag";
import "../styles/writeStyle/writepage.scss";
import { submitHandler } from "../../modules/write";
import { useDispatch } from "react-redux";
import LoadingSpinner from "../loadingCompo/LoadingSpinner";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
function WritePage({ history }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(null);

  const onLoading = () => {
    if (!isMounted.current) return;
    setLoading(true);
  };
  const completeLoading = () => {
    if (!isMounted.current) return;
    setLoading(false);
  };
  useEffect(() => {
    isMounted.current = true;
    console.log("render");
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <div className="write-container">
      <div className="write-container-title">레시피 만들기</div>
      <WriteHeader />
      <WriteIngredients />
      <WriteOrder />
      <WriteTag />
      <div className="write-container-btn-box">
        {loading && (
          <div className="loading-box">
            <LoadingSpinner />
          </div>
        )}

        <button
          type="button"
          className="submit-btn"
          onClick={() =>
            dispatch(submitHandler(history, onLoading, completeLoading))
          }
        >
          등록하기
        </button>
        <button type="button" onClick={() => history.goBack()}>
          취소하기
        </button>
      </div>
    </div>
  );
}

export default WritePage;
