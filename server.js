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

server.get("/api/notes", async (req, res) => {
  try {
    const notes = JSON.parse(
      await fs.readFile(path.join(__dirname, "db/db.json"))
    );
    res.json(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

server.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

server.post("/api/notes", async (req, res) => {
  try {
    const newNote = req.body;
    newNote.id = uuidv4();
    const notes = JSON.parse(
      await fs.readFile(path.join(__dirname, "db/db.json"))
    );
    notes.push(newNote);
    await fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(notes)
    );
    res.status(200).json(newNote);
  } catch (err) {
    res.status(500).send(err);
  }
});

server.delete("api/notes/:id", async (req, res) => {
  try {
    const deleteID = req.params.id;
    console.log(deleteID);
    const oldNotes = JSON.parse(
      await fs.readFile(path.join(__dirname, "db/db.json"))
    );
    const newNotes = oldNotes.filter((note) => note.id !== deleteID);
    await fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(newNotes)
    );
    res.status(200).json(newNotes);
  } catch (err) {
    res.status(500).send(err);
  }
});
