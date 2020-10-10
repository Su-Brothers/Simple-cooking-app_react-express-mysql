import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../styles/skeleton/skeleton-ingre.scss";

function SkeletonLoadingIngre({ limit, active }) {
  const data = Array.from({ length: limit }, () => 0).map((item, index) => (
    <div className={`skelecton ${active ? "" : "active"}`} key={index}>
      <div className="bar">
        <div className="indicator"></div>
      </div>
    </div>
  ));

  return <>{data}</>;
}
SkeletonLoadingIngre.defaultProps = {
  limit: 1,
};
export default SkeletonLoadingIngre;
