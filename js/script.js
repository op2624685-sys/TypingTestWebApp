// Mobile Menu Toggle
const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Enhanced Theme Toggle with Background Integration
const themeButton = document.getElementById("theme-toggle");
const body = document.body;

// Theme toggle with background integration
themeButton.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  
  const isLightMode = body.classList.contains("light-mode");
  const theme = isLightMode ? "light" : "dark";
  
  // Update button icon
  themeButton.textContent = isLightMode ? "🌞" : "🌙";
  
  // Save theme preference
  localStorage.setItem("theme", theme);
  
  // Dispatch custom event for background manager
  const event = new CustomEvent('themeChanged', {
    detail: { theme: theme }
  });
  document.dispatchEvent(event);
});

// Load Saved Theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
  themeButton.textContent = "🌞";
} else {
  body.classList.remove("light-mode");
  themeButton.textContent = "🌙";
}

// Listen for background theme changes
document.addEventListener('backgroundThemeChanged', (event) => {
  console.log(`Background theme changed to: ${event.detail.theme}`);
  console.log(`New background image: ${event.detail.backgroundImage}`);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Only trigger if no input is focused
  if (document.activeElement.tagName !== 'INPUT' && 
      document.activeElement.tagName !== 'TEXTAREA') {
    
    // Ctrl/Cmd + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
      e.preventDefault();
      themeButton.click();
    }
  }
});

// Add smooth transitions for better UX
document.addEventListener('DOMContentLoaded', () => {
  // Ensure background manager is initialized after DOM is ready
  if (window.backgroundManager) {
    // Apply any saved settings
    backgroundManager.applyCurrentSettings();
  }
});