import React from "react";
import { tagRemoveHandler } from "../../modules/write";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import "../styles/writeStyle/tag-item.scss";
import PropTypes from "prop-types";
function TagItem({ value, id }) {
  const dispatch = useDispatch();

  const removeHandler = (e) => {
    e.preventDefault();
    dispatch(tagRemoveHandler(id));
  };
  return (
    <a
      href="_blank"
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
TagItem.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default TagItem;
