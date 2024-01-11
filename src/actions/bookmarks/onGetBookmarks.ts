/* eslint-disable no-underscore-dangle */

"use server";

import { cookies } from "next/headers";
import { Bookmark } from "@/database";
import { onGetPremieres } from "@/actions";
import { verifyJwtToken } from "@/resources";
import { OnGetBookmarksResponse, PremiereType } from "@/types";

const onGetBookmarks = async () => {
  const result: OnGetBookmarksResponse = {
    data: null,
    error: true,
    message: "",
  };

  const { value: token } = cookies().get("token") || { value: null };
  const currentUser = (
    token && (await verifyJwtToken(token))
  ) as { id?: string };
  const userId = currentUser?.id || null;

  if (userId) {
    const bookmarks = await Bookmark.find({ userId });

    if (bookmarks) {
      const premieresResponse = await onGetPremieres(
        bookmarks.map(({ knId }) => knId),
      );

      result.data = bookmarks.map((item) => {
        let premiere: PremiereType | undefined;

        if (!premieresResponse.error && premieresResponse.data) {
          premiere = premieresResponse.data.find(
            (el) => el.knId === item.knId,
          );
        }

        return {
          id: item._id.toHexString(),
          knId: item.knId,
          name: item.name,
          iframe: item.iframe,
          premiere,
        };
      });

      result.error = false;
    }
  }

  return result;
};

export default onGetBookmarks;
