"use client";

import { ProjectItem } from '@/lib/constants';

interface ProjectsProps {
    projects: ProjectItem[];
}

const thumbnailColors = ['thumbnail-orange', 'thumbnail-teal', 'thumbnail-pink'];

export default function Projects({ projects }: ProjectsProps) {
    const handleConfetti = (e: React.MouseEvent) => {
        if (window.triggerConfetti) {
            window.triggerConfetti(e.clientX, e.clientY);
        }
    };

    return (
        <section id="projects" className="container">
            <div className="section-header reveal active">
                <span className="section-label">SELECT * FROM PORTFOLIO.PROJECTS</span>
                <h2 className="section-title">FEATURED WORK.</h2>
            </div>

            <div className="projects-grid">
                {projects.map((project, index) => {
                    const colorClass = thumbnailColors[index % thumbnailColors.length];
                    // Split comma-separated tech stacks
                    const techTags = project.tech_stack
                        ? project.tech_stack.split(',').map(tag => tag.trim()).filter(Boolean)
                        : [];

                    return (
                        <div 
                            key={project.id} 
                            className="project-card reveal active" 
                            style={{ transitionDelay: `${index * 0.15}s` }}
                        >
                            {/* Checkerboard visual thumbnail header */}
                            <div className={`project-thumbnail ${colorClass}`}>
                                <div className="brutalist-grid-pattern"></div>
                                <span className="project-badge">APP_{index + 1}</span>
                                <span className="thumbnail-center-icon">
                                    {project.title.slice(0, 4)}
                                </span>
                            </div>

                            {/* Contents */}
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                
                                <div className="project-tech-tags">
                                    {techTags.map((tag, tagIdx) => (
                                        <span key={tagIdx} className="tech-tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="project-actions">
                                    {project.github_url && (
                                        <a 
                                            href={project.github_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-white project-btn"
                                            onClick={handleConfetti}
                                        >
                                            GITHUB
                                        </a>
                                    )}
                                    {project.live_url && (
                                        <a 
                                            href={project.live_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-navy project-btn"
                                            onClick={handleConfetti}
                                        >
                                            LIVE DEMO
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
