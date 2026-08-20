import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["Video", "Image", "Article"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    body: { type: String, required: true, maxlength: 1000 },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

export type CommentDocument = InferSchemaType<typeof commentSchema>;
export const Comment: Model<CommentDocument> =
  (models.Comment as Model<CommentDocument>) ?? model<CommentDocument>("Comment", commentSchema);
