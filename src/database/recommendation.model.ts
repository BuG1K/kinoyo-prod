import {
  Model,
  Schema,
  models,
  model,
} from "mongoose";
import { RecommendationModel } from "@/types";

const recommendationModel = () => {
  const schema = new Schema<RecommendationModel>({
    userId: { type: String, required: true },
    knIds: [{ type: Number }],
  }, {
    timestamps: true,
  });

  return (
    models.Recommendation || model("Recommendation", schema)
  ) as Model<RecommendationModel>;
};

const Recommendation = recommendationModel();

export default Recommendation;
