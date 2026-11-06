import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);
let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      const id = ++toastId;
      const item = {
        id,
        message,
        type: options.type ?? "success", // success | error | info
        duration: options.duration ?? 2800,
      };
      setToasts((prev) => [...prev, item]);
      setTimeout(() => remove(id), item.duration);
      return id;
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast, remove }}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <i
              className={`fa-solid ${
                t.type === "success"
                  ? "fa-circle-check"
                  : t.type === "error"
                  ? "fa-circle-xmark"
                  : "fa-circle-info"
              }`}
            ></i>
            <span className="toast__msg">{t.message}</span>
            <button
              className="toast__close"
              onClick={() => remove(t.id)}
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}