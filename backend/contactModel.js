const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // just define type
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact", contactSchema);
