require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const path = require("path");

const server = express();

server.use(express.static("public"));

server.listen(PORT, () => console.log("listening on port", PORT));

server.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
