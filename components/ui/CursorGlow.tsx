"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", moveCursor);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-96 h-96 pointer-events-none z-9999 mix-blend-screen"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 0.3 : 0,
            }}
        >
            <div className="w-full h-full rounded-full bg-gradient-radial from-cyan-500/50 via-purple-500/20 to-transparent blur-3xl" />
        </motion.div>
    );
}
