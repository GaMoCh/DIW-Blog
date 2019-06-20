import { createStore, applyMiddleware } from "redux";
import { persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import storage from "redux-persist/lib/storage";

import rootReducer from "./ducks/rootReducer";

import { UsersState } from "./ducks/users/types";
import { PostsState } from "./ducks/posts/types";

import usersInitialState from "./ducks/users/initialState";
import postsInitialState from "./ducks/posts/initialState";

export interface ApplicationState {
  posts: PostsState;
  users: UsersState;
}

const applicationState: ApplicationState = {
  users: usersInitialState,
  posts: postsInitialState
};

const persistConfig = {
  key: "DB_GabrielChaves",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function initializeStore(initialState: ApplicationState = applicationState) {
  return createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware()));
}
