import {
  Model,
  Schema,
  models,
  model,
} from "mongoose";
import { BookmarkModel } from "@/types";

const bookmarkModel = () => {
  const schema = new Schema<BookmarkModel>({
    userId: { type: String, required: true },
    knId: { type: Number, required: true },
    name: { type: String, required: true },
    iframe: { type: String, required: true },
  }, {
    timestamps: true,
  });

  return (
    models.Bookmark || model("Bookmark", schema)
  ) as Model<BookmarkModel>;
};

const Bookmark = bookmarkModel();

export default Bookmark;
