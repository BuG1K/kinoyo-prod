"use server";

import { onGetRecommendationFilms } from "@/actions";
import onGetTopFilms from "./onGetTopFilms";
import onGetPopularFilms from "./onGetPopularFilms";
import { FilmType, OnGetFilmCollectionsResponse } from "@/types";

const onGetFilmCollections = async () => {
  const result: OnGetFilmCollectionsResponse = {
    data: null,
    error: true,
    message: "",
  };
  const data: { [name: string]: FilmType[] } = {};
  const collections = [
    { name: "popular", action: onGetPopularFilms },
    { name: "top - 20", action: onGetTopFilms },
    { name: "recommendation", action: onGetRecommendationFilms },
  ];

  await Promise.all(collections.map(async ({ name, action }) => {
    const res = await action();

    if (res.data && !res.error) {
      data[name] = res.data;
    }
  }));

  if (!Object.keys(data).length) {
    return result;
  }

  result.data = data;
  result.error = false;

  return result;
};

export default onGetFilmCollections;
