"use server";

import { cookies } from "next/headers";
import { Bookmark } from "@/database";
import { verifyJwtToken } from "@/resources";
import { ActionResult } from "@/types";
import { onDeletePremiere } from "..";

const onDeleteBookmark = async (bookmarkId: string) => {
  const result: ActionResult<null> = {
    data: null,
    error: true,
    message: "",
  };

  const { value: token } = cookies().get("token") || { value: null };
  const currentUser = (
    token && (await verifyJwtToken(token))
  ) as { id?: string };
  const userId = currentUser?.id || null;

  if (!userId) {
    return result;
  }

  const findBookmark = await Bookmark.findById({ _id: bookmarkId });

  if (!findBookmark) {
    return result;
  }

  onDeletePremiere(findBookmark.knId);
  const { deletedCount } = await Bookmark.deleteOne({ _id: bookmarkId });

  if (deletedCount !== 0) {
    result.error = false;
  }

  return result;
};

export default onDeleteBookmark;
