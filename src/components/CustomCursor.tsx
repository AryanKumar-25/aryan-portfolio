"use client";

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run on devices with fine pointer (mice)
        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!mediaQuery.matches) return;

        setIsVisible(true);

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseLeaveWindow = () => setIsVisible(false);
        const handleMouseEnterWindow = () => setIsVisible(true);

        const addHoverListeners = () => {
            const targets = document.querySelectorAll('a, button, input, textarea, select, .terminal-trigger, .terminal-header, [role="button"]');
            targets.forEach(target => {
                target.addEventListener('mouseenter', () => setIsHovered(true));
                target.addEventListener('mouseleave', () => setIsHovered(false));
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeaveWindow);
        document.addEventListener('mouseenter', handleMouseEnterWindow);
        
        // Setup initial hover listeners
        addHoverListeners();

        // Periodically verify hover targets since DOM contents can change dynamically
        const interval = setInterval(addHoverListeners, 2000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeaveWindow);
            document.removeEventListener('mouseenter', handleMouseEnterWindow);
            clearInterval(interval);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <div 
                className={`custom-cursor ${isHovered ? 'hover' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            />
            <div 
                className="custom-cursor-dot"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            />
        </>
    );
}
