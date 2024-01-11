import { BookmarkType } from "@/types";
import {
  BookmarksActionFetch,
  ActionsType,
  BookmarksActionAdd,
  BookmarksActionDelete,
  BookmarksActionSet,
} from "./types";

const bookmarksFetchAction = (
  props: BookmarkType[],
): BookmarksActionFetch => ({
  type: ActionsType.BOOKMARKS_FETCH,
  payload: props,
});

const bookmarksAddAction = (bookmark: BookmarkType): BookmarksActionAdd => ({
  type: ActionsType.BOOKMARKS_ADD,
  payload: bookmark,
});

const bookmarksDeleteAction = (id: string): BookmarksActionDelete => ({
  type: ActionsType.BOOKMARKS_DELETE,
  payload: { id },
});

const bookmarksSetAction = ({
  id,
  iframe,
}: { id: string, iframe?: string }): BookmarksActionSet => ({
  type: ActionsType.BOOKMARKS_SET,
  payload: { id, iframe },
});

export {
  bookmarksFetchAction,
  bookmarksAddAction,
  bookmarksDeleteAction,
  bookmarksSetAction,
};
