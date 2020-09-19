import React from "react";
import { FaCrown } from "react-icons/fa";
import "./styles/aside-chef.scss";
import { withRouter } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRanking } from "../modules/post";

function AsideChef({ location }) {
  const userRanking = useSelector((state) => state.post.userRanking);
  const userLoading = useSelector((state) => state.post.userLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserRanking());
  }, []);
  const ranking = () => {
    //데이터 있을시 넣어줌
    if (userLoading) {
      if (userRanking.length) {
        return userRanking.map((item, index) => (
          <div className="chef-list-item" key={item.user_no}>
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
  return location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/write" ? (
    <aside className="right-aside-chef">
      <div className="chef-list">
        <div className="chef-list-title">
          <div>
            <FaCrown />
            <span>금주의 요리사</span>
          </div>
          <hr />
        </div>

        {ranking()}
      </div>
    </aside>
  ) : null;
}

export default withRouter(AsideChef);
