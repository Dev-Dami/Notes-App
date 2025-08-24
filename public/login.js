document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  messageEl.textContent = "Logging in......";
  messageEl.className = "text-center text-sm text-gray-600 mt-4";

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.textContent = data.message || "Login successful!";
      messageEl.className =
        "text-center text-sm text-green-600 mt-4 font-medium";

      // Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect note/prof
      setTimeout(() => (window.location.href = "/notes"), 1500);
    } else {
      messageEl.textContent = data.message || "Invalid credentials.";
      messageEl.className = "text-center text-sm text-red-600 mt-4 font-medium";
    }
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Server error. Try again.";
    messageEl.className = "text-center text-sm text-red-600 mt-4 font-medium";
  }
});
