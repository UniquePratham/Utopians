"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Trophy, MapPin } from "lucide-react";
import Image from "next/image";

interface CTF {
    event: string;
    place: string;
    points: string;
    logo?: string;
}

interface CTFCarouselProps {
    ctfs: CTF[];
}

export function CTFCarousel({ ctfs }: CTFCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
        }),
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            let next = prev + newDirection;
            if (next < 0) next = ctfs.length - 1;
            if (next >= ctfs.length) next = 0;
            return next;
        });
    };

    const currentCTF = ctfs[currentIndex];
    const place = parseInt(currentCTF.place);
    const isTop10 = place <= 10;
    const isTop50 = place <= 50;
    const isTop100 = place <= 100;

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Navigation Buttons */}
            <button
                onClick={() => paginate(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-gray-800/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => paginate(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-gray-800/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Card */}
            <div className="overflow-hidden rounded-2xl">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className={`relative p-8 rounded-2xl border ${isTop10
                        ? "bg-linear-to-br from-yellow-500/20 to-amber-500/10 border-yellow-500/50"
                        : isTop50
                            ? "bg-linear-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/50"
                            : isTop100
                                ? "bg-linear-to-br from-purple-500/20 to-pink-500/10 border-purple-500/50"
                                : "bg-linear-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50"
                        }`}
                >
                    {/* Badge */}
                    {isTop100 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold ${isTop10
                                ? "bg-yellow-500 text-black"
                                : isTop50
                                    ? "bg-cyan-500 text-black"
                                    : "bg-purple-500 text-white"
                                }`}
                        >
                            {isTop10 ? "🏆 TOP 10" : isTop50 ? "⭐ TOP 50" : "🎯 TOP 100"}
                        </motion.div>
                    )}

                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-800/50 flex items-center justify-center shrink-0"
                        >
                            {currentCTF.logo ? (
                                <Image
                                    src={`/ctf-logos/${currentCTF.logo}`}
                                    alt={currentCTF.event}
                                    width={96}
                                    height={96}
                                    className="object-contain p-2"
                                />
                            ) : (
                                <Trophy className="w-12 h-12 text-gray-600" />
                            )}
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1">
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl font-bold text-white mb-2"
                            >
                                {currentCTF.event}
                            </motion.h3>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-4 text-sm"
                            >
                                <span className={`flex items-center gap-1 ${isTop10 ? "text-yellow-400" : isTop50 ? "text-cyan-400" : "text-gray-400"
                                    }`}>
                                    <Trophy className="w-4 h-4" />
                                    Rank #{currentCTF.place}
                                </span>
                                <span className="flex items-center gap-1 text-green-400">
                                    <MapPin className="w-4 h-4" />
                                    {currentCTF.points} pts
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
                {ctfs.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                            ? "bg-cyan-400 w-6"
                            : "bg-gray-600 hover:bg-gray-500"
                            }`}
                    />
                ))}
            </div>

            {/* Counter */}
            <p className="text-center mt-2 text-gray-500 text-sm">
                {currentIndex + 1} / {ctfs.length}
            </p>
        </div>
    );
}
