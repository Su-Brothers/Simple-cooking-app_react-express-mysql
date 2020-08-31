import React from "react";
import { tagRemoveHandler } from "../../modules/write";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import "../styles/writeStyle/tag-item.scss";

function TagItem({ value, id }) {
  const dispatch = useDispatch();

  const removeHandler = (e) => {
    e.preventDefault();
    dispatch(tagRemoveHandler(id));
  };
  return (
    <a
      href="#"
      onClick={removeHandler}
      style={{ textDecoration: "none", color: "white" }}
    >
      <div className="tag-item">
        {`#${value}`}
        <FaTimes className="tag-item-xmark" />
      </div>
    </a>
  );
}

export default TagItem;
