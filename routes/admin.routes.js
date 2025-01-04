const express = require("express");
const router = express.Router();
const {
  getClassAnalytics,
  getFinancialAnalytics,
} = require("../controllers/adminController");
const { loginAdmin, registerAdmin } = require("../controllers/authController");
const {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const {
  authorizeRoles,
  authenticateSession,
} = require("../middlewares/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.use(authenticateSession);
router.use(authorizeRoles("admin"));

// Class routes
router.get("/classes", getAllClasses);
router.post("/classes", createClass);
router.put("/classes/:id", updateClass);
router.delete("/classes/:id", deleteClass);

// Student routes
router.get("/students", getStudents);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// Teacher routes
router.get("/teachers", getTeachers);
router.post("/teachers", createTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);

// Analytics routes
router.get("/class-analytics/:id", getClassAnalytics);
router.get("/financial-analytics", getFinancialAnalytics);

module.exports = router;
