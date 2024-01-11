"use server";

import { onGetRedis } from "@/database";
import { FilmTypesEnum, OnGetPopularFilmsResponse } from "@/types";

interface ResponseCollectionsByType {
  items: {
    kinopoiskId: number
    nameRu: string
    ratingKinopoisk: number
    ratingImdb: number
    posterUrlPreview: string | null
    year: number
    type: "FILM" | "TV_SERIES"
  }[]
}

const kinopoisApiUrl = process.env.KINOPOISK_API_V2_URL || "";
const requestInit: RequestInit = {
  method: "GET",
  headers: {
    "X-API-KEY": process.env.KINOPOISK_API_V2_TOKEN || "",
    "Content-Type": "application/json",
  },
};

const onGetPopularFilms = async () => {
  const result: OnGetPopularFilmsResponse = {
    data: null,
    error: true,
    message: "",
  };

  const data = await onGetRedis("popularFilms", 7, async () => {
    const params = "/films/collections?type=TOP_POPULAR_ALL&page=1";
    const respons = await fetch(kinopoisApiUrl + params, requestInit);

    if (respons.status !== 200) {
      return null;
    }

    const res = await respons.json() as ResponseCollectionsByType;

    return res;
  });

  if (!data) {
    return result;
  }

  result.error = false;
  result.data = data.items.map((film) => ({
    knId: film.kinopoiskId,
    name: film.nameRu,
    year: film.year,
    ratingKn: film.ratingKinopoisk,
    ratingImdb: film.ratingImdb,
    posterUrlPreview: film.posterUrlPreview,
    type: film.type === "FILM" ? FilmTypesEnum.film : FilmTypesEnum.series,
  }));

  return result;
};

export default onGetPopularFilms;
