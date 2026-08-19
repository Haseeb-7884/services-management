import { Schema, model, type InferSchemaType, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { ALL_ROLES, ROLES } from "../constants/roles.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_.]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.STANDARD,
    },
    // Set when a Super Admin/Owner promotes this user into one of the 5
    // Admin slots (or promotes an Admin to Super Admin), so revoking that
    // slot later restores exactly what they were before instead of
    // guessing a fallback role. Cleared once restored.
    previousRole: {
      type: String,
      enum: ALL_ROLES,
      default: null,
    },
    profile: {
      displayName: { type: String, trim: true, maxlength: 60 },
      avatarUrl: { type: String, default: "" },
      coverUrl: { type: String, default: "" },
      bio: { type: String, maxlength: 300, default: "" },
      tagline: { type: String, maxlength: 100, default: "" },
      category: { type: String, maxlength: 40, default: "" },
      socialLinks: {
        website: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        youtube: { type: String, default: "" },
      },
    },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    twoFactor: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, select: false },
    },

    subscriptionPlan: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", default: null },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    refreshTokenVersion: { type: Number, default: 0 }, // bump to invalidate all refresh tokens
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  },
});

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Schema.Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
};

export const User: Model<UserDocument> = model<UserDocument>("User", userSchema);
