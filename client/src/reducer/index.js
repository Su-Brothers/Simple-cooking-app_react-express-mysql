import { combineReducers } from "redux";
import user from "../modules/user";
import write from "../modules/write";
import post from "../modules/post";
const rootReducer = combineReducers({
  user,
  write,
  post,
});

export default rootReducer;
