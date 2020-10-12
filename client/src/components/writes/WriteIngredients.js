import React from "react";
import "../styles/writeStyle/write-ingredients.scss";
import { FaLightbulb, FaPlusCircle } from "react-icons/fa";
import IngreItem from "./IngreItem";
import { useSelector, useDispatch } from "react-redux";
import { ingreHandler } from "../../modules/write";
function WriteIngredients() {
  const Ingredients = useSelector((state) => state.write.Ingredients);
  const dispatch = useDispatch();

  const ingreAddHandler = (e) => {
    e.preventDefault(); //재료 추가
    dispatch(ingreHandler());
  };
  return (
    <div className="write-ingredient  write-page-item">
      <div className="ingredient-box">
        <div className="ingre-title">재료</div>
        <div className="ingre-right">
          <span>
            <FaLightbulb />
            요리에 들어갈 알맞은 재료를 입력해주세요.
          </span>
          {Ingredients.map((item, index) => (
            <IngreItem
              key={item.iId}
              id={item.iId}
              value={item.name}
              volume={item.volume}
            />
          ))}

          <a
            href="_blank"
            className="ingreAdd-box"
            type="button"
            onClick={ingreAddHandler}
          >
            <FaPlusCircle />
            재료 추가
          </a>
        </div>
      </div>
    </div>
  );
}

export default WriteIngredients;
