const express = require("express");
const app = express();

// admin routes
app.use("/admin", require("./admin.routes"));

// teacher routes
app.use("/teacher", require("./teacher.routes"));

// student routes
app.use("/student", require("./student.routes"));

app.get("/logout", async (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res
          .status(500)
          .json({ isSuccess: false, message: "Could not log out" });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({
        isSuccess: true,
        message: "Logout successful",
      });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
});

module.exports = app;
