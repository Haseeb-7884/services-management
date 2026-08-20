import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const articleSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    excerpt: { type: String, default: "", maxlength: 300 },
    body: { type: String, required: true, maxlength: 20000 },
    coverImageUrl: { type: String, default: "" },
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

articleSchema.index({ title: "text", excerpt: "text", body: "text", tags: "text" });

export type ArticleDocument = InferSchemaType<typeof articleSchema>;
export const Article: Model<ArticleDocument> =
  (models.Article as Model<ArticleDocument>) ?? model<ArticleDocument>("Article", articleSchema);
