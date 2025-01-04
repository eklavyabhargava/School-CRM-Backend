const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// Generate Refresh Token
function generateRefreshToken(id) {
  if (!id) return null;
  return jwt.sign({ id }, JWT_SECRET_KEY);
}

module.exports = {
  // Generate unique username
  async generateUniqueUsername(name) {
    let baseUsername = name.toLowerCase().replace(/\s+/g, "");
    let username = baseUsername;
    let count = 1;
    while (await Student.findOne({ username })) {
      username = `${baseUsername}${count}`;
      count++;
    }
    return username;
  },

  // Generate password
  generateRandomPassword(length = 8) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },

  // Register new admin
  async registerAdmin(req, res) {
    const { username, password, role } = req.body;

    try {
      const userFound = await Admin.findOne({ username });
      if (userFound) {
        return res
          .status(400)
          .json({ isSuccess: false, message: "User already exists!" });
      }

      // Hash password before adding new admin
      const hashedPassword = await bcryptjs.hash(password, 16);

      const newAdmin = new Admin({
        username,
        password: hashedPassword,
        role: role || "Admin",
      });

      const admin = newAdmin.save();
      return res.status(201).json({ isSuccess: true, admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ isSuccess: false, message: "Internal Error" });
    }
  },
  // Handle admin login
  async loginAdmin(req, res) {
    const { username, password } = req.body;

    try {
      const admin = await Admin.findOne({ username });

      if (admin) {
        // compare password
        const didMatch = await bcryptjs.compare(password, admin.password);

        if (didMatch) {
          const jwtToken = generateRefreshToken(admin._id);
          if (!jwtToken) {
            return res.status(400).json({
              isSuccess: false,
              message: "Cannot generate authorization token",
            });
          }

          const { password, ...adminData } = admin; // Remove password from response

          // store Admin data and jwt token in session
          req.session.admin = adminData;
          req.session.adminAuthToken = jwtToken;

          return res.status(200).json({
            isSuccess: true,
            message: "Logged in successfully",
            admin: adminData,
          });
        }
      } else {
        return res
          .status(401)
          .json({ isSuccess: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ isSuccess: false, message: "Internal Error" });
    }
  },
  // Handle student login
  async loginStudent(req, res) {
    const { username, password } = req.body;

    try {
      const student = await Student.findOne({ username });

      if (student) {
        // compare password
        const didMatch = await bcryptjs.compare(password, student.password);

        if (didMatch) {
          const jwtToken = generateRefreshToken(student._id);
          if (!jwtToken) {
            return res.status(400).json({
              isSuccess: false,
              message: "Cannot generate authorization token",
            });
          }

          const { password, ...studentData } = student; // Remove password from response

          // store Admin data and jwt token in session
          req.session.student = studentData;
          req.session.studentAuthToken = jwtToken;

          if (student.passwordChangeRequired) {
            return res.status(200).json({
              isSuccess: true,
              student: studentData,
              message: "Password Change Required",
              redirectTo: "/set-new-password",
            });
          }

          return res.status(200).json({
            isSuccess: true,
            message: "Logged in successfully",
            student: studentData,
          });
        }
      } else {
        return res
          .status(401)
          .json({ isSuccess: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ isSuccess: false, message: "Internal Error" });
    }
  },
  // Handle Teacher Login
  async loginTeacher(req, res) {
    const { username, password } = req.body;

    try {
      const teacher = await Teacher.findOne({ username });

      if (teacher) {
        // compare password
        const didMatch = await bcryptjs.compare(password, teacher.password);

        if (didMatch) {
          const jwtToken = generateRefreshToken(teacher._id);
          if (!jwtToken) {
            return res.status(400).json({
              isSuccess: false,
              message: "Cannot generate authorization token",
            });
          }

          const { password, ...teacherData } = teacher; // Remove password from response

          // store teacher data and jwt token in session
          req.session.teacher = teacherData;
          req.session.teacherAuthToken = jwtToken;

          if (teacher.passwordChangeRequired) {
            return res.status(200).json({
              isSuccess: true,
              teacher: teacherData,
              message: "Password Change Required",
              redirectTo: "/set-new-password",
            });
          }

          return res.status(200).json({
            isSuccess: true,
            message: "Logged in successfully",
            teacher: teacherData,
          });
        }
      } else {
        return res
          .status(401)
          .json({ isSuccess: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ isSuccess: false, message: "Internal Error" });
    }
  },
};
