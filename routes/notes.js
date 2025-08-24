const express = require("express");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const router = express.Router();

router.use(auth);

// Get all notes
router.get("/", async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// Create a new note
router.post("/", async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    user: req.user.id,
  });
  await newNote.save();
  res.status(201).json(newNote);
});

// Update a note
router.put("/:id", async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedNote);
});

// Delete a note
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
