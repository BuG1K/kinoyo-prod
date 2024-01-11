import {
  Model,
  Schema,
  models,
  model,
} from "mongoose";
import { UserAnalyticsModel } from "@/types";

const userAnalyticsModel = () => {
  const schema = new Schema<UserAnalyticsModel>({
    userId: { type: String, required: true, unique: true },
    lastLogin: { type: Date, required: true },
    lastSity: { type: String, required: false },
    films: { type: Map, of: Number },
  }, {
    timestamps: true,
  });

  return (
    models.UserAnalytics || model("UserAnalytics", schema)
  ) as Model<UserAnalyticsModel>;
};

const UserAnalytics = userAnalyticsModel();

export default UserAnalytics;
