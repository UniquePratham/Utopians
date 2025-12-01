"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface MatrixRain {
    id: number;
    x: number;
    chars: string[];
    speed: number;
    opacity: number;
    delay: number;
}

export function MatrixRainEffect() {
    const [columns, setColumns] = useState<MatrixRain[]>([]);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const generateColumns = () => {
            const columnCount = Math.floor(window.innerWidth / 20);
            const cols: MatrixRain[] = [];
            for (let i = 0; i < columnCount; i++) {
                const chars = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () =>
                    matrixChars[Math.floor(Math.random() * matrixChars.length)]
                );
                cols.push({
                    id: i,
                    x: i * 20,
                    chars,
                    speed: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.3 + 0.1,
                    delay: Math.random() * 5,
                });
            }
            setColumns(cols);
        };

        generateColumns();
    }, []);

    if (columns.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {columns.map((column) => (
                <motion.div
                    key={column.id}
                    className="absolute top-0 text-green-500 font-mono text-sm"
                    style={{ left: column.x, opacity: column.opacity }}
                    initial={{ y: -500 }}
                    animate={{ y: "100vh" }}
                    transition={{
                        duration: 10 / column.speed,
                        repeat: Infinity,
                        ease: "linear",
                        delay: column.delay,
                    }}
                >
                    {column.chars.map((char, index) => (
                        <div
                            key={index}
                            className={index === 0 ? "text-white" : ""}
                            style={{ textShadow: index === 0 ? "0 0 10px #fff" : "0 0 5px #0f0" }}
                        >
                            {char}
                        </div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
}