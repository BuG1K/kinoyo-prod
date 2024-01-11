"use server";

import { cookies } from "next/headers";
import { Film, Recommendation } from "@/database";
import { verifyJwtToken } from "@/resources";
import { OnGetRecommendationFilmsResponse } from "@/types";

const onGetRecommendationFilms = async () => {
  const result: OnGetRecommendationFilmsResponse = {
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

  const findRecommendation = await Recommendation.findOne({ userId });
  if (!findRecommendation) {
    return result;
  }

  const findFilms = await Film.find({
    knId: { $in: findRecommendation.knIds },
  });
  if (!findFilms.length) {
    return result;
  }

  const films = findFilms.map((film) => ({
    knId: film.knId,
    name: film.name,
    year: film.year,
    ratingKn: film.ratingKn,
    ratingImdb: film.ratingImdb,
    posterUrlPreview: film.posterUrlPreview,
    type: film.type,
  }));

  const sortFilmsByratingKn = films.sort((filmA, filmB) => {
    if (filmA.ratingKn && filmB.ratingKn) {
      return filmB.ratingKn - filmA.ratingKn;
    }

    return 0;
  });

  result.error = false;
  result.data = sortFilmsByratingKn;

  return result;
};

export default onGetRecommendationFilms;
