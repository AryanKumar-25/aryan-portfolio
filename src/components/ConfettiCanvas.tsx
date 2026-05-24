"use client";

import { useEffect, useRef } from 'react';

// Declare global interface to extend window definitions without TS conflicts
declare global {
    interface Window {
        triggerConfetti?: (x: number, y: number) => void;
    }
}

export default function ConfettiCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Method receives precise client pointer coordinates on trigger
        window.triggerConfetti = (startX: number, startY: number) => {
            const container = containerRef.current;
            if (!container) return;

            // Spawns 35 snappy, dynamic radial burst particles
            const particleCount = 35;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'confetti-particle';

                // 1. Curated site color palette (Orange, Teal, Pink, White, Dark Navy)
                const colors = ['#FF6B35', '#2EC4B6', '#FF3366', '#FFFFFF', '#0F172A'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                // 2. Set random sizes between 6px and 14px
                const size = Math.random() * 8 + 6; // 6px to 14px

                // 3. Spawns exactly at client coordinates
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                
                // Centering offsets
                particle.style.marginLeft = -size / 2 + 'px';
                particle.style.marginTop = -size / 2 + 'px';

                // 4. Geometry calculations: 360-degree outward trajectory
                const angle = Math.random() * Math.PI * 2; // Radian projection
                const distance = Math.random() * 250 + 150; // Random distance (150px to 400px)
                
                const burstX = Math.cos(angle) * distance;
                const burstY = Math.sin(angle) * distance;

                // 5. Downward arcing gravity pull (150px to 300px drop during Stage 2)
                const gravityY = Math.random() * 150 + 150; 

                // 6. Tumbling rotation (up to 720 degrees)
                const rotateDeg = (Math.random() * 720) + 'deg';

                // 7. Fast and snappy duration (between 0.8s and 1.4s)
                const duration = Math.random() * 0.6 + 0.8;

                // Apply styling properties
                particle.style.backgroundColor = randomColor;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Mix shape forms (squares & circles)
                particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%'; 

                // Inject CSS variable mappings for GPU-accelerated keyframe interpolation
                particle.style.setProperty('--burst-x', burstX + 'px');
                particle.style.setProperty('--burst-y', burstY + 'px');
                particle.style.setProperty('--gravity-y', gravityY + 'px');
                particle.style.setProperty('--rotate-deg', rotateDeg);

                // Set computed animation duration
                particle.style.animationDuration = duration + 's';

                // Cleanly purge element from DOM immediately after snappy animation cycles complete
                particle.addEventListener('animationend', () => {
                    particle.remove();
                });

                container.appendChild(particle);
            }
        };

        return () => {
            window.triggerConfetti = undefined;
        };
    }, []);

    return <div ref={containerRef} className="confetti-container" id="confetti-container" />;
}
