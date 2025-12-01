'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/40",
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([newX, newY]) =>
              `radial-gradient(600px circle at ${newX}px ${newY}px, rgba(14, 165, 233, 0.15), transparent 40%)`
          ),
        }}
      />
    </motion.div>
  );
}
