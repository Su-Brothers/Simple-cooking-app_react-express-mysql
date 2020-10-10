import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getPostData, submitHandler } from "../../../modules/edit";
import EditHeader from "./EditHeader";
import EditIngredients from "./EditIngredients";
import EditOrder from "./EditOrder";
import EditTag from "./EditTag";
import "../../styles/writeStyle/writepage.scss";
import LoadingSpinner from "../../loadingCompo/LoadingSpinner";
function EditPage({ history, match }) {
  const edit = useSelector((state) => state.edit.post);
  const loading = useSelector((state) => state.edit.loading);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPostData(user, history, match));
  }, [user.isAuth]);
  return (
    <div className="write-container">
      <div className="write-container-title">레시피 수정</div>
      <EditHeader
        title={edit.title}
        description={edit.description}
        time={edit.category.time}
        diff={edit.category.difficulty}
        type={edit.category.type}
        photo={edit.mainPhoto}
      />
      <EditIngredients />
      <EditOrder />
      <EditTag />
      <div className="write-container-btn-box">
        {loading && (
          <div className="loading-box">
            <LoadingSpinner />
          </div>
        )}
        <button
          type="button"
          className="submit-btn"
          onClick={() => dispatch(submitHandler(history, match.params.postId))}
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

export default EditPage;
