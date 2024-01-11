"use server";

import { FilmType } from "@/types";
import { Film } from "@/database";

const onAddFilm = async (film: FilmType) => {
  const result = {
    data: null,
    error: true,
    message: "",
  };

  const findFilm = await Film.findOne({ knId: film.knId });

  if (findFilm) {
    return result;
  }

  const newFilm = new Film(film);

  newFilm.save();
  result.error = false;

  return result;
};

export default onAddFilm;
