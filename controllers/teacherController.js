const Teacher = require("../models/Teacher");
const {
  generateUniqueUsername,
  generateRandomPassword,
} = require("./authController");
const mailer = require("../config/emailConfig");

exports.createTeacher = async (req, res) => {
  try {
    req.body.username = await generateUniqueUsername(req.body.name);
    req.body.password = generateRandomPassword();
    const newTeacher = await Teacher.create(req.body);
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Your Account Credentials",
      text: `Hello ${req.body.name},\n\nYour account has been created successfully!\n\nUsername: ${username}\nPassword: ${req.body.password}\n\nPlease log in and change your password after your first login.\n\nBest regards`,
    };

    await mailer.sendMail(mailOptions);
    res.status(201).json(newTeacher);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("assignedClass")
      .select("-password");
    res.status(200).json(teachers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("assignedClass")
      .select("-password");
    res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  const user = req.user;

  try {
    if (user.role === "admin" || user._id === req.params.id) {
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedTeacher);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
