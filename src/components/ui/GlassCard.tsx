import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, hoverEffect = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-card rounded-3xl p-8 transition-all duration-300 ease-out border border-white/10",
                    hoverEffect && "hover:-translate-y-2 hover:border-aura-blue/50 hover:shadow-[0_0_60px_rgba(59,130,246,0.3),0_20px_60px_rgba(0,0,0,0.8)]",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
