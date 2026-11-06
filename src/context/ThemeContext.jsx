import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

// Cambiamos la clave para reiniciar las preferencias anteriores
const STORAGE_KEY = "app-theme-v2";

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    // Aplicar tema
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");

    // Evitar que el navegador fuerce colores oscuros
    root.style.colorScheme = theme;

    // Guardar preferencia del usuario
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      "useTheme debe usarse dentro de <ThemeProvider>"
    );
  }

  return ctx;
}