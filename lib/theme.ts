export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "reposhelf-theme";

/**
 * Runs in <head> before the page paints, so there's no flash of the wrong theme.
 * Kept as a plain string because it must work before React loads.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");var d=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})();`;
