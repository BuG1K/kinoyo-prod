"use server";

import { OnGetSimilarFilmsResponse } from "@/types";

interface DataKinopoiskSimilarsFilms {
  items: {
    filmId: number
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

const onGetSimilarFilms = async (knId: number) => {
  const result: OnGetSimilarFilmsResponse = {
    data: null,
    error: true,
    message: "",
  };
  const params = `/films/${knId}/similars`;
  const respons = await fetch(kinopoisApiUrl + params, requestInit);

  if (respons.status !== 200) {
    return result;
  }

  const data = await respons.json() as DataKinopoiskSimilarsFilms;

  if (!data.items.length) {
    return result;
  }

  result.error = false;
  result.data = data.items.map(({ filmId }) => filmId);

  return result;
};

export default onGetSimilarFilms;
