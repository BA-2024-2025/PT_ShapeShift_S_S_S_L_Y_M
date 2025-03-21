document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");
  
    errorMessage.classList.add("hidden");
  
    if (!email || !password) {
      errorMessage.textContent = "Please enter both fields.";
      errorMessage.classList.remove("hidden");
      return;
    }

    try {
        const response = await fetch("http://nluginbuehlsi:4000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json(); // Parse the response body as JSON

        if (response.ok) {
            console.log(data);
            // Save token and user to localStorage if login is successful
            localStorage.setItem('accessToken', data.accessToken);  // Save token to localStorage
            localStorage.setItem('refreshToken', data.refreshToken)

            // Redirect or handle the successful login
            window.location.href = "index.html"; // Example redirection

        } else {
            // Display error message if login fails
            errorMessage.textContent = data.message || "Login failed.";
            errorMessage.classList.remove("hidden");
        }

    } catch (err) {
        // Handle network or other errors
        errorMessage.textContent = "Server not reachable.";
        errorMessage.classList.remove("hidden");
        console.error(err.message);
    }
});
  