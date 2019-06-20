import { Reducer } from "redux";

import { UsersState, UsersTypes } from "./types";
import initialState from "./initialState";

const reducer: Reducer<UsersState> = (state = initialState, action) => {
  switch (action.type) {
    case UsersTypes.ADD:
      return { ...state, data: action.payload.data };
    case UsersTypes.EDIT:
      return { ...state, data: action.payload.data };
    case UsersTypes.REMOVE:
      return { ...state, data: action.payload.data };
    case UsersTypes.SIGNIN:
      return { ...state, loggedId: action.payload.loggedId };
    case UsersTypes.SIGNOUT:
      return { ...state, loggedId: action.payload.loggedId };
    default:
      return state;
  }
};

export default reducer;
