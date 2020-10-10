import React, { useState } from "react";
import "../styles/postsStyle/post-recipe.scss";
import RecipeItem from "./RecipeItem";
import { FaThLarge, FaThList, FaAlignLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
function PostRecipe() {
  const [View, setView] = useState("large");
  const recipe = useSelector((state) => state.post.post.recipe);
  const viewList = [
    //카테고리 리스트, 메인페이지와 다른 방식으로 접근.
    { name: "large", icon: <FaThList /> },
    { name: "middle", icon: <FaThLarge /> },
    { name: "onlyText", icon: <FaAlignLeft /> },
  ];

  const viewHandler = (e, target) => {
    e.preventDefault();
    setView(target);
  };

  const viewItem = viewList.map((item, index) => (
    //만들어논 리스트를 맵으로 돌린후 저장한다.
    //이 과정에서 item의 이름이 현재 상태와 같으면 active를 클래스로 준다.
    <a
      href="_blank"
      className={`view-btn ${View === item.name ? "active" : ""}`}
      onClick={(e) => viewHandler(e, `${item.name}`)}
      key={item.name}
    >
      {item.icon}
    </a>
  ));
  return (
    <div className="post-item">
      <div className="post-item-box post-recipe-box">
        <div className="post-recipe-title">레시피</div>
        <div className="view-box">{viewItem}</div>
        <div className={`post-recipe-item-container ${View}`}>
          {recipe &&
            recipe.map((item, index) => (
              <RecipeItem
                view={View}
                img={item.img_file}
                text={item.main_text}
                key={item.text_no}
                order={index + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default PostRecipe;
