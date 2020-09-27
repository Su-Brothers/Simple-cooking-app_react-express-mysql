import React from "react";
import "./styles/cook-result-item.scss";
function CookResultItem({ id, name, remove }) {
  const onRemoveHandler = (e) => {
    e.preventDefault();
    remove(id, name);
  };
  return (
    <div className="cook-result-item">
      <a href="#" onClick={onRemoveHandler}>
        {name}
      </a>
    </div>
  );
}

export default React.memo(CookResultItem);
