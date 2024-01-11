/* eslint-disable no-underscore-dangle */

"use server";

import { cookies } from "next/headers";
import { Bookmark } from "@/database";
import { onAddPremiere, onSetRecommendation } from "@/actions";
import { verifyJwtToken } from "@/resources";
import { OnAddBookmarkResponse } from "@/types";

const onAddBookmark = async ({
  knId,
  iframe,
  name,
}: { knId: number, iframe: string, name: string }) => {
  const result: OnAddBookmarkResponse = {
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

  const findBookmark = await Bookmark.findOne({ userId, knId });

  if (findBookmark) {
    return result;
  }

  const newBookmark = await new Bookmark({
    userId,
    knId,
    name,
    iframe,
  });

  await newBookmark.save();

  const premiere = await onAddPremiere(knId);
  onSetRecommendation(knId);

  result.data = {
    id: newBookmark._id.toHexString(),
    knId: newBookmark.knId,
    name: newBookmark.name,
    iframe: newBookmark.iframe,
    premiere: premiere.data || undefined,
  };
  result.error = false;

  return result;
};

export default onAddBookmark;
