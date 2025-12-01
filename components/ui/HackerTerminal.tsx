"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, X, Minus, Square } from "lucide-react";

const hackerLines = [
    "$ whoami",
    "utopians@ctf-team",
    "$ cat /etc/team-info",
    "Team: Utopians",
    "University: University of Calcutta",
    "Specialty: Web, Crypto, Pwn, Rev",
    "$ ls -la achievements/",
    "total 20",
    "drwxr-xr-x  2 utopians ctf   4096 Jan 01 2025 .",
    "drwxr-xr-x 10 utopians ctf   4096 Jan 01 2025 ..",
    "-rw-r--r--  1 utopians ctf    256 Dec 15 2024 first-blood.txt",
    "-rw-r--r--  1 utopians ctf    512 Nov 20 2024 top-100.flag",
    "-rw-r--r--  1 utopians ctf   1024 Oct 10 2024 team-spirit.md",
    "$ echo $MOTTO",
    "\"We hack, therefore we are.\"",
    "$ ./join-us.sh",
    "Welcome to Utopians! 🚀",
    "$ _",
];

export function HackerTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentLineIndex >= hackerLines.length) {
            setIsTyping(false);
            return;
        }

        const currentLine = hackerLines[currentLineIndex];
        const isCommand = currentLine.startsWith("$");
        const delay = isCommand ? 80 : 30;

        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex <= currentLine.length) {
                setLines((prev) => {
                    const newLines = [...prev];
                    newLines[currentLineIndex] = currentLine.slice(0, charIndex);
                    return newLines;
                });
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    setCurrentLineIndex((prev) => prev + 1);
                }, isCommand ? 500 : 200);
            }
        }, delay);

        return () => clearInterval(typeInterval);
    }, [currentLineIndex]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    const handleRestart = () => {
        setLines([]);
        setCurrentLineIndex(0);
        setIsTyping(true);
    };

    if (isMinimized) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed bottom-4 right-4 z-50"
            >
                <button
                    onClick={() => setIsMinimized(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-gray-800 transition-colors"
                >
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm">Terminal</span>
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
            <div className="bg-gray-950/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-300 font-mono">utopians@ctf</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                        >
                            <Minus className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                            onClick={handleRestart}
                            className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                            title="Restart"
                        >
                            <Square className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-1 hover:bg-red-500/50 rounded transition-colors"
                        >
                            <X className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Terminal Content */}
                <div
                    ref={terminalRef}
                    className="p-4 h-64 overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent"
                >
                    {lines.map((line, index) => (
                        <div
                            key={index}
                            className={`${line.startsWith("$")
                                    ? "text-green-400"
                                    : line.startsWith("total") || line.startsWith("drwx") || line.startsWith("-rw")
                                        ? "text-blue-400"
                                        : "text-gray-300"
                                }`}
                        >
                            {line}
                            {index === currentLineIndex && isTyping && (
                                <span className="animate-pulse text-cyan-400">█</span>
                            )}
                        </div>
                    ))}
                    {!isTyping && (
                        <div className="mt-2 text-cyan-400 animate-pulse">
                            Type &apos;./join-us.sh&apos; to join the team! █
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
