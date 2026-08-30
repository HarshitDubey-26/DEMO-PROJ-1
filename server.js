const express = require("express");
const path = require("path");

const app = express();
const PORT =3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "public")));

app.get("*splat", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`♡ Sanskriti experience running at http://localhost:${PORT}`);
});
