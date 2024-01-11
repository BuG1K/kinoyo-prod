"use server";

import { validURL } from "@/resources";
import { FilmTypesEnum, OnSearchFilmsResponse } from "@/types";

interface ResponseKinopoiskiFilmById {
  id: number
  name: string
  year: number
  rating: {
    imdb: number
    kp: number
  }
  poster: {
    previewUrl: string | null
  }
  type: "movie" | "tv-series"
}

interface ResponseKinopoiskiByName {
  docs: ResponseKinopoiskiFilmById[]
}

const kinopoisApiUrl = process.env.KINOPOISK_API_V1_URL || "";
const requestInit: RequestInit = {
  method: "GET",
  headers: {
    "X-API-KEY": process.env.KINOPOISK_API_V1_TOKEN || "",
    "Content-Type": "application/json",
  },
};

const onSearchFilms = async (value: string) => {
  const isUrl = validURL(value);
  const isKnId = /^\d+$/.test(value);
  const name = !isUrl && !isKnId ? value : null;
  const knId = isUrl ? value.split("/")[4] : value;
  const result: OnSearchFilmsResponse = {
    data: null,
    error: false,
    message: "",
  };

  const toFixed = (num: number) => Number(num.toFixed(1));

  if (name) {
    const params = `/movie/search?page=1&limit=5&query=${name}`;
    const respons = await fetch(kinopoisApiUrl + params, requestInit);
    const data = await respons.json() as ResponseKinopoiskiByName;

    if (respons.status !== 200 || data?.docs.length === 0) {
      result.error = true;
      result.message = `Movie by name: ${name} not found`;

      return result;
    }

    result.data = data.docs.map((item) => ({
      knId: item.id,
      name: item.name,
      year: item.year,
      ratingImdb: toFixed(item.rating.imdb),
      ratingKn: toFixed(item.rating.kp),
      posterUrlPreview: item.poster.previewUrl,
      type: item.type === "movie" ? FilmTypesEnum.film : FilmTypesEnum.series,
    }));

    return result;
  }

  const params = `/movie/${knId}`;
  const respons = await fetch(kinopoisApiUrl + params, requestInit);

  if (respons.status !== 200) {
    result.error = true;
    result.message = `Film by id: ${knId} not found`;
  }

  const data = await respons.json() as ResponseKinopoiskiFilmById;

  result.data = [{
    knId: data.id,
    name: data.name,
    year: data.year,
    ratingImdb: toFixed(data.rating.imdb),
    ratingKn: toFixed(data.rating.kp),
    posterUrlPreview: data.poster.previewUrl,
    type: data.type === "movie" ? FilmTypesEnum.film : FilmTypesEnum.series,
  }];

  return result;
};

export default onSearchFilms;
