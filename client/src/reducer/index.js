import { combineReducers } from "redux";
import user from "../modules/user";
import write from "../modules/write";
import post from "../modules/post";
import edit from "../modules/edit";

const rootReducer = combineReducers({
  user,
  write,
  post,
  edit,
});

export default rootReducer;
