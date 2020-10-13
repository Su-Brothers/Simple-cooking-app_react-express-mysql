import React from "react";
import DropZone from "react-dropzone";
import { FaCamera } from "react-icons/fa";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import "../styles/writeStyle/write-header.scss";
import {
  hInputHandler,
  hOInputHandler,
  hImgHandelr,
} from "../../modules/write";
function WriteHeader() {
  const { title, description, mainPhoto } = useSelector(
    (state) => state.write,
    shallowEqual //비구조할당(매 번 새로운 객체를 생성하므로 얕은복사)
  );
  const dispatch = useDispatch();
  const inputHandler = (e) => {
    dispatch(hInputHandler(e.target.name, e.target.value));
  };
  const optionHandler = (e) => {
    dispatch(hOInputHandler(e.target.name, e.target.value));
  };

  const imageUpload = (files) => {
    dispatch(hImgHandelr(files));
  };
  return (
    <div className="write-header write-page-item">
      <div className="write-header-top">
        <div className="header-top-left">
          <div className="write-header-title">
            요리 제목{" "}
            <input
              type="text"
              name="title"
              value={title}
              onChange={inputHandler}
            />
          </div>
          <div className="write-header-description">
            <label htmlFor="description">요리 소개</label>{" "}
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={inputHandler}
            />
          </div>
        </div>

        <div className="header-top-right">
          <DropZone onDrop={imageUpload} multiple={false} maxSize={1000000}>
            {({ getRootProps, getInputProps }) => (
              <div className="drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />
                <FaCamera />
                {mainPhoto ? (
                  <img
                    src={`${process.env.REACT_APP_IMG_URL}/${mainPhoto}`}
                    alt="요리 대표 사진"
                  />
                ) : null}
              </div>
            )}
          </DropZone>
        </div>
      </div>
      <div className="write-header-bottom">
        요리 정보
        <div className="header-bottom-box">
          <div className="header-bottom-item">
            <label htmlFor="time">시간</label>
            <select name="time" id="time" onChange={optionHandler}>
              <option value="">시간</option>
              <option value="lessTen">10분 이내</option>
              <option value="lessTwenty">20분 이내</option>
              <option value="lessThirty">30분 이내</option>
              <option value="moreHours">1시간 이상</option>
            </select>
          </div>
          <div className="header-bottom-item">
            <label htmlFor="diff">난이도</label>
            <select name="difficulty" id="diff" onChange={optionHandler}>
              <option value="">난이도</option>
              <option value="diffTop">상</option>
              <option value="diffMiddle">중</option>
              <option value="diffBottom">하</option>
            </select>
          </div>
          <div className="header-bottom-item">
            <label htmlFor="cookType">종류</label>
            <select name="type" id="cookType" onChange={optionHandler}>
              <option value="">종류</option>
              <option value="typeKo">한식</option>
              <option value="typeChin">중식</option>
              <option value="typeJa">일식</option>
              <option value="typeWest">양식</option>
              <option value="typeEtc">기타</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteHeader;
