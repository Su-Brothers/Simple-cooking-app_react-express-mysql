import React from "react";
import "./styles/not-found.scss";
function NotFound({ item }) {
  return (
    <div className="not-found">
      <div className="not-found-en">404 NOT FOUND</div>
      <div className="not-found-text">존재하지 않는 {item}입니다.</div>
    </div>
  );
}
NotFound.defaultProps = {
  item: "페이지",
};
export default NotFound;
