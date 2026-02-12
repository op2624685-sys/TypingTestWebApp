/**
 * Dynamic Theme Background Manager
 * Automatically switches background images based on theme changes
 */

class ThemeBackgroundManager {
  constructor() {
    this.body = document.body;
    this.themeButton = null;
    this.currentTheme = 'dark';
    
    // Background image configurations
    this.backgroundImages = {
      dark: "/img/Black Text Wallpaper.png",
      light: "/img/image (8).png"
    };
    
    // Initialize the manager
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Find theme toggle button
    this.themeButton = document.getElementById('theme-toggle') || 
                      document.querySelector('.theme-toggle');
    
    // Load saved theme and apply background
    this.loadSavedTheme();
    
    // Set up theme change detection
    this.setupThemeDetection();
    
    // Set up system theme preference detection
    this.setupSystemThemeDetection();
    
    // Apply initial background overlay
    this.body.classList.add('bg-overlay');
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      this.currentTheme = 'light';
      this.body.classList.add('light-mode');
      if (this.themeButton) this.themeButton.textContent = '🌞';
    } else {
      this.currentTheme = 'dark';
      this.body.classList.remove('light-mode');
      if (this.themeButton) this.themeButton.textContent = '🌙';
    }
    
    this.applyBackgroundImage(this.currentTheme);
  }

  setupThemeDetection() {
    // Method 1: Listen for theme button clicks
    if (this.themeButton) {
      this.themeButton.addEventListener('click', () => {
        // Small delay to let the theme class change first
        setTimeout(() => {
          this.detectAndApplyTheme();
        }, 10);
      });
    }

    // Method 2: Use MutationObserver to detect class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.detectAndApplyTheme();
        }
      });
    });

    observer.observe(this.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Method 3: Listen for custom theme change events
    document.addEventListener('themeChanged', (event) => {
      this.applyBackgroundImage(event.detail.theme);
    });
  }

  setupSystemThemeDetection() {
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyThemeAndBackground(systemTheme);
        }
      });
    }
  }

  detectAndApplyTheme() {
    const isLightMode = this.body.classList.contains('light-mode');
    const newTheme = isLightMode ? 'light' : 'dark';
    
    if (newTheme !== this.currentTheme) {
      this.currentTheme = newTheme;
      this.applyBackgroundImage(newTheme);
    }
  }

  applyBackgroundImage(theme) {
    const backgroundImage = this.backgroundImages[theme];
    
    if (!backgroundImage) {
      console.warn(`No background image defined for theme: ${theme}`);
      return;
    }

    // Add transition class for smooth animation
    this.body.classList.add('bg-transitioning');
    
    // Remove any existing theme background classes
    this.body.classList.remove('bg-theme-dark', 'bg-theme-light');
    
    // Apply new background image
    this.body.style.backgroundImage = `url("${backgroundImage}")`;
    
    // Add appropriate theme class
    this.body.classList.add(`bg-theme-${theme}`);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      this.body.classList.remove('bg-transitioning');
    }, 500);

    // Dispatch custom event for other components
    this.dispatchThemeChangeEvent(theme);
    
    console.log(`Background switched to ${theme} theme: ${backgroundImage}`);
  }

  applyThemeAndBackground(theme) {
    // Apply theme class
    if (theme === 'light') {
      this.body.classList.add('light-mode');
      if (this.themeButton) this.themeButton.textContent = '🌞';
    } else {
      this.body.classList.remove('light-mode');
      if (this.themeButton) this.themeButton.textContent = '🌙';
    }
    
    // Apply background
    this.currentTheme = theme;
    this.applyBackgroundImage(theme);
    
    // Save preference
    localStorage.setItem('theme', theme);
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('backgroundThemeChanged', {
      detail: { 
        theme: theme,
        backgroundImage: this.backgroundImages[theme]
      }
    });
    document.dispatchEvent(event);
  }

  // Public method to manually switch theme
  switchTheme(theme) {
    if (this.backgroundImages[theme]) {
      this.applyThemeAndBackground(theme);
    }
  }

  // Public method to add new background images
  addBackgroundImage(theme, imagePath) {
    this.backgroundImages[theme] = imagePath;
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Public method to preload background images
  preloadBackgroundImages() {
    Object.values(this.backgroundImages).forEach(imagePath => {
      const img = new Image();
      img.src = imagePath;
    });
  }
}

// Initialize the theme background manager
const themeBackgroundManager = new ThemeBackgroundManager();

// Preload background images for better performance
themeBackgroundManager.preloadBackgroundImages();

// Make it globally accessible
window.themeBackgroundManager = themeBackgroundManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeBackgroundManager;
}
