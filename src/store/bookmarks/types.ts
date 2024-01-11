import { BookmarkType } from "@/types";

type BookmarksInitialState = BookmarkType[]

enum ActionsType {
  BOOKMARKS_FETCH = "BOOKMARKS_FETCH",
  BOOKMARKS_ADD = "BOOKMARKS_ADD",
  BOOKMARKS_DELETE = "BOOKMARKS_DELETE",
  BOOKMARKS_SET = "BOOKMARKS_SET"
}

interface BookmarksActionFetch {
  type: ActionsType.BOOKMARKS_FETCH;
  payload: BookmarksInitialState;
}

interface BookmarksActionAdd {
  type: ActionsType.BOOKMARKS_ADD;
  payload: BookmarkType;
}

interface BookmarksActionDelete {
  type: ActionsType.BOOKMARKS_DELETE;
  payload: { id: string };
}

interface BookmarksActionSet {
  type: ActionsType.BOOKMARKS_SET;
  payload: { id: string, iframe?: string };
}

type BookmarksActions =
    BookmarksActionFetch
  | BookmarksActionAdd
  | BookmarksActionDelete
  | BookmarksActionSet;

export { ActionsType };
export type {
  BookmarksInitialState,
  BookmarksActionFetch,
  BookmarksActionAdd,
  BookmarksActionDelete,
  BookmarksActionSet,
  BookmarksActions,
};
