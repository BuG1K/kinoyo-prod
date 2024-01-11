import { Reducer } from "react";
import { BookmarksActions, ActionsType, BookmarksInitialState } from "./types";

const bookmarksInitialState: BookmarksInitialState = [];

const bookmarksReducer: Reducer<BookmarksInitialState, BookmarksActions> = (
  state,
  { type, payload },
) => {
  if (type === ActionsType.BOOKMARKS_FETCH) {
    return payload;
  } if (type === ActionsType.BOOKMARKS_ADD) {
    return [...state, payload];
  } if (type === ActionsType.BOOKMARKS_DELETE) {
    return state.filter(({ id }) => id !== payload.id);
  } if (type === ActionsType.BOOKMARKS_SET) {
    return state.map((bookmark) => {
      if (bookmark.id === payload.id) {
        return {
          ...bookmark,
          iframe: payload.iframe || bookmark.iframe,
        };
      }

      return bookmark;
    });
  }

  return state;
};

export { bookmarksInitialState, bookmarksReducer };
