import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

export type FollowDocument = InferSchemaType<typeof followSchema>;
export const Follow: Model<FollowDocument> =
  (models.Follow as Model<FollowDocument>) ?? model<FollowDocument>("Follow", followSchema);
