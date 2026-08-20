import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const videoSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: "", maxlength: 5000 },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    durationSec: { type: Number, default: 0 },
    isShort: { type: Boolean, default: false, index: true },
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

videoSchema.index({ title: "text", description: "text", tags: "text" });

export type VideoDocument = InferSchemaType<typeof videoSchema>;
export const Video: Model<VideoDocument> =
  (models.Video as Model<VideoDocument>) ?? model<VideoDocument>("Video", videoSchema);
