const express = require("express");
const { getAssignedClass } = require("../controllers/classController");
const {
  getTeacher,
  updateTeacher,
} = require("../controllers/teacherController");
const { loginTeacher } = require("../controllers/authController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const router = express.Router();

// api to login teacher
router.post("/login", loginTeacher);

router.use(authenticateSession);

router.get("/classes", getAssignedClass);
router.get("/profile/:id", getTeacher);
router.put("/update-profile/:id", updateTeacher);

module.exports = router;
