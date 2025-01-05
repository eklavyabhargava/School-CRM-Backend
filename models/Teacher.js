const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  phoneNumber: { type: Number, required: true },
  password: { type: String, required: true },
  passwordChangeRequired: { type: Boolean, default: true }, // On loggin for first time, teacher have to set new password
  salary: { type: Number, required: true },
  assignedClass: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
});

TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Teacher", TeacherSchema);
