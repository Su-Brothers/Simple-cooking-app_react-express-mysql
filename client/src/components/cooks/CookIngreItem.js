import React from "react";
import "../styles/cook-ingre-item.scss";
function CookIngreItem({ name, quan, add, active }) {
  const onAddHandler = (e) => {
    e.preventDefault();
    if (active === "") {
      add(name);
    } else {
      return;
    }
  };
  return (
    <a href="_blank" onClick={onAddHandler} className="cook-ingre-link">
      <div className={`cook-ingre-item ${active}`}>
        <div className="cook-ingre-name">{name}</div>
        <div className="cook-ingre-quan">{quan}</div>
      </div>
    </a>
  );
}

export default React.memo(CookIngreItem);
