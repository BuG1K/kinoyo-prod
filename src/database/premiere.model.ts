import {
  Model,
  Schema,
  models,
  model,
} from "mongoose";
import { FilmTypesEnum, PremiereModel } from "@/types";

const premiereModel = () => {
  const schema = new Schema<PremiereModel>({
    knId: { type: Number, required: true, unique: true },
    lastUpdated: { type: Date, required: true },
    lastFetch: { type: Date, required: true },
    type: { type: String, enum: FilmTypesEnum, required: true },
    episodesLastSeason: { type: Number, required: false },
    episodesLastEpisode: { type: Number, required: false },
    episodesLastDate: { type: String, required: false },
    episodesNextSeason: { type: Number, required: false },
    episodesNextEpisode: { type: Number, required: false },
    episodesNextDate: { type: String, required: false },
    premier: { type: String, required: false },
  }, {
    timestamps: true,
  });

  return (
    models.Premiere || model("Premiere", schema)
  ) as Model<PremiereModel>;
};

const Premiere = premiereModel();

export default Premiere;
