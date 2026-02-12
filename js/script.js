 // Mobile Menu Toggle
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Theme Toggle
    const themeButton = document.getElementById("theme-toggle");
    const body = document.body;

    themeButton.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      if (body.classList.contains("light-mode")) {
        themeButton.textContent = "🌞";
        localStorage.setItem("theme", "light");
      } else {
        themeButton.textContent = "🌙";
        localStorage.setItem("theme", "dark");
      }
    });

    // Load Saved Theme
    if (localStorage.getItem("theme") === "light") {
      body.classList.add("light-mode");
      themeButton.textContent = "🌞";
    }