import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'red' | 'orange' | 'green' | 'default';
    className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        red: "bg-[#e50914] text-white",
        orange: "bg-orange-600 text-white",
        green: "bg-green-600 text-white",
        default: "bg-gray-600/80 text-white backdrop-blur-sm"
    };

    return (
        <span className={cn(
            "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
