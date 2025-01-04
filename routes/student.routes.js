const express = require("express");
const { getAssignedClass } = require("../controllers/classController");
const {
  getStudent,
  updateStudent,
} = require("../controllers/studentController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const { loginStudent } = require("../controllers/authController");
const router = express.Router();

// api to login students
router.post("/login", loginStudent);

router.use(authenticateSession);

router.get("/classes", getAssignedClass);
router.get("/profile/:id", getStudent);
router.put("/update-profile/:id", updateStudent);

module.exports = router;
