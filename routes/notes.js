const express = require("express");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const router = express.Router();

// Get all notes
router.get("/", auth, async (req, res) => {
  try {
    console.log("Fetching notes for user:", req.user.id);
    const notes = await Note.find({ user: req.user.id });
    console.log("Found notes:", notes);
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create a new note
router.post("/", auth, async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      user: req.user.id,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update a note
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if the note belongs to the current user
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete a note
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if the note belongs to the current user
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
