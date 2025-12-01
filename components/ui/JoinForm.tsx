'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendJoinRequest } from '@/app/actions';
import { Card } from './Card';

export function JoinForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        const result = await sendJoinRequest(formData);

        if (result.success) {
            setStatus('success');
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Something went wrong.');
        }
    }

    return (
        <Card className="max-w-md mx-auto w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">Join Utopians</h3>
            {status === 'success' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 text-green-500"
                >
                    <p className="text-xl font-semibold">Request Sent!</p>
                    <p className="text-sm text-muted-foreground mt-2">We&apos;ll get back to you soon.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-4 text-sm text-cyan-500 hover:underline"
                    >
                        Send another
                    </button>
                </motion.div>
            ) : (
                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Skills / Message</label>
                        <textarea
                            name="message"
                            id="message"
                            required
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
                            placeholder="Tell us about your CTF experience..."
                        />
                    </div>

                    {status === 'error' && (
                        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-2 px-4 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
            )}
        </Card>
    );
}
