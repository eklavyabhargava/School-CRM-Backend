exports.authenticateSession = (req, res, next) => {
  if (req.session.admin) {
    req.user = req.session.admin;
    req.user.role = "admin";
    return next();
  }
  if (req.session.student) {
    req.user = req.session.student;
    req.user.role = "student";
    return next();
  }
  if (req.session.teacher) {
    req.user = req.session.teacher;
    req.user.role = "teacher";
    return next();
  }
  return res.status(401).json({ isSuccess: false, message: "Unauthorized" });
};

exports.authorizeRoles = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ isSuccess: false, message: "Access denied" });
  }
  next();
};
