"use server";

import { cookies } from "next/headers";
import { verifyJwtToken } from "@/resources";
import { Bookmark, Film, Recommendation } from "@/database";
import { onAddFilm, onGetSimilarFilms, onSearchFilms } from "@/actions";

const onSetRecommendation = async (knId: number) => {
  const result = {
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

  let knIds: number[] = [];

  const findRecommendation = await Recommendation.findOne({ userId });
  if (findRecommendation) {
    knIds = findRecommendation.knIds;
  }

  const similarsFilmsResponse = await onGetSimilarFilms(knId);
  if (!similarsFilmsResponse.data) {
    return result;
  }

  const maxSimilarsFilms = similarsFilmsResponse.data.slice(0, 3);
  let count = 0;

  await Promise.all(maxSimilarsFilms.map(async (item) => {
    const bookmark = await Bookmark.findOne({ userId, knId: item });

    if (bookmark || count >= 3 || knIds.includes(item)) {
      return null;
    }

    const findFilm = await Film.findOne({ knId: item });

    if (!findFilm) {
      const searchFilmsResponse = await onSearchFilms(String(item));

      if (!(searchFilmsResponse.data?.length)) {
        return null;
      }

      const onAddFilmResponse = await onAddFilm(searchFilmsResponse.data[0]);
      if (onAddFilmResponse.error) {
        return null;
      }
    }

    count += 1;
    knIds = [item, ...knIds];

    return null;
  }));

  const maxKnIds = knIds.slice(0, 20);

  if (findRecommendation) {
    findRecommendation.knIds = maxKnIds.filter((item) => item !== knId);
    findRecommendation.save();
  } else {
    const newRecommendation = new Recommendation({ userId, knIds: maxKnIds });
    newRecommendation.save();
  }

  result.error = false;

  return result;
};

export default onSetRecommendation;
