require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const server = express();
server.use(express.static("public"));
server.use(express.json());
server.listen(PORT, () => console.log("listening on port", PORT));

async function getNotes() {
  return JSON.parse(await fs.readFile(path.join(__dirname, "db/db.json")));
}

async function writeNotes(notes) {
  await fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes));
}

server.get("/api/notes", async (req, res) => res.json(await getNotes()));

server.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

server.post("/api/notes", async (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = await getNotes();
  notes.push(newNote);
  await writeNotes(notes);
  res.json(newNote);
});

server.delete("/api/notes/:id", async (req, res) => {
  const notes = await getNotes();
  const newNotes = notes.filter((note) => note.id !== req.params.id);
  await writeNotes(newNotes);
  res.json(newNotes);
});
