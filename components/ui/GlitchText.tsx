"use client";

import { motion } from "framer-motion";

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
    return (
        <motion.span
            className={`relative inline-block ${className}`}
            whileHover="hover"
        >
            {/* Base text */}
            <span className="relative z-10">{text}</span>

            {/* Glitch layers */}
            <motion.span
                className="absolute inset-0 text-cyan-400 z-0"
                variants={{
                    hover: {
                        x: [0, -2, 2, -2, 0],
                        opacity: [0, 1, 1, 1, 0],
                    },
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
                aria-hidden
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute inset-0 text-pink-500 z-0"
                variants={{
                    hover: {
                        x: [0, 2, -2, 2, 0],
                        opacity: [0, 1, 1, 1, 0],
                    },
                }}
                transition={{ duration: 0.3, repeat: Infinity, delay: 0.05 }}
                aria-hidden
            >
                {text}
            </motion.span>
        </motion.span>
    );
}
