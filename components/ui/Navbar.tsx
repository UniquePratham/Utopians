'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Home', href: '#' },
        { name: 'Stats', href: '#stats' },
        { name: 'Team', href: '#team' },
        { name: 'CTFs', href: '#ctfs' },
        { name: 'Join', href: '#join' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border-b border-white/10"
        >
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-500 to-blue-600">
                Utopians
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm font-medium hover:text-cyan-500 transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 md:hidden shadow-lg"
                >
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium hover:text-cyan-500 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </motion.div>
            )}
        </motion.nav>
    );
}
