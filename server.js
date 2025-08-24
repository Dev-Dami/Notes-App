const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const profileRoutes = require("./routes/profile");
const notesRoutes = require("./routes/notes");

//ejs

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.render("index", { title: "Notes App" });
});
app.get("/register", (req, res) => {
  res.render("register", { title: "Register - Notes App" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login - Notes App" });
});

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/profile", profileRoutes);
app.use("/notes", notesRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
