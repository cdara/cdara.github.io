// Theme management - Performance focused
const THEMES = ['modern'];
const MODES = ['dark', 'light'];

let currentTheme = 'modern';
let currentMode = 'dark';

// Initialize theme from localStorage or default
function initTheme() {
    const savedTheme = localStorage.getItem('v3-theme');
    const savedMode = localStorage.getItem('v3-mode');
    
    if (savedTheme && THEMES.includes(savedTheme)) {
        currentTheme = savedTheme;
    }
    
    if (savedMode && MODES.includes(savedMode)) {
        currentMode = savedMode;
    }
    
    applyTheme();
}

// Apply current theme and mode
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-mode', currentMode);
    localStorage.setItem('v3-theme', currentTheme);
    localStorage.setItem('v3-mode', currentMode);
}

// Toggle between dark and light mode
function toggleMode() {
    currentMode = currentMode === 'dark' ? 'light' : 'dark';
    applyTheme();
}

// Theme button click handler
document.getElementById('themeToggle').addEventListener('click', toggleMode);

// Initialize on load
initTheme();
