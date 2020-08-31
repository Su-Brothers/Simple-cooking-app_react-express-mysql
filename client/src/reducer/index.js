import { combineReducers } from "redux";
import user from "../modules/user";
import write from "../modules/write";
const rootReducer = combineReducers({
  user,
  write,
});

export default rootReducer;
