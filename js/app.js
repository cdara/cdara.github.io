(function () {
    function hydrateFromStorage() {
        const root = document.documentElement;
        const keys = [
            ["theme", "data-theme"],
            ["mode", "data-mode"],
            ["motion", "data-motion"],
            ["fontSize", "data-font-scale"]
        ];

        keys.forEach(([storageKey, attr]) => {
            const value = Storage.get(storageKey);
            if (value !== null) root.setAttribute(attr, value);
        });
    }

    function bindControls() {
        document.querySelectorAll("button[data-theme]").forEach((btn) => {
            btn.addEventListener("click", () => Preferences.setTheme(btn.getAttribute("data-theme")));
        });

        document.querySelectorAll("button[data-mode]").forEach((btn) => {
            btn.addEventListener("click", () => Preferences.setMode(btn.getAttribute("data-mode")));
        });

        document.querySelectorAll("button[data-motion]").forEach((btn) => {
            btn.addEventListener("click", () => Preferences.setMotion(btn.getAttribute("data-motion")));
        });

        const motionToggle = document.querySelector("[data-motion-toggle]");
        if (motionToggle) {
            motionToggle.addEventListener("click", () => Preferences.toggleMotion());
        }

        document.querySelectorAll("[data-font-increase]").forEach((btn) => {
            btn.addEventListener("click", () => Preferences.increaseFont());
        });

        document.querySelectorAll("[data-font-decrease]").forEach((btn) => {
            btn.addEventListener("click", () => Preferences.decreaseFont());
        });

        document.querySelectorAll('input[type="range"][id^="fontSlider"]').forEach((slider) => {
            slider.addEventListener("input", () => Preferences.setFont(slider.value));
        });
    }

    function bindMobileDropdown() {
        const trigger = document.getElementById("prefsTrigger");
        const panel = document.getElementById("prefsDropdown");
        if (!trigger || !panel) return;

        function close() {
            panel.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        }

        function toggle() {
            const open = panel.classList.toggle("is-open");
            trigger.setAttribute("aria-expanded", String(open));
        }

        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            toggle();
        });

        document.addEventListener("click", (event) => {
            if (!panel.contains(event.target) && event.target !== trigger) {
                close();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") close();
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        hydrateFromStorage();
        Preferences.init();
        bindControls();
        bindMobileDropdown();
    });
})();
