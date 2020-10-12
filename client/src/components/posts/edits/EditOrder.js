import React from "react";
import { FaPlusCircle, FaLightbulb } from "react-icons/fa";
import "../../styles/writeStyle/write-order.scss";
import OrderItem from "./EditOrderItem";
import { useSelector, useDispatch } from "react-redux";
import { orderHandler } from "../../../modules/edit";

function EditOrder() {
  const dispatch = useDispatch();
  const cookingOrder = useSelector((state) => state.edit.post.cookingOrder);
  const orderAddHandler = (e) => {
    e.preventDefault();
    dispatch(orderHandler());
  };
  return (
    <div className="write-order write-page-item">
      <div className="write-order-box">
        <div className="write-order-title">조리 순서</div>
        <span>
          <FaLightbulb />
          순서에 유의해주세요.
        </span>
        {cookingOrder.map((item, index) => (
          <OrderItem
            key={item.text_no ? item.text_no : item.cId}
            id={item.text_no ? item.text_no : item.cId}
            text={item.main_text}
            orderPhoto={item.img_file}
            order={index + 1}
          />
        ))}
        <a
          href="_blank"
          className="orderAdd-box"
          type="button"
          onClick={orderAddHandler}
        >
          <FaPlusCircle />
          조리순서 추가
        </a>
      </div>
    </div>
  );
}

export default EditOrder;
