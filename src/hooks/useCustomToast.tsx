import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface CustomToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = (type: ToastType, options: CustomToastOptions) => {
    const { title, description, duration = getDefaultDuration(type) } = options;

    const icon = getIcon(type);
    const variant = getVariant(type);

    return toast({
      title,
      description: description ? (
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">{icon}</div>
          <div>{description}</div>
        </div>
      ) : undefined,
      duration,
      variant: variant as any,
    });
  };

  const success = (options: CustomToastOptions) => showToast('success', options);
  const error = (options: CustomToastOptions) => showToast('error', options);
  const warning = (options: CustomToastOptions) => showToast('warning', options);
  const info = (options: CustomToastOptions) => showToast('info', options);
  const loading = (options: CustomToastOptions) => showToast('loading', options);

  return {
    success,
    error,
    warning,
    info,
    loading,
    showToast,
  };
};

// Helper functions
function getIcon(type: ToastType) {
  const iconClass = "h-5 w-5 flex-shrink-0";

  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case 'error':
      return <XCircle className={`${iconClass} text-red-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
    case 'info':
      return <Info className={`${iconClass} text-blue-600`} />;
    case 'loading':
      return <Loader2 className={`${iconClass} text-blue-600 animate-spin`} />;
    default:
      return null;
  }
}

function getVariant(type: ToastType): 'default' | 'destructive' | 'success' {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'success':
      return 'success';
    default:
      return 'default';
  }
}

function getDefaultDuration(type: ToastType): number {
  switch (type) {
    case 'success':
      return 3000; // 3 seconds
    case 'error':
      return 5000; // 5 seconds (errors need more time to read)
    case 'warning':
      return 4000; // 4 seconds
    case 'info':
      return 3000; // 3 seconds
    case 'loading':
      return 0; // Don't auto-dismiss loading toasts
    default:
      return 3000;
  }
}