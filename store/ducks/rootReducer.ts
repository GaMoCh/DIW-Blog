import { combineReducers } from "redux";

import users from "./users";
import posts from "./posts";

export default combineReducers({ users, posts });
