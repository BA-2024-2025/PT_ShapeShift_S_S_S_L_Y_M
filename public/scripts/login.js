document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");
  
    errorMessage.classList.add("hidden");
  
    if (!username || !password) {
      errorMessage.textContent = "Please enter both fields.";
      errorMessage.classList.remove("hidden");
      return;
    }
  
    try {
      const response = await fetch("http://172.16.2.164:3000/submit-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login success, z.B. weiterleiten:
        window.location.href = "/dashboard";
      } else {
        errorMessage.textContent = data.message || "Login failed.";
        errorMessage.classList.remove("hidden");
      }
    } catch (err) {
      errorMessage.textContent = "Server not reachable.";
      errorMessage.classList.remove("hidden");
    }
  });
  