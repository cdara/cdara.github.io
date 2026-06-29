window.Preferences = (function () {
    const THEMES = ["midnight", "spring", "summer", "fall"];
    const MODES = ["dark", "light"];
    const MOTION = ["on", "off"];
    const FONT_STYLES = ["formal", "poet", "modern"];

    const MIN_FONT = 0.85;
    const MAX_FONT = 1.25;
    const FONT_STEP = 0.05;

    const FONT_FAMILIES = {
        formal: '"Segoe UI", Inter, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif',
        poet: 'Lato, "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif',
        modern: 'Poppins, "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif'
    };

    let theme = "midnight";
    let mode = "dark";
    let motion = "on";
    let fontScale = 1;
    let fontStyle = "formal";
    let motionOverride = false;

    const META_COLORS = {
        midnight: { dark: "#0b1118", light: "#f1f5f9" },
        spring: { dark: "#0d1510", light: "#f0fdf4" },
        summer: { dark: "#14120a", light: "#fefce8" },
        fall: { dark: "#140f0c", light: "#fff7ed" }
    };

    function init() {
        const root = document.documentElement;

        theme = readAttr(root, "data-theme", THEMES, "midnight");
        mode = readAttr(root, "data-mode", MODES, "dark");
        motion = readAttr(root, "data-motion", MOTION, "on");
        fontScale = parseFloat(root.getAttribute("data-font-scale")) || 1;
        fontStyle = readAttr(root, "data-font-style", FONT_STYLES, "formal");

        if (Storage.get("motionOverride")) {
            motionOverride = true;
        } else if (!Storage.get("motion") && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            motion = "off";
        }

        applyTheme(theme, false);
        applyMode(mode, false);
        applyMotion(motion, false);
        applyFont(fontScale, false);
        applyFontStyle(fontStyle, false);
        syncUI();

        window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
            if (!motionOverride) {
                setMotion(event.matches ? "off" : "on", false);
            }
        });
    }

    function readAttr(root, attr, allowed, fallback) {
        const saved = Storage.get(attr.replace("data-", ""));
        const value = saved || root.getAttribute(attr);
        return allowed.includes(value) ? value : fallback;
    }

    function withTransition(fn) {
        const root = document.documentElement;
        if (motion === "off") {
            fn();
            return;
        }
        root.classList.add("theme-transition");
        fn();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => root.classList.remove("theme-transition"));
        });
    }

    function setTheme(next) {
        if (!THEMES.includes(next)) return;
        withTransition(() => applyTheme(next, true));
    }

    function applyTheme(next, persist) {
        theme = next;
        document.documentElement.setAttribute("data-theme", next);
        updateMetaThemeColor();
        if (persist) Storage.set("theme", next);
        syncThemeButtons();
    }

    function setMode(next) {
        if (!MODES.includes(next)) return;
        withTransition(() => applyMode(next, true));
    }

    function applyMode(next, persist) {
        mode = next;
        document.documentElement.setAttribute("data-mode", next);
        updateMetaThemeColor();
        if (persist) Storage.set("mode", next);
        syncModeButtons();
    }

    function setMotion(next, persist = true) {
        if (!MOTION.includes(next)) return;
        applyMotion(next, persist);
        syncMotionButtons();
        syncDesktopMotionToggle();
    }

    function applyMotion(next, persist) {
        motion = next;
        const root = document.documentElement;
        root.setAttribute("data-motion", next);
        root.classList.toggle("motion-off", next === "off");
        root.style.scrollBehavior = next === "on" ? "smooth" : "auto";

        if (persist) {
            motionOverride = true;
            Storage.set("motion", next);
            Storage.set("motionOverride", true);
        }
    }

    function toggleMotion() {
        setMotion(motion === "on" ? "off" : "on");
    }

    function setFont(scale) {
        const clamped = Math.max(MIN_FONT, Math.min(MAX_FONT, parseFloat(scale)));
        applyFont(clamped, true);
    }

    function applyFont(scale, persist) {
        fontScale = scale;
        const root = document.documentElement;
        root.style.setProperty("--font-scale", String(scale));
        root.setAttribute("data-font-scale", String(scale));
        if (persist) Storage.set("fontSize", scale);
        syncFontSliders();
    }

    function increaseFont() {
        setFont(fontScale + FONT_STEP);
    }

    function decreaseFont() {
        setFont(fontScale - FONT_STEP);
    }

    function setFontStyle(next) {
        if (!FONT_STYLES.includes(next)) return;
        withTransition(() => applyFontStyle(next, true));
    }

    function applyFontStyle(next, persist) {
        fontStyle = next;
        const root = document.documentElement;
        root.style.setProperty("--font-family", FONT_FAMILIES[next]);
        root.setAttribute("data-font-style", next);
        if (persist) Storage.set("fontStyle", next);
        syncFontStyleButtons();
    }

    function updateMetaThemeColor() {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta && META_COLORS[theme]) {
            meta.setAttribute("content", META_COLORS[theme][mode]);
        }
    }

    function syncUI() {
        syncThemeButtons();
        syncModeButtons();
        syncMotionButtons();
        syncFontSliders();
        syncFontStyleButtons();
        syncDesktopMotionToggle();
    }

    function syncThemeButtons() {
        document.querySelectorAll("button[data-theme]").forEach((btn) => {
            const active = btn.getAttribute("data-theme") === theme;
            btn.setAttribute("aria-pressed", String(active));
        });
    }

    function syncModeButtons() {
        document.querySelectorAll("button[data-mode]").forEach((btn) => {
            const active = btn.getAttribute("data-mode") === mode;
            btn.setAttribute("aria-pressed", String(active));
        });
    }

    function syncMotionButtons() {
        document.querySelectorAll("button[data-motion]").forEach((btn) => {
            const active = btn.getAttribute("data-motion") === motion;
            btn.setAttribute("aria-pressed", String(active));
        });
    }

    function syncDesktopMotionToggle() {
        const toggle = document.querySelector("[data-motion-toggle]");
        if (!toggle) return;
        const isOn = motion === "on";
        toggle.setAttribute("aria-pressed", String(isOn));
        toggle.textContent = isOn ? "Motion on" : "Motion off";
    }

    function syncFontSliders() {
        document.querySelectorAll('input[type="range"][id^="fontSlider"]').forEach((slider) => {
            slider.value = String(fontScale);
        });
    }

    function syncFontStyleButtons() {
        document.querySelectorAll("button[data-font-style]").forEach((btn) => {
            const active = btn.getAttribute("data-font-style") === fontStyle;
            btn.setAttribute("aria-pressed", String(active));
        });
    }

    return {
        init,
        setTheme,
        setMode,
        setMotion,
        toggleMotion,
        setFont,
        increaseFont,
        decreaseFont,
        setFontStyle,
        getTheme: () => theme,
        getMode: () => mode,
        getMotion: () => motion,
        getFont: () => fontScale,
        getFontStyle: () => fontStyle
    };
})();
