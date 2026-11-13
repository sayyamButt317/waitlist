import mongoose from "mongoose";
const WishSchema = new mongoose.Schema(
  {
    slot: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      trim: true,
      maxlength: [500, "Please keep a wish under 500 characters"],
      default: "",
    },
    image: {
      data: { type: Buffer, select: false },
      contentType: { type: String },
    },
  },
  { timestamps: true }
);

const WishModel = mongoose.model("Wish", WishSchema);
export default WishModel;
