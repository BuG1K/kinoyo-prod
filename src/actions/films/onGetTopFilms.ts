"use server";

import { onGetRedis } from "@/database";
import { FilmType, FilmTypesEnum, OnGetTopFilmsResponse } from "@/types";

interface Film {
  kinopoiskId: number
  nameRu: string
  ratingKinopoisk: number
  ratingImdb: number
  posterUrlPreview: string | null
  year: number
  type: "FILM" | "TV_SERIES"
}

interface Collections {
  [type: string]: FilmType[]
}

interface ResponseCollectionsByType {
  items: Film[]
}

const kinopoisApiUrl = process.env.KINOPOISK_API_V2_URL || "";
const requestInit: RequestInit = {
  method: "GET",
  headers: {
    "X-API-KEY": process.env.KINOPOISK_API_V2_TOKEN || "",
    "Content-Type": "application/json",
  },
};

const onGetTopFilms = async () => {
  const result: OnGetTopFilmsResponse = {
    data: null,
    error: true,
    message: "",
  };

  const data = await onGetRedis("topFilms", 180, async () => {
    const types = ["TOP_250_TV_SHOWS", "TOP_250_MOVIES"];
    const collections: Collections = {
      [types[0]]: [],
      [types[1]]: [],
    };

    await Promise.all(types.map(async (type) => {
      const params = `/films/collections?type=${type}&page=1`;
      const respons = await fetch(kinopoisApiUrl + params, requestInit);

      try {
        const films = await respons.json() as ResponseCollectionsByType;

        collections[type] = films.items.slice(0, 10).map((film) => ({
          knId: film.kinopoiskId,
          name: film.nameRu,
          year: film.year,
          ratingKn: film.ratingKinopoisk,
          ratingImdb: film.ratingImdb,
          posterUrlPreview: film.posterUrlPreview,
          type: film.type === "FILM"
            ? FilmTypesEnum.film : FilmTypesEnum.series,
        }));
      } catch {
        return null;
      }

      return null;
    }));

    const films = Object.entries(collections)
      .reduce<FilmType[]>((res, [, items], index) => {
        items.forEach((film, filmIndex) => {
          res[index + filmIndex * 2] = film;
        });

        return res;
      }, []);

    if (!films.length) {
      return null;
    }

    return films;
  });

  if (!data) {
    return result;
  }

  result.data = data;
  result.error = false;

  return result;
};

export default onGetTopFilms;
