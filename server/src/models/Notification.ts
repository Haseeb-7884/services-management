import { Schema, model, type InferSchemaType, type Model } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["follow", "like", "comment"], required: true },
    targetType: { type: String, enum: ["Video", "Image", "Article", "Comment"], default: null },
    targetId: { type: Schema.Types.ObjectId, default: null },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;
export const Notification: Model<NotificationDocument> = model<NotificationDocument>(
  "Notification",
  notificationSchema
);
