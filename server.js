const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ================================
// EJS CONFIGURATION
// ================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================================
// MIDDLEWARE
// ================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

app.disable("x-powered-by");

// ================================
// ROUTES
// ================================

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Mini Game
app.get("/minigame", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "minigame.html"));
});
app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "gallery.html"));
});

// ================================
// CATCH-ALL ROUTE
// MUST BE LAST
// ================================

app.use((req, res) => {
  res.status(404).render("404.ejs");
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
  console.log(`♡ Sanskriti experience running at http://localhost:${PORT}`);
});
