"use client";

import React, { memo, forwardRef } from "react";
import { LiquidMetal as LiquidMetalShader } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

// ============================================================================
// LiquidMetal - Base shader wrapper component
// ============================================================================

export interface LiquidMetalProps {
    /** Base background color of the liquid metal */
    colorBack?: string;
    /** Tint/highlight color for the chrome effect */
    colorTint?: string;
    /** Animation speed (0.1 - 2.0 recommended) */
    speed?: number;
    /** Pattern complexity/repetition (1 - 10) */
    repetition?: number;
    /** Wave distortion amount (0 - 1) */
    distortion?: number;
    /** Texture scale */
    scale?: number;
    /** Additional CSS classes */
    className?: string;
    /** Inline styles */
    style?: React.CSSProperties;
}

export const LiquidMetal = memo(function LiquidMetal({
    colorBack = "#aaaaac",
    colorTint = "#ffffff",
    speed = 0.5,
    repetition = 4,
    distortion = 0.1,
    scale = 1,
    className,
    style,
}: LiquidMetalProps) {
    return (
        <div
            className={cn("absolute inset-0 z-0 overflow-hidden", className)}
            style={style}
        >
            <LiquidMetalShader
                colorBack={colorBack}
                colorTint={colorTint}
                speed={speed}
                repetition={repetition}
                distortion={distortion}
                softness={0}
                shiftRed={0.3}
                shiftBlue={-0.3}
                angle={45}
                shape="none"
                scale={scale}
                fit="cover"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
});

LiquidMetal.displayName = "LiquidMetal";

// ============================================================================
// LiquidMetalButton - Premium button with liquid metal border effect
// ============================================================================

export interface LiquidMetalButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button content */
    children: React.ReactNode;
    /** Optional icon displayed on the left */
    icon?: React.ReactNode;
    /** Border width in pixels */
    borderWidth?: number;
    /** Configuration for the LiquidMetal shader */
    metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
    /** Size variant */
    size?: "sm" | "md" | "lg";
}

export const LiquidMetalButton = forwardRef<
    HTMLButtonElement,
    LiquidMetalButtonProps
>(
    (
        {
            children,
            icon,
            borderWidth = 4,
            metalConfig,
            size = "md",
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const sizeStyles = {
            sm: "py-2 pl-2 pr-6 gap-3 text-sm",
            md: "py-3 pl-3 pr-8 gap-4 text-base",
            lg: "py-4 pl-4 pr-10 gap-6 text-lg",
        };

        const iconSizes = {
            sm: "w-8 h-8",
            md: "w-10 h-10",
            lg: "w-12 h-12",
        };

        return (
            <button
                ref={ref}
                disabled={disabled}
                className={cn(
                    "relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                    className
                )}
                {...props}
            >
                <div
                    className="relative rounded-full overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
                    style={{ padding: borderWidth }}
                >
                    {/* Liquid Metal Border Layer */}
                    <LiquidMetal
                        colorBack={metalConfig?.colorBack ?? "#888888"}
                        colorTint={metalConfig?.colorTint ?? "#ffffff"}
                        speed={metalConfig?.speed ?? 0.4}
                        repetition={metalConfig?.repetition ?? 4}
                        distortion={metalConfig?.distortion ?? 0.15}
                        scale={metalConfig?.scale ?? 1}
                        className="absolute inset-0 z-0 rounded-full"
                    />

                    {/* Inner Button Body */}
                    <div
                        className={cn(
                            "relative z-10 rounded-full flex items-center",
                            "bg-white dark:bg-black",
                            "transition-colors duration-200",
                            "group-hover:bg-neutral-50 dark:group-hover:bg-neutral-900",
                            sizeStyles[size]
                        )}
                    >
                        {icon && (
                            <div
                                className={cn(
                                    "rounded-full flex items-center justify-center",
                                    "bg-neutral-100 dark:bg-neutral-800",
                                    "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
                                    iconSizes[size]
                                )}
                            >
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {icon}
                                </span>
                            </div>
                        )}
                        <span className="font-medium tracking-tight text-neutral-900 dark:text-white">
                            {children}
                        </span>
                    </div>
                </div>
            </button>
        );
    }
);

LiquidMetalButton.displayName = "LiquidMetalButton";

export default LiquidMetalButton;
