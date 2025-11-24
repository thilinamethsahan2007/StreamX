'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [phase, setPhase] = useState<'start' | 'stripes' | 'logo' | 'fade'>('start');

    useEffect(() => {
        const timer1 = setTimeout(() => setPhase('stripes'), 100);
        const timer2 = setTimeout(() => setPhase('logo'), 1800);
        const timer3 = setTimeout(() => setPhase('fade'), 3200);
        const timer4 = setTimeout(() => onComplete(), 3700);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onComplete]);

    const stripes = [
        { delay: 0, color: '#e50914' },
        { delay: 0.05, color: '#ff1a1a' },
        { delay: 0.1, color: '#cc0000' },
        { delay: 0.15, color: '#e50914' },
        { delay: 0.2, color: '#ff3333' },
        { delay: 0.25, color: '#b30000' },
        { delay: 0.3, color: '#e50914' },
    ];

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'fade' ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
            <div className="absolute inset-0 flex">
                {stripes.map((stripe, i) => (
                    <motion.div
                        key={i}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={
                            phase === 'stripes' || phase === 'logo'
                                ? { scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
                                : { scaleY: 0, opacity: 0 }
                        }
                        transition={{
                            duration: 1.8,
                            delay: stripe.delay,
                            times: [0, 0.3, 0.7, 1],
                            ease: [0.87, 0, 0.13, 1],
                        }}
                        className="flex-1 h-full"
                        style={{
                            backgroundColor: stripe.color,
                            transformOrigin: 'center',
                            boxShadow: `0 0 30px ${stripe.color}80`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                    phase === 'logo'
                        ? { opacity: [0, 1, 1], scale: [0.8, 1, 1] }
                        : phase === 'fade'
                            ? { opacity: 0, scale: 1.1 }
                            : { opacity: 0, scale: 0.8 }
                }
                transition={{
                    duration: phase === 'logo' ? 0.6 : 0.5,
                    ease: 'easeOut',
                }}
                className="relative z-20 px-4"
            >
                <h1
                    className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black text-[#e50914] tracking-tighter select-none"
                    style={{
                        textShadow: '0 0 40px rgba(229, 9, 20, 0.9), 0 0 80px rgba(229, 9, 20, 0.5)',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                        WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    STREAMX
                </h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={
                        phase === 'logo'
                            ? { opacity: [0, 0.5, 0.3], scale: [0.5, 1.2, 1.5] }
                            : { opacity: 0 }
                    }
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    className="absolute inset-0 bg-[#e50914] blur-[40px] md:blur-[80px] -z-10"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={phase === 'logo' ? { opacity: [0, 0.4, 0] } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute inset-0 bg-white pointer-events-none mix-blend-screen"
            />

            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={
                    phase === 'logo'
                        ? { scale: [0, 2, 2.5], opacity: [0, 0.2, 0] }
                        : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div
                    className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] rounded-full border-[3px] sm:border-[4px] md:border-[6px]"
                    style={{
                        borderColor: '#e50914',
                        boxShadow: '0 0 60px rgba(229, 9, 20, 0.6)',
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
