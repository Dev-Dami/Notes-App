const token = localStorage.getItem("token");

// Redirect to login if token missing
if (!token) {
  alert("You must log in first!");
  window.location.href = "/login";
}

const notesList = document.getElementById("notesList");
const newNoteForm = document.getElementById("newNoteForm");
const emptyState = document.getElementById("emptyState");
const logoutBtn = document.getElementById("logoutBtn");

// Fetch all notes
async function fetchNotes() {
  try {
    const res = await fetch("http://localhost:5000/api/notes", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const notes = await res.json();
    displayNotes(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    notesList.innerHTML =
      '<p class="text-red-600 text-center">Failed to load notes. Try again.</p>';
  }
}

// Display notes
function displayNotes(notes) {
  notesList.innerHTML = "";

  // Show empty state if no notes
  if (notes.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  notes.forEach((note) => {
    const noteEl = document.createElement("div");
    noteEl.className = "bg-white rounded-lg shadow p-4";
    noteEl.dataset.id = note._id;

    noteEl.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-lg note-title" data-id="${note._id}">${note.title}</h3>
        <button class="editBtn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" data-id="${note._id}">Edit</button>
      </div>
      <p class="text-gray-600 mb-4 note-content" data-id="${note._id}">${note.content}</p>
      <div class="flex justify-end">
        <button class="deleteBtn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" data-id="${note._id}">Delete</button>
      </div>
    `;
    notesList.appendChild(noteEl);
  });

  // delete handlers
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        fetchNotes();
      } catch (err) {
        console.error("Error deleting note:", err);
        alert("Error deleting note. Please try again.");
      }
    });
  });

  // Attach edit handlers
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const noteEl = document.querySelector(`[data-id="${id}"]`);

      // If already in edit mode, collect values from the input/textarea and save
      if (btn.textContent.trim() === "Save") {
        const titleInput = noteEl.querySelector('input[type="text"]');
        const contentTextarea = noteEl.querySelector("textarea");

        const newTitle = titleInput ? titleInput.value.trim() : "";
        const newContent = contentTextarea ? contentTextarea.value.trim() : "";

        if (!newTitle || !newContent) {
          alert("Title and content cannot be empty");
          return;
        }

        // Persist changes (UI will refresh via fetchNotes on success)
        saveNote(id, newTitle, newContent);
      } else {
        // Enter edit mode: replace title/content with editable fields
        const titleEl = noteEl.querySelector(".note-title");
        const contentEl = noteEl.querySelector(".note-content");
        makeEditable(titleEl, contentEl, btn);
      }
    });
  });
}

// Make elements editable
function makeEditable(titleEl, contentEl, btn) {
  const originalTitle = titleEl.textContent;
  const originalContent = contentEl.textContent;

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = originalTitle;
  titleInput.className = "w-full px-2 py-1 border rounded mb-2";

  const contentTextarea = document.createElement("textarea");
  contentTextarea.value = originalContent;
  contentTextarea.className = "w-full px-2 py-1 border rounded mb-2";
  contentTextarea.rows = 3;

  titleEl.parentNode.replaceChild(titleInput, titleEl);
  contentEl.parentNode.replaceChild(contentTextarea, contentEl);

  btn.textContent = "Save";
  btn.className =
    "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600";

  titleInput.focus();
}

// Save note changes
async function saveNote(id, title, content) {
  try {
    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    fetchNotes();
  } catch (err) {
    console.error("Error updating note:", err);
    alert("Error updating note. Please try again.");
  }
}

// Add new note
newNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  try {
    const res = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    newNoteForm.reset();
    fetchNotes();
  } catch (err) {
    console.error("Error creating note:", err);
    alert("Error creating note. Please try again.");
  }
});

// Logout handler
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

// Initial fetch
fetchNotes();
