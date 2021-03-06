import React from "react";
import DropZone from "react-dropzone";
import { FaCamera, FaTimesCircle } from "react-icons/fa";
import "../styles/writeStyle/order-item.scss";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  orderInputHandler,
  orderRemoveHandler,
  orderImgHandelr,
} from "../../modules/write";
function OrderItem({ id, text, order, orderPhoto }) {
  const dispatch = useDispatch();
  const inputHandler = (e) => {
    dispatch(orderInputHandler(id, e.target.value));
  };
  const removeHandler = () => {
    dispatch(orderRemoveHandler(id));
  };
  const imageUpload = (file) => {
    dispatch(orderImgHandelr(id, file));
  };
  return (
    <div className="order-item-box">
      <div className="order-item-box-num">{order}</div>
      <textarea value={text} onChange={inputHandler} />
      <div className="order-item-img-box">
        <DropZone onDrop={imageUpload} multiple={false} maxSize={1000000}>
          {({ getRootProps, getInputProps }) => (
            <div className="order-item-drop-zone" {...getRootProps()}>
              <input {...getInputProps()} />
              <FaCamera />
              {orderPhoto ? (
                <img
                  src={`${process.env.REACT_APP_IMG_URL}/${orderPhoto}`}
                  alt="요리사진"
                />
              ) : null}
            </div>
          )}
        </DropZone>
      </div>

      <button type="button" onClick={removeHandler}>
        <FaTimesCircle />
      </button>
    </div>
  );
}
OrderItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  orderPhoto: PropTypes.string,
};

export default React.memo(OrderItem);
