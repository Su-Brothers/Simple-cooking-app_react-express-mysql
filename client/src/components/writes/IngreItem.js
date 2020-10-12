import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import "../styles/writeStyle/ingre-item.scss";
import { useDispatch } from "react-redux";
import { ingreRemoveHandler, ingreInputHandler } from "../../modules/write";
import PropTypes from "prop-types";
function IngreItem({ id, value, volume }) {
  //부모에게 스토어에 있는 재료명과 양의 값을 가져온다.
  const dispatch = useDispatch();
  const inputHandler = (e) => {
    dispatch(ingreInputHandler(id, e.target.name, e.target.value));
    //dispatch로 자신의 id,바뀔 인풋의 정보를 넣어준다.
  };
  return (
    <div className="ingre-item-box">
      <input
        type="text"
        placeholder="예) 소고기"
        className="ingre-item-name"
        name="name"
        value={value}
        onChange={inputHandler}
      />
      <input
        type="text"
        placeholder="예) 300g"
        className="ingre-item-volume"
        name="volume"
        value={volume}
        onChange={inputHandler}
      />
      <button type="button" onClick={() => dispatch(ingreRemoveHandler(id))}>
        <FaTimesCircle />
      </button>
    </div>
  );
}

IngreItem.propTypes = {
  id: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
};

export default React.memo(IngreItem);
