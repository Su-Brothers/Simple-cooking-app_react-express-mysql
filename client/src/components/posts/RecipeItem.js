import React from "react";
import "../styles/postsStyle/recipe-item.scss";
function RecipeItem({ view, img, text, order }) {
  console.log(text);
  return (
    <div className={`post-recipe-item ${view}`}>
      <div className="order">{`step ${order}`}</div>
      <div className="recipe-content">
        <div className="img-order">{order}</div>
        <div className="recipe-img-box">
          {img ? (
            <img
              src={`http://localhost:5000/${img}`}
              alt="요리 사진"
              className="recipe-img"
            />
          ) : (
            <img
              src={`http://localhost:5000/uploads/jabakLogo_v4.png`}
              alt="요리 사진"
              className="recipe-img"
            />
          )}
        </div>

        <div className="recipe-text">{text}</div>
      </div>
    </div>
  );
}

export default React.memo(RecipeItem);
