import React from "react";
import "../styles/postsStyle/recipe-item.scss";
import normalImg from "../../images/jabakLogo_v4.png";
function RecipeItem({ view, img, text, order }) {
  return (
    <div className={`post-recipe-item ${view}`}>
      <div className="order">{`step ${order}`}</div>
      <div className="recipe-content">
        <div className="img-order">{order}</div>
        <div className="recipe-img-box">
          {img ? (
            <img
              src={`${process.env.REACT_APP_IMG_URL}/${img}`}
              alt="요리 사진"
              className="recipe-img"
            />
          ) : (
            <img src={normalImg} alt="요리 사진" className="recipe-img" />
          )}
        </div>

        <div className="recipe-text">{text}</div>
      </div>
    </div>
  );
}

export default React.memo(RecipeItem);
