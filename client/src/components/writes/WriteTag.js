import React, { useState } from "react";
import "../styles/writeStyle/write-tag.scss";
import { FaLightbulb } from "react-icons/fa";
import TagItem from "./TagItem";
import { useDispatch, useSelector } from "react-redux";
import { tagHandler } from "../../modules/write";
function WriteTag() {
  const tag = useSelector((state) => state.write.tag);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const inputHandler = (e) => {
    setInput(e.target.value);
  };
  const addHandler = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault(); //, 문자는 지워져야함
      const isOverlap = tag.every((item) => item.tagName !== input);
      if (isOverlap) {
        //태그 중복확인
        dispatch(tagHandler(input));
      }
      setInput("");
    }
  };
  return (
    <div className="write-tag write-page-item">
      <div className="write-tag-box">
        <div className="write-tag-title">태그</div>
        <div className="write-tag-left">
          <div className="write-tag-left-input">
            <input
              type="text"
              value={input}
              onChange={inputHandler}
              onKeyPress={addHandler}
            />
            <span>
              <FaLightbulb />
              자신의 요리에 대한 해시태그를 남겨보세요. 예)간편,자취요리
            </span>
          </div>
          <div className="tag-area">
            {tag.map((item, index) => (
              <TagItem key={item.tId} value={item.tagName} id={item.tId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteTag;
