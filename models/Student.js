const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordChangeRequired: { type: Boolean, default: true }, // On login for first time, student has to set new password
  dob: { type: Date, required: true },
  contactDetails: { type: String, required: true },
  feesPaid: { type: Boolean, default: false },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
});

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Student", StudentSchema);
