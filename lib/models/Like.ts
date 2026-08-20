import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["Video", "Image", "Article"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export type LikeDocument = InferSchemaType<typeof likeSchema>;
export const Like: Model<LikeDocument> =
  (models.Like as Model<LikeDocument>) ?? model<LikeDocument>("Like", likeSchema);
