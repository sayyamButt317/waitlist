import WishModel from "../Model/Wish.js";

export const MAX_SLOTS = 5;
const MAX_TEXT = 500;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // keeps requests under Vercel's 4.5 MB body limit
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DATA_URL = /^data:(image\/[a-z+.-]+);base64,([A-Za-z0-9+/=\s]+)$/;

const parseSlot = (value) => {
  const slot = Number(value);
  return Number.isInteger(slot) && slot >= 1 && slot <= MAX_SLOTS ? slot : null;
};

const toPublic = (req, wish) => ({
  slot: wish.slot,
  text: wish.text,
  imageUrl: wish.image?.contentType
    ? `${req.protocol}://${req.get("host")}/api/wishes/${wish.slot}/image?v=${wish.updatedAt.getTime()}`
    : null,
  updatedAt: wish.updatedAt,
});

const allWishes = async (req) => {
  const wishes = await WishModel.find().sort({ slot: 1 });
  return wishes.map((w) => toPublic(req, w));
};

// GET /api/wishes
export const listWishes = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    res.status(200).json({ success: true, wishes: await allWishes(req) });
  } catch (error) {
    console.error("List wishes error:", error);
    res.status(500).json({ success: false, message: "Couldn’t load wishes right now" });
  }
};

// PUT /api/wishes/:slot   body: { text, image?: "data:image/...;base64,...", removeImage?: true }
// Empty text + no picture clears the wish.
export const saveWish = async (req, res) => {
  try {
    const slot = parseSlot(req.params.slot);
    if (!slot) {
      return res.status(400).json({ success: false, message: "Invalid wish number" });
    }

    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (text.length > MAX_TEXT) {
      return res
        .status(400)
        .json({ success: false, message: `Please keep a wish under ${MAX_TEXT} characters` });
    }

    let newImage = null;
    if (req.body?.image) {
      const match = typeof req.body.image === "string" && req.body.image.match(DATA_URL);
      if (!match || !IMAGE_TYPES.includes(match[1])) {
        return res
          .status(400)
          .json({ success: false, message: "Please use a JPG, PNG, WEBP or GIF picture" });
      }
      const data = Buffer.from(match[2], "base64");
      if (data.length === 0 || data.length > MAX_IMAGE_BYTES) {
        return res
          .status(400)
          .json({ success: false, message: "That picture is too big (max 3 MB)" });
      }
      newImage = { data, contentType: match[1] };
    }

    const existing = await WishModel.findOne({ slot });
    const removeImage = req.body?.removeImage === true;
    const keepsImage = !removeImage && !!existing?.image?.contentType;

    if (!text && !newImage && !keepsImage) {
      await WishModel.deleteOne({ slot }); // wish cleared
    } else {
      const update = { $set: { text } };
      if (newImage) update.$set.image = newImage;
      else if (removeImage) update.$unset = { image: 1 };
      await WishModel.findOneAndUpdate({ slot }, update, {
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }

    res.status(200).json({ success: true, wishes: await allWishes(req) });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("Save wish error:", error);
    res.status(500).json({ success: false, message: "Couldn’t save right now — please try again" });
  }
};

// GET /api/wishes/:slot/image
export const getWishImage = async (req, res) => {
  try {
    const slot = parseSlot(req.params.slot);
    if (!slot) return res.status(404).send("Not found");

    const wish = await WishModel.findOne({ slot }).select("+image.data image.contentType");
    if (!wish?.image?.data || !wish.image.contentType) return res.status(404).send("Not found");

    res.set({
      "Content-Type": wish.image.contentType,
      // URL includes ?v=<updatedAt>, so a changed picture always gets a new URL.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    res.send(wish.image.data);
  } catch (error) {
    console.error("Wish image error:", error);
    res.status(500).send("Error");
  }
};
