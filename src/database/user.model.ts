import {
  Model,
  Schema,
  model,
  models,
} from "mongoose";
import { UserModel } from "@/types";

const userModel = () => {
  const schema = new Schema<UserModel>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    lastCheckNotifications: { type: Date, require: true },
    password: { type: String, required: true },
    hash: { type: String, required: false },
  }, {
    timestamps: true,
  });

  return (models.User || model("User", schema)) as Model<UserModel>;
};

const User = userModel();

export default User;
