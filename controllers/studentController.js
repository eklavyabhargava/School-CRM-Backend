const Student = require("../models/Student");
const {
  generateUniqueUsername,
  generateRandomPassword,
} = require("./authController");

exports.createStudent = async (req, res) => {
  try {
    req.body.username = await generateUniqueUsername(req.body.name);
    req.body.password = generateRandomPassword();
    console.log(req.body.password);
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("class").select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("class")
      .select("-password");
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  const user = req.user;
  try {
    if (user.role === "admin" || user._id === req.params.id) {
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate("class");
      res.status(200).json(updatedStudent);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
