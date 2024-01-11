/* eslint-disable no-underscore-dangle */

"use server";

import { Bookmark, Premiere } from "@/database";
import { ActionResult } from "@/types";

const onDeletePremiere = async (knId: number) => {
  const result: ActionResult<null> = {
    data: null,
    error: true,
    message: "",
  };

  const findPremiere = await Premiere.findOne({ knId });

  if (!findPremiere) {
    return result;
  }

  const findBookmarks = await Bookmark.find({ knId });

  if (findBookmarks.length <= 1) {
    await Premiere.deleteOne({ _id: findPremiere._id });
  }

  result.error = false;

  return result;
};

export default onDeletePremiere;
