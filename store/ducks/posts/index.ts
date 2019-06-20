import { Reducer } from "redux";

import { PostsState, PostsTypes } from "./types";
import initialState from "./initialState";

const reducer: Reducer<PostsState> = (state = initialState, action) => {
  switch (action.type) {
    case PostsTypes.ADD:
      return { ...state, data: action.payload.data };
    case PostsTypes.EDIT:
      return { ...state, data: action.payload.data };
    case PostsTypes.REMOVE:
      return { ...state, data: action.payload.data };
    case PostsTypes.LIKE:
      return { ...state, data: action.payload.data };
    case PostsTypes.UNLIKE:
      return { ...state, data: action.payload.data };
    default:
      return state;
  }
};

export default reducer;
