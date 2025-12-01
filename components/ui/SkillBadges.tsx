"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Skill {
    name: string;
    color: string;
    description: string;
}

const skills: Skill[] = [
    { name: "Web Exploitation", color: "from-cyan-500 to-blue-500", description: "XSS, SQLi, SSRF, CSRF & more" },
    { name: "Cryptography", color: "from-purple-500 to-pink-500", description: "RSA, AES, Hash attacks" },
    { name: "Binary Exploitation", color: "from-red-500 to-orange-500", description: "Buffer overflow, ROP chains" },
    { name: "Reverse Engineering", color: "from-green-500 to-emerald-500", description: "x86, ARM, Malware analysis" },
    { name: "Forensics", color: "from-yellow-500 to-amber-500", description: "Memory, Disk, Network forensics" },
    { name: "OSINT", color: "from-blue-500 to-indigo-500", description: "Open source intelligence" },
    { name: "Steganography", color: "from-pink-500 to-rose-500", description: "Hidden data extraction" },
    { name: "Miscellaneous", color: "from-gray-500 to-slate-500", description: "Creative problem solving" },
];

export function SkillBadges() {
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill, index) => (
                    <motion.button
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSkill(activeSkill?.name === skill.name ? null : skill)}
                        className={`relative px-4 py-2 rounded-full text-sm font-medium text-white bg-linear-to-r ${skill.color} 
              shadow-lg hover:shadow-xl transition-shadow cursor-pointer
              ${activeSkill?.name === skill.name ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""}`}
                    >
                        {skill.name}
                        <motion.span
                            className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                        />
                    </motion.button>
                ))}
            </div>

            {/* Skill Description Popup */}
            <motion.div
                initial={false}
                animate={{
                    opacity: activeSkill ? 1 : 0,
                    y: activeSkill ? 0 : -10,
                    height: activeSkill ? "auto" : 0,
                }}
                className="mt-4 overflow-hidden"
            >
                {activeSkill && (
                    <div className={`p-4 rounded-lg bg-linear-to-r ${activeSkill.color} bg-opacity-20 border border-white/20`}>
                        <p className="text-white text-center">
                            <span className="font-bold">{activeSkill.name}:</span> {activeSkill.description}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
