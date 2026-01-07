import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-md animate-slide-in-right transition-all duration-300 transform translate-y-0 ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' :
                                toast.type === 'error' ? 'bg-red-50/90 border-red-100 text-red-800' :
                                    'bg-blue-50/90 border-blue-100 text-blue-800'
                            }`}
                    >
                        <div className={`mr-3 p-1 rounded-full ${toast.type === 'success' ? 'bg-emerald-100' :
                                toast.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                            {toast.type === 'success' ? <CheckCircle size={16} className="text-emerald-600" /> :
                                toast.type === 'error' ? <AlertCircle size={16} className="text-red-600" /> :
                                    <Info size={16} className="text-blue-600" />}
                        </div>
                        <span className="font-medium text-sm pr-4">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="ml-auto text-slate-400 hover:text-slate-600">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
