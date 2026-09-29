import mongoose from "mongoose";

const WaitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please use a Valid Email Address"],
    },
  },
  { timestamps: true }
);

const WaitlistModel = mongoose.model("Waitlist", WaitlistSchema);
export default WaitlistModel;
