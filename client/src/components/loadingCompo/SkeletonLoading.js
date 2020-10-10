import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../styles/skeleton/skeleton-loading.scss";
function SkeletonLoading({ limit, active }) {
  //데이터를 불러올때 loading을 부드럽게 하기 위해 만든 컴포넌트
  const data = Array.from({ length: limit }, () => 0).map((item, index) => (
    <div className={`skelecton-box ${active ? "" : "active"}`} key={index}>
      <div className="skelecton-container">
        <div className="skelecton-top">
          <div className="img-box">
            <div className="img-box-content"></div>
          </div>
          <div className="skelecton-writer">
            <div className="writer-box"></div>
            <div className="type-box"></div>
          </div>
        </div>
        <div className="skelecton-middle">
          <div className="img-box"></div>
          <div className="skelecton-title">
            <div className="skelecton-title-box"></div>
          </div>
        </div>
        <div className="skelecton-bottom">
          <div className="skelecton-bottom-left">
            <div className="svg-box"></div>

            <div className="svg-box"></div>

            <div className="svg-box"></div>
          </div>
          <div className="skelecton-bottom-right"></div>
        </div>
      </div>
      <div className="bar">
        <div className="indicator"></div>
      </div>
    </div>
  ));
  return <>{data}</>;
}
SkeletonLoading.defaultProps = {
  limit: 1,
};

export default React.memo(SkeletonLoading);
