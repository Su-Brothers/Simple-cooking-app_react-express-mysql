import React from "react";
import { useSelector } from "react-redux";
import { FaCrown } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import "./styles/aside-chef-mini.scss";
function AsideChefMini() {
  //모바일화면에서의 금주의 요리사 모달
  const userRanking = useSelector((state) => state.post.userRanking);
  const userLoading = useSelector((state) => state.post.userLoading);

  const ranking = () => {
    //데이터 있을시 넣어줌
    if (userLoading) {
      if (userRanking.length) {
        return userRanking.map((item, index) => (
          <div className="m-chef-list-item" key={item.user_no}>
            <div className="chef-list-item-index">{index + 1}</div>
            <div className="chef-content">
              <span className="chef-name">{item.nick}</span>
              <span className="chef-likes">{`+${item.likes}`}</span>
            </div>
          </div>
        ));
      } else {
        return "순위 없음";
      }
    } else {
      return "loading...";
    }
  };
  return (
    <aside className="mini-aside-chef">
      <div className="chef-list">
        <div className="chef-list-title">
          <div>
            <GiChefToque />
            <span>금주의 요리사</span>
          </div>
        </div>
        {ranking()}
      </div>
    </aside>
  );
}

export default AsideChefMini;
