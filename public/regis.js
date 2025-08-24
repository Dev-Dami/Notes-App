document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const messageEl = document.getElementById("message");
    messageEl.textContent = "Registering... ⏳";
    messageEl.className = "text-center text-sm text-gray-600 mt-4";

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        messageEl.textContent = data.message || "Registered successfully!";
        messageEl.className =
          "text-center text-sm text-green-600 mt-4 font-medium";

        // redirect
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        messageEl.textContent = data.message || "Registration failed.";
        messageEl.className =
          "text-center text-sm text-red-600 mt-4 font-medium";
      }
    } catch (err) {
      messageEl.textContent = "Server error. Try again.";
      messageEl.className = "text-center text-sm text-red-600 mt-4 font-medium";
      console.error(err);
    }
  });
