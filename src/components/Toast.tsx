/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      window.setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-400/30',
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          titleColor: 'text-green-400'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-400/30',
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          titleColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-400/30',
          icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
          titleColor: 'text-yellow-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-400/30',
          icon: <Info className="w-5 h-5 text-blue-400" />,
          titleColor: 'text-blue-400'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`${styles.bg} backdrop-blur-md rounded-xl p-4 border ${styles.border}
                           shadow-lg min-w-[300px]`}
              >
                <div className="flex items-start space-x-3">
                  {styles.icon}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${styles.titleColor}`}>
                      {toast.title}
                    </h4>
                    {toast.message && (
                      <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                        {toast.message}
                      </p>
                    )}
                    {toast.action && (
                      <button
                        onClick={() => {
                          toast.action?.onClick();
                          removeToast(toast.id);
                        }}
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium mt-2
                                 underline underline-offset-2 transition-colors duration-200"
                      >
                        {toast.action.label}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-gray-400 hover:text-white transition-colors duration-200
                             flex-shrink-0 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                {toast.duration && toast.duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                    className="h-0.5 bg-yellow-400/50 rounded-full mt-3"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
