"use client";

import { SkillItem } from '@/lib/constants';
import SkillIcon from './SkillIcons';

interface SkillsProps {
    skills: SkillItem[];
}

export default function Skills({ skills }: SkillsProps) {
    return (
        <section id="skills" className="section-skills">
            <div className="container">
                <div className="section-header dark-header reveal active">
                    <span className="section-label dark-label">SELECT * FROM PORTFOLIO.SKILLS</span>
                    <h2 className="section-title dark-title">TECH STACK.</h2>
                </div>

                <div className="skills-grid">
                    {skills.map((skill, index) => {
                        // Let's create a visual level indicator for effect
                        // e.g. 4 active blocks, 1 empty
                        const activeCount = 4;
                        
                        return (
                            <div 
                                key={skill.id} 
                                className="skill-card reveal active"
                                style={{ transitionDelay: `${index * 0.1}s` }}
                            >
                                <div className="skill-icon-wrapper">
                                    <SkillIcon name={skill.name} />
                                </div>
                                <h3 className="skill-name">{skill.name}</h3>
                                
                                {/* Segmented Level Bar */}
                                <div className="skill-level" aria-label="Level: 80%">
                                    {[...Array(5)].map((_, blockIdx) => (
                                        <div 
                                            key={blockIdx} 
                                            className={`skill-level-block ${blockIdx < activeCount ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
