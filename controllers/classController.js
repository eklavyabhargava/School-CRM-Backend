const Class = require("../models/Class");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("teacher").populate("students");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssignedClass = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized!" });

  try {
    if (user.role === "teacher") {
      const teacher = await Teacher.findById(user._id);
      if (teacher.assignedClass) {
        const assignedClass = await Class.findById(
          teacher.assignedClass
        ).populate("students");
        assignedClass.teacher = teacher;

        return res.status(200).json(assignedClass);
      } else {
        return res
          .status(200)
          .json({ message: "There is no assigned classes yet!" });
      }
    } else if (user.role === "student") {
      const student = await Student.findById(user._id);
      const assignedClass = await Class.findById(student.assignedClass);

      return res.status(200).json(assignedClass);
    } else {
      return res.status(400).json({ error: "Bad Request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
