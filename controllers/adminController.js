const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

// Get class analytics
exports.getClassAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await Class.findById(id)
      .populate("teacher", "name")
      .populate("students", "name gender");

    if (!classData) return res.status(404).json({ message: "Class not found" });

    const genderCounts = classData.students.reduce(
      (acc, student) => {
        acc[student.gender] = (acc[student.gender] || 0) + 1;
        return acc;
      },
      { Male: 0, Female: 0, Other: 0 }
    );

    res.status(200).json({
      name: classData.name,
      year: classData.year,
      teacher: classData.teacher,
      students: classData.students,
      genderCounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get financial analytics
exports.getFinancialAnalytics = async (req, res) => {
  try {
    const { view, date } = req.query;
    let startDate, endDate;

    if (view === "monthly") {
      startDate = new Date(date);
      startDate.setDate(1);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      startDate = new Date(date, 0, 1);
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const teachers = await Teacher.find(
      {
        createdAt: { $gte: startDate, $lt: endDate },
      },
      "salary"
    );

    const students = await Student.find(
      {
        "feesPaid.date": { $gte: startDate, $lt: endDate },
      },
      "feesPaid class"
    ).populate("class", "studentFees");

    const totalSalaries = teachers.reduce(
      (sum, teacher) => sum + teacher.salary,
      0
    );
    const totalFeesCollected = students.reduce((sum, student) => {
      if (student.feesPaid && student.class) {
        return sum + student.class.studentFees;
      }
      return sum;
    }, 0);

    res.status(200).json({
      teacherSalaries: totalSalaries,
      studentFees: totalFeesCollected,
      profit: totalFeesCollected - totalSalaries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
