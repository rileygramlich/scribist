import { useEffect, useState } from "react";

const KEY = "scribist:theme";

export function useTheme() {
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem(KEY, theme); } catch {}
    }, [theme]);
    return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}
