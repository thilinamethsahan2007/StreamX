export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-12 w-12 border-3',
        lg: 'h-16 w-16 border-4'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-[#e50914] border-t-transparent`} />
        </div>
    );
}
