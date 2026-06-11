"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle size={18} className="flex-shrink-0" />,
    error: <AlertCircle size={18} className="flex-shrink-0" />,
    warning: <AlertTriangle size={18} className="flex-shrink-0" />,
    info: <Info size={18} className="flex-shrink-0" />,
  };

  const styles = {
    success: "bg-emerald-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-gray-900 text-white",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg shadow-xl min-w-[280px] max-w-sm pointer-events-auto transition-all duration-300",
        styles[toast.type],
        visible && !leaving
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      )}
    >
      {icons[toast.type]}
      <p className="font-sans text-sm flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-white/70 hover:text-white transition-colors flex-shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

let externalToast: ToastContextValue["toast"] | null = null;

export function Toaster({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const success = useCallback(
    (message: string) => toast(message, "success"),
    [toast]
  );
  const error = useCallback(
    (message: string) => toast(message, "error"),
    [toast]
  );
  const info = useCallback(
    (message: string) => toast(message, "info"),
    [toast]
  );
  const warning = useCallback(
    (message: string) => toast(message, "warning"),
    [toast]
  );

  useEffect(() => {
    externalToast = toast;
    return () => { externalToast = null; };
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

export function showToast(
  message: string,
  type: ToastType = "info",
  duration?: number
) {
  externalToast?.(message, type, duration);
}