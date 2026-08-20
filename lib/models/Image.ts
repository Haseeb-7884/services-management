import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const imageSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caption: { type: String, default: "", maxlength: 500 },
    url: { type: String, required: true },
    category: { type: String, default: "general", index: true },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },
    moderationNote: { type: String, default: "" },
  },
  { timestamps: true }
);

imageSchema.index({ caption: "text", tags: "text" });

export type ImageDocument = InferSchemaType<typeof imageSchema>;
export const Image: Model<ImageDocument> =
  (models.Image as Model<ImageDocument>) ?? model<ImageDocument>("Image", imageSchema);
