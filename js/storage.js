window.Storage = (function () {
    const isAvailable = (function () {
        try {
            const key = "__storage_test__";
            localStorage.setItem(key, "1");
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    })();

    function set(key, value) {
        if (!isAvailable) return false;
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    function get(key, fallback = null) {
        if (!isAvailable) return fallback;
        try {
            const item = localStorage.getItem(key);
            return item === null ? fallback : JSON.parse(item);
        } catch {
            return fallback;
        }
    }

    return { set, get };
})();
