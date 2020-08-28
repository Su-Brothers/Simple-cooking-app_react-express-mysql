import React from "react";
import { FaCrown } from "react-icons/fa";
import "./styles/aside-chef.scss";

function AsideChef() {
  return (
    <aside className="right-aside-chef">
      <div className="chef-list">
        <div className="chef-list-title">
          <div>
            <FaCrown />
            <span>금주의 요리사</span>
          </div>
          <hr />
        </div>

        <div className="chef-list-item">
          <div className="chef-list-item-index">1</div>
          <div>
            <span className="chef-name">쉐프덩</span>
            <span className="chef-likes">+913</span>
          </div>
        </div>
        <div className="chef-list-item">
          <div className="chef-list-item-index">2</div>
          <div>
            <span className="chef-name">내 이름은 김메시</span>
            <span className="chef-likes">+820</span>
          </div>
        </div>
        <div className="chef-list-item">
          <div className="chef-list-item-index">3</div>
          <div>
            <span className="chef-name">내 이름은 요리왕</span>
            <span className="chef-likes">+541</span>
          </div>
        </div>
        <div className="chef-list-item">
          <div className="chef-list-item-index">4</div>
          <div>
            <span className="chef-name">짜파게티잘끓이는남자</span>
            <span className="chef-likes">+401</span>
          </div>
        </div>
        <div className="chef-list-item">
          <div className="chef-list-item-index">5</div>
          <div>
            <span className="chef-name">레식에선요리왕</span>
            <span className="chef-likes">+243</span>
          </div>
        </div>
        <div className="chef-list-item">
          <div className="chef-list-item-index">6</div>
          <div>
            <span className="chef-name">레식에선요리왕2</span>
            <span className="chef-likes">+243</span>
          </div>
        </div>
        <div className="chef-list-item">
          <div className="chef-list-item-index">7</div>
          <div>
            <span className="chef-name">요리왕</span>
            <span className="chef-likes">+243</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AsideChef;
