const token = localStorage.getItem("token");

// redirect to login when no see token
if (!token) {
  alert("You must log in first!");
  window.location.href = "/login";
}

// DOM0-Elements
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const notesCount = document.getElementById("notesCount");
const memberSince = document.getElementById("memberSince");
const totalNotes = document.getElementById("totalNotes");
const recentNotes = document.getElementById("recentNotes");
const avgNoteLength = document.getElementById("avgNoteLength");
const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const editUsernameBtn = document.getElementById("editUsernameBtn");
const editEmailBtn = document.getElementById("editEmailBtn");
const editPasswordBtn = document.getElementById("editPasswordBtn");
const logoutBtn = document.getElementById("logoutBtn");
const passwordModal = document.getElementById("passwordModal");
const passwordForm = document.getElementById("passwordForm");
const closePasswordModal = document.getElementById("closePasswordModal");
const cancelPassword = document.getElementById("cancelPassword");

// Fetch user profile data
async function fetchProfile() {
  try {
    const res = await fetch("http://localhost:5000/api/profile", {
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

    const data = await res.json();
    displayProfile(data.user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Error fetching profile. Please try again.");
  }
}

// fdisplay profile data
function displayProfile(user) {
  profileUsername.textContent = user.username;
  profileEmail.textContent = user.email;
  usernameInput.value = user.username;
  emailInput.value = user.email;

  // format join date
  const sourceDate = user.memberSince || user.createdAt;
  const joinDate = sourceDate ? new Date(sourceDate) : null;
  memberSince.textContent = joinDate ? joinDate.toLocaleDateString() : "N/A";

  fetchNotesStats();
}

// fetch-notes-statistics
async function fetchNotesStats() {
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
    displayNotesStats(notes);
  } catch (err) {
    console.error("Error fetching notes statistics:", err);
  }
}

// display notes stats
function displayNotesStats(notes) {
  // Total-notes
  const total = notes.length;
  notesCount.textContent = total;
  totalNotes.textContent = total;

  // Recent-notes
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recent = notes.filter(
    (note) => new Date(note.createdAt) > oneWeekAgo
  ).length;
  recentNotes.textContent = recent;

  // Average-note-length
  if (total > 0) {
    const totalLength = notes.reduce(
      (sum, note) => sum + note.content.length,
      0
    );
    const avg = Math.round(totalLength / total);
    avgNoteLength.textContent = avg;
  } else {
    avgNoteLength.textContent = 0;
  }
}

// Edit username
editUsernameBtn.addEventListener("click", () => {
  if (usernameInput.disabled) {
    usernameInput.disabled = false;
    usernameInput.focus();
    editUsernameBtn.innerHTML = '<i class="fas fa-save"></i>';
    editUsernameBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
    editUsernameBtn.classList.add("bg-green-600", "hover:bg-green-700");
  } else {
    saveUsername();
  }
});

// Save username
async function saveUsername() {
  const newUsername = usernameInput.value.trim();
  if (!newUsername) {
    alert("Username cannot be empty");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newUsername }),
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

    // Update UI
    profileUsername.textContent = newUsername;
    usernameInput.disabled = true;
    editUsernameBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editUsernameBtn.classList.remove("bg-green-600", "hover:bg-green-700");
    editUsernameBtn.classList.add("bg-blue-600", "hover:bg-blue-700");

    alert("Username updated successfully!");
  } catch (err) {
    console.error("Error updating username:", err);
    alert("Error updating username. Please try again.");
  }
}

// Edit email
editEmailBtn.addEventListener("click", () => {
  if (emailInput.disabled) {
    emailInput.disabled = false;
    emailInput.focus();
    editEmailBtn.innerHTML = '<i class="fas fa-save"></i>';
    editEmailBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
    editEmailBtn.classList.add("bg-green-600", "hover:bg-green-700");
  } else {
    saveEmail();
  }
});

// Save email
async function saveEmail() {
  const newEmail = emailInput.value.trim();
  if (!newEmail) {
    alert("Email cannot be empty");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    alert("Please enter a valid email address");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: newEmail }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      if (data.error === "Email already in use") {
        alert("This email is already in use by another account");
        return;
      }
      throw new Error(`Server error: ${res.status}`);
    }

    // update UI
    profileEmail.textContent = newEmail;
    emailInput.disabled = true;
    editEmailBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editEmailBtn.classList.remove("bg-green-600", "hover:bg-green-700");
    editEmailBtn.classList.add("bg-blue-600", "hover:bg-blue-700");

    alert("Email updated successfully!");
  } catch (err) {
    console.error("Error updating email:", err);
    alert("Error updating email. Please try again.");
  }
}

// change password
editPasswordBtn.addEventListener("click", () => {
  passwordModal.classList.remove("hidden");
  passwordForm.reset();
});

// close password modal
closePasswordModal.addEventListener("click", () => {
  passwordModal.classList.add("hidden");
});

cancelPassword.addEventListener("click", () => {
  passwordModal.classList.add("hidden");
});

// submit password change form
passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/profile/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      if (data.error === "Current password is incorrect") {
        alert("Current password is incorrect");
        return;
      }
      throw new Error(`Server error: ${res.status}`);
    }

    passwordModal.classList.add("hidden");
    alert("Password updated successfully!");
  } catch (err) {
    console.error("Error updating password:", err);
    alert("Error updating password. Please try again.");
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

// Initial fetch
fetchProfile();
