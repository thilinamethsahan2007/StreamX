'use client';

import { useState, useEffect } from 'react';
import Preloader from './ui/Preloader';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Check if user has already seen the preloader in this session
        const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');

        if (hasSeenPreloader) {
            setIsLoading(false);
            setShowContent(true);
        }
    }, []);

    const handlePreloaderComplete = () => {
        sessionStorage.setItem('hasSeenPreloader', 'true');
        setIsLoading(false);
        setTimeout(() => setShowContent(true), 100);
    };

    return (
        <>
            {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
            {showContent && children}
        </>
    );
}
