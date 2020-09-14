import React from "react";

import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import "../../styles/writeStyle/tag-item.scss";
import PropTypes from "prop-types";
import { tagRemoveHandler } from "../../../modules/edit";
function EditTagItem({ value, id }) {
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
EditTagItem.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default EditTagItem;
