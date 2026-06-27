// Theme management
const THEMES = ['neon', 'aurora', 'sunset', 'ocean'];
const MODES = ['dark', 'light'];

let currentTheme = 'neon';
let currentMode = 'dark';

// Initialize theme from localStorage or default
function initTheme() {
    const savedTheme = localStorage.getItem('v2-theme');
    const savedMode = localStorage.getItem('v2-mode');
    
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
    localStorage.setItem('v2-theme', currentTheme);
    localStorage.setItem('v2-mode', currentMode);
}

// Cycle through themes
function cycleTheme() {
    const currentIndex = THEMES.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    currentTheme = THEMES[nextIndex];
    applyTheme();
}

// Toggle between dark and light mode
function toggleMode() {
    currentMode = currentMode === 'dark' ? 'light' : 'dark';
    applyTheme();
}

// Theme button click handler
document.getElementById('themeToggle').addEventListener('click', () => {
    cycleTheme();
});

// Add keyboard shortcut for theme cycling (T key)
document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        cycleTheme();
    }
    if (e.key === 'd' || e.key === 'D') {
        toggleMode();
    }
});

// Initialize on load
initTheme();

// Add theme indicator to button
function updateThemeButton() {
    const themeBtn = document.getElementById('themeToggle');
    const themeEmojis = {
        neon: '🎨',
        aurora: '🌌',
        sunset: '🌅',
        ocean: '🌊'
    };
    themeBtn.textContent = themeEmojis[currentTheme];
}

// Update button when theme changes
const originalApplyTheme = applyTheme;
applyTheme = function() {
    originalApplyTheme();
    updateThemeButton();
};

updateThemeButton();
