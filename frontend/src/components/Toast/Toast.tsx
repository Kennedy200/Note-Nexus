import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ type, message, description, onClose, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-blue-500 to-indigo-600'
  };

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50'
  };

  const textColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-amber-900',
    info: 'text-blue-900'
  };

  return (
    <div className="fixed top-24 right-6 z-[100] animate-slideIn">
      <div className={`${bgColors[type]} rounded-2xl shadow-2xl border-2 border-white/50 backdrop-blur-xl overflow-hidden max-w-md`}>
        <div className={`h-1 bg-gradient-to-r ${colors[type]}`}></div>
        
        <div className="p-6 flex items-start gap-4">
          <div className={`bg-gradient-to-br ${colors[type]} text-white p-2 rounded-xl shrink-0`}>
            {icons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-black text-lg ${textColors[type]} mb-1`}>{message}</h3>
            {description && (
              <p className={`text-sm font-bold ${textColors[type]} opacity-75`}>{description}</p>
            )}
          </div>

          <button 
            onClick={onClose}
            className={`${textColors[type]} hover:opacity-70 transition-opacity shrink-0`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className={`h-full bg-gradient-to-r ${colors[type]} animate-shrink`}
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Toast;