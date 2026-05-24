"use client";

import { ExperienceItem } from '@/lib/constants';

interface ExperienceProps {
    experience: ExperienceItem[];
}

const markerColors = ['marker-orange', 'marker-teal', 'marker-pink'];
const textColors = ['text-orange', 'text-teal', 'text-pink'];

export default function Experience({ experience }: ExperienceProps) {
    return (
        <section id="experience" className="container">
            <div className="section-header reveal active">
                <span className="section-label">SELECT * FROM PORTFOLIO.EXPERIENCE ORDER BY PERIOD DESC</span>
                <h2 className="section-title">MY JOURNEY.</h2>
            </div>

            <div className="timeline-container">
                {/* Vertical central path spine */}
                <div className="timeline-line"></div>

                {experience.map((item, index) => {
                    const markerColorClass = markerColors[index % markerColors.length];
                    const textColorClass = textColors[index % textColors.length];

                    return (
                        <div key={item.id} className="timeline-item reveal active">
                            {/* Date Column */}
                            <div className="timeline-meta">
                                <span className="timeline-date">{item.period}</span>
                            </div>

                            {/* Center circle spine marker */}
                            <div className={`timeline-marker ${markerColorClass}`}></div>

                            {/* Card Content Block */}
                            <div className="timeline-content-card">
                                {/* Type indicator badge */}
                                <div className="timeline-badge-card badge-pink">
                                    {item.type.toUpperCase()}
                                </div>
                                <h3 className="role-title">{item.role}</h3>
                                <div className={`company-name ${textColorClass}`}>
                                    {item.company.toUpperCase()}
                                </div>
                                <p className="role-description">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
