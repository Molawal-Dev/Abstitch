"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AlertTriangle, Trash2, Copy, LogOut, X } from "lucide-react";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: "delete" | "duplicate" | "logout" | "warning";
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface ModalState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export function ConfirmModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({ ...options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    modal?.resolve(true);
    setModal(null);
  };

  const handleCancel = () => {
    modal?.resolve(false);
    setModal(null);
  };

  const icons = {
    delete: <Trash2 size={22} />,
    duplicate: <Copy size={22} />,
    logout: <LogOut size={22} />,
    warning: <AlertTriangle size={22} />,
  };

  const variantStyles = {
    danger: {
      icon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: "bg-amber-100 text-amber-600",
      button: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    info: {
      icon: "bg-blue-100 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const variant = modal?.variant || "info";
  const styles = variantStyles[variant];
  const iconKey = modal?.icon || "warning";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {modal && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleCancel}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-up overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="p-6">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}
              >
                {icons[iconKey]}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                {modal.title}
              </h3>

              {/* Message */}
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                {modal.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg border border-gray-300 font-sans text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {modal.cancelLabel || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-5 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors ${styles.button}`}
              >
                {modal.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmModalProvider");
  return ctx.confirm;
}