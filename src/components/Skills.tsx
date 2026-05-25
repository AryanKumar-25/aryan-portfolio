"use client";

import { SkillItem } from '@/lib/constants';
import SkillIcon from './SkillIcons';

interface SkillsProps {
    skills: SkillItem[];
}

// Canonical category display order — any unknown category falls to the end
const CATEGORY_ORDER = ['Frontend', 'Backend', 'Language', 'Database', 'Cloud', 'Tools'];

export default function Skills({ skills }: SkillsProps) {
    // Group skills by category
    const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    // Sort categories by canonical order; unknown ones append alphabetically
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a);
        const bi = CATEGORY_ORDER.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });

    return (
        <section id="skills" className="section-skills">
            <div className="container">
                <div className="section-header dark-header reveal active">
                    <span className="section-label dark-label">SELECT * FROM PORTFOLIO.SKILLS</span>
                    <h2 className="section-title dark-title">TECH STACK.</h2>
                </div>

                {sortedCategories.map((category) => (
                    <div key={category} className="skills-category-group">
                        <div className="skills-category-label">{category.toUpperCase()}</div>
                        <div className="skills-grid">
                            {grouped[category].map((skill, index) => (
                                <div
                                    key={skill.id}
                                    className="skill-card reveal active"
                                    style={{ transitionDelay: `${index * 0.07}s` }}
                                >
                                    <div className="skill-icon-wrapper">
                                        <SkillIcon name={skill.name} />
                                    </div>
                                    <h3 className="skill-name">{skill.name}</h3>

                                    {/* Segmented level bar */}
                                    <div className="skill-level" aria-label="Proficiency level">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`skill-level-block ${i < 4 ? 'active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
