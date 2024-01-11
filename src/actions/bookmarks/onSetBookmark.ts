"use server";

import { Bookmark } from "@/database";
import { ActionResult } from "@/types";

const onSetBookmark = async (props: { id: string, iframe?: string }) => {
  const { id, iframe } = props;
  const result: ActionResult<null> = {
    data: null,
    error: true,
    message: "",
  };

  const bookmark = await Bookmark.findById(id);

  if (!bookmark) {
    return result;
  }

  if (iframe) {
    bookmark.iframe = iframe;
  }

  await bookmark.save();
  result.error = false;

  return result;
};

export default onSetBookmark;
