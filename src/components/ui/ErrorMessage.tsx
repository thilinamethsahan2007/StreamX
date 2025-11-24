import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorMessage({ message = 'Something went wrong', onRetry }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
            <p className="text-gray-400 text-center mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-[#e50914] text-white rounded hover:bg-[#f6121d] transition"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
