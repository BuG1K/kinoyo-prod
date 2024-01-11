import {
  Model,
  Schema,
  models,
  model,
} from "mongoose";
import { FilmModel, FilmTypesEnum } from "@/types";

const filmModel = () => {
  const schema = new Schema<FilmModel>({
    knId: { type: Number, required: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    ratingKn: { type: Number, required: true },
    ratingImdb: { type: Number, required: true },
    posterUrlPreview: { type: String, required: false },
    type: { type: String, enum: FilmTypesEnum, required: true },
  }, {
    timestamps: true,
  });

  return (models.Film || model("Film", schema)) as Model<FilmModel>;
};

const Film = filmModel();

export default Film;
