'use client';

import { useState, useEffect } from 'react';
import { Telescope } from 'lucide-react'; // Используем ваш иконку из layout.tsx
import { motion, AnimatePresence } from 'framer-motion'; // Рекомендую для плавности

export function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Проверяем, была ли загрузка в этой сессии
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (hasVisited) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoading(false);
        } else {
            // Имитируем загрузку (например, 2 секунды)
            const timer = setTimeout(() => {
                setIsLoading(false);
                sessionStorage.setItem('hasVisited', 'true');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-background fixed inset-0 z-9999 flex flex-col items-center justify-center"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Анимированная иконка */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Telescope className="h-16 w-16 text-teal-600" />
                        </motion.div>

                        <h1 className="mt-4 text-2xl font-bold tracking-tighter">
                            GitHub Explorer
                        </h1>
                        <span className='text-muted-foreground text-sm'>by Alexey Ratnikov</span>

                        <div className="bg-muted mt-8 h-1 w-48 overflow-hidden rounded-full">
                            <motion.div
                                className="h-full bg-teal-600"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.8 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
