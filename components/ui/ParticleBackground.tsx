"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const colors = ["#06b6d4", "#8b5cf6", "#3b82f6", "#10b981"];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            const particles: Particle[] = [];
            const count = Math.floor((window.innerWidth * window.innerHeight) / 15000);

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
            return particles;
        };

        const drawParticle = (p: Particle) => {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
            ctx.fill();
        };

        const drawConnections = (particles: Particle[]) => {
            if (!ctx) return;
            const maxDistance = 150;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.2;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const dx = particles[i].x - mouseRef.current.x;
                const dy = particles[i].y - mouseRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    const opacity = (1 - distance / 200) * 0.4;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.stroke();
                }
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Mouse interaction - particles move away slightly
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    p.vx += (dx / distance) * force * 0.02;
                    p.vy += (dy / distance) * force * 0.02;
                }

                // Dampen velocity
                p.vx *= 0.99;
                p.vy *= 0.99;

                drawParticle(p);
            });

            drawConnections(particlesRef.current);
            animationRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        resize();
        particlesRef.current = createParticles();
        animate();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-20 pointer-events-none opacity-60"
        />
    );
}
