"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FloatingCard({ children, className = "", delay = 0 }: FloatingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay }}
            whileHover={{
                y: -10,
                transition: { duration: 0.3 }
            }}
            className={`relative group ${className}`}
        >
            {/* Animated border gradient */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

            {/* Card content */}
            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 h-full">
                {children}
            </div>
        </motion.div>
    );
}

interface TiltCardProps {
    children: ReactNode;
    className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
    return (
        <motion.div
            className={`relative ${className}`}
            whileHover={{ scale: 1.02 }}
            style={{ transformStyle: "preserve-3d" }}
        >
            <motion.div
                className="relative"
                whileHover={{
                    rotateX: [-2, 2],
                    rotateY: [-2, 2],
                }}
                transition={{
                    rotateX: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
                    rotateY: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
