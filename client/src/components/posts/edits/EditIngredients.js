import React from "react";
import "../../styles/writeStyle/write-ingredients.scss";
import { FaLightbulb, FaPlusCircle } from "react-icons/fa";
import IngreItem from "./EditIngreItem";
import { useSelector, useDispatch } from "react-redux";
import { ingreHandler } from "../../../modules/edit";

function EditIngredients() {
  const Ingredients = useSelector((state) => state.edit.post.Ingredients);
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
              key={item.ingre_no ? item.ingre_no : item.iId}
              id={item.ingre_no ? item.ingre_no : item.iId}
              value={item.ingre_name}
              volume={item.ingre_volume}
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

export default EditIngredients;
