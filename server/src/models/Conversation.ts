import { Schema, model, type InferSchemaType, type Model } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: {
        validator: (arr: unknown[]) => arr.length === 2,
        message: "A conversation must have exactly 2 participants",
      },
    },
    lastMessage: {
      body: { type: String, default: "" },
      sender: { type: Schema.Types.ObjectId, ref: "User", default: null },
      sentAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

export type ConversationDocument = InferSchemaType<typeof conversationSchema>;
export const Conversation: Model<ConversationDocument> = model<ConversationDocument>(
  "Conversation",
  conversationSchema
);
