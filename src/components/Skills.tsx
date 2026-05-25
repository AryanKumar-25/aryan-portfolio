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
                    {skills.map((skill, index) => (
                        <div
                            key={skill.id}
                            className="skill-card reveal active"
                            style={{ transitionDelay: `${index * 0.07}s` }}
                        >
                            <div className="skill-icon-wrapper">
                                <SkillIcon name={skill.name} />
                            </div>
                            <h3 className="skill-name">{skill.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
