const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

app.use(cookieParser());
app.use(mongoSanitize());

const PORT = process.env.PORT;

connectDb();

app.set("trust proxy", 1);

// Rate Limiter Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    isSuccess: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  headers: true, // Include rate limit info in response headers
});

// Apply rate limiter to all requests
app.use(limiter);

// app.use((req, res, next) => {
//   console.log("Client IP:", req.ip);
//   console.log("Forwarded Header:", req.headers["x-forwarded-for"]);
//   next();
// });

const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, PATCH",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());

// configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    // proxy: true, // uncomment this line on production
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set to true before taking it live
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);

app.use("/api", require("./routes/index.js"));

app.get("/api/check-auth", (req, res) => {
  if (
    req.session &&
    (req.session.admin || req.session.student || req.session.teacher)
  ) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.session.admin || req.session.student || req.session.teacher,
    });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
