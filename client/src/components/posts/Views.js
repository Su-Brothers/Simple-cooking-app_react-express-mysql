import Axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readViews } from "../../modules/post";

function Views() {
  const views = useSelector((state) => state.post.post.header.board_views);

  return <span>{views}</span>;
}

export default Views;
