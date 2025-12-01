"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export function useKonamiCode(callback: () => void) {
    const [inputSequence, setInputSequence] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const newSequence = [...inputSequence, e.key].slice(-KONAMI_CODE.length);
            setInputSequence(newSequence);

            if (newSequence.join(",") === KONAMI_CODE.join(",")) {
                callback();
                setInputSequence([]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [inputSequence, callback]);
}

export function KonamiEasterEgg() {
    const [isActivated, setIsActivated] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useKonamiCode(() => {
        setIsActivated(true);
        setTimeout(() => setIsActivated(false), 5000);
    });

    // Show hint after 30 seconds on page
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 30000);
        return () => clearTimeout(timer);
    }, []);

    if (isActivated) {
        return (
            <div className="fixed inset-0 z-100 pointer-events-none flex items-center justify-center">
                <div className="absolute inset-0 bg-black/80 animate-pulse" />
                <div className="relative text-center">
                    <div className="text-6xl mb-4 animate-bounce">🎮</div>
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse">
                        KONAMI CODE ACTIVATED!
                    </h2>
                    <p className="text-xl text-cyan-400 mt-2">You found the secret! 🚀</p>
                    <div className="mt-4 flex justify-center gap-2">
                        {["⬆️", "⬆️", "⬇️", "⬇️", "⬅️", "➡️", "⬅️", "➡️", "🅱️", "🅰️"].map((emoji, i) => (
                            <span
                                key={i}
                                className="text-2xl animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-400 mt-4 text-sm">You&apos;re a true hacker! 👾</p>
                </div>
            </div>
        );
    }

    if (showHint) {
        return (
            <div className="fixed bottom-4 left-4 z-50 opacity-30 hover:opacity-100 transition-opacity">
                <p className="text-xs text-gray-500 font-mono">
                    Hint: Try the Konami code... ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA
                </p>
            </div>
        );
    }

    return null;
}
