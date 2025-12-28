"use client"

import React, { useState, useRef } from 'react';
import {
    motion,
    useMotionValue,
    useMotionTemplate,
    useAnimationFrame
} from "framer-motion";
import { cn } from '@/lib/utils';

/**
 * Helper component for the SVG grid pattern.
 */
const GridPattern = ({ offsetX, offsetY, size }: { offsetX: any; offsetY: any; size: number }) => {
    return (
        <svg className="w-full h-full">
            <defs>
                <motion.pattern
                    id="grid-pattern"
                    width={size}
                    height={size}
                    patternUnits="userSpaceOnUse"
                    x={offsetX}
                    y={offsetY}
                >
                    <path
                        d={`M ${size} 0 L 0 0 0 ${size}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-primary/20"
                    />
                </motion.pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
    );
};

interface InfiniteGridProps {
    children?: React.ReactNode;
    className?: string;
    gridSize?: number;
    showControls?: boolean;
    spotlightSize?: number;
}

/**
 * The Infinite Grid Component
 * Displays a scrolling background grid that reveals an active layer on mouse hover.
 */
export function InfiniteGrid({
    children,
    className,
    gridSize: initialGridSize = 50,
    showControls = false,
    spotlightSize = 300
}: InfiniteGridProps) {
    const [gridSize, setGridSize] = useState(initialGridSize);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track mouse position with Motion Values for performance
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    // Grid offsets for infinite scroll animation
    const gridOffsetX = useMotionValue(0);
    const gridOffsetY = useMotionValue(0);

    const speedX = 0.3;
    const speedY = 0.3;

    useAnimationFrame(() => {
        const currentX = gridOffsetX.get();
        const currentY = gridOffsetY.get();
        gridOffsetX.set((currentX + speedX) % gridSize);
        gridOffsetY.set((currentY + speedY) % gridSize);
    });

    // Create a dynamic radial mask for the "flashlight" effect
    const maskImage = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative w-full overflow-hidden bg-background",
                className
            )}
        >
            {/* Layer 1: Subtle background grid (always visible) */}
            <div className="absolute inset-0 z-0 opacity-[0.03]">
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
            </div>

            {/* Layer 2: Highlighted grid (revealed by mouse mask) */}
            <motion.div
                className="absolute inset-0 z-0 opacity-30"
                style={{ maskImage, WebkitMaskImage: maskImage }}
            >
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Optional Grid Density Control Panel */}
            {showControls && (
                <div className="absolute bottom-10 right-10 z-30 pointer-events-auto">
                    <div className="bg-background/80 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl space-y-3 min-w-[200px]">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            Grid Density
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={gridSize}
                            onChange={(e) => setGridSize(Number(e.target.value))}
                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                            <span>Dense</span>
                            <span>Sparse ({gridSize}px)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InfiniteGrid;
