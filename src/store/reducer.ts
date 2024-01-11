import { Reducer } from "react";
import { UserActions, userInitialState, userReducer } from "./user";
import {
  BookmarksActions,
  bookmarksInitialState,
  bookmarksReducer,
} from "./bookmarks";

const combineReducers = (slices: any) => (
  state: any,
  action: any,
) => Object.keys(slices).reduce(
  (acc, prop) => ({
    ...acc,
    [prop]: slices[prop](acc[prop], action),
  }),
  state,
);

const initialState = {
  user: userInitialState,
  bookmarks: bookmarksInitialState,
};

const reducers = {
  user: userReducer,
  bookmarks: bookmarksReducer,
};

const rootReducer = combineReducers(reducers) as Reducer<
  typeof initialState,
  UserActions | BookmarksActions
>;

export { initialState, rootReducer };
