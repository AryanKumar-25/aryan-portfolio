"use client";

const techItems = [
    "NEXT.JS", "TYPESCRIPT", "REACT", "NODE.JS", "POSTGRESQL", "DOCKER", "AWS", "GOLANG"
];

export default function Marquee() {
    return (
        <div className="marquee-belt">
            <div className="marquee-content">
                {/* Loop items multiple times to fill infinite scroll span */}
                {[...Array(4)].map((_, loopIdx) => (
                    <span key={loopIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '30px' }}>
                        {techItems.map((tech, idx) => (
                            <span key={`${loopIdx}-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '30px' }}>
                                <span>{tech}</span>
                                <span className={
                                    idx % 3 === 0 ? "dot-orange" : idx % 3 === 1 ? "dot-teal" : "dot-pink"
                                }></span>
                            </span>
                        ))}
                    </span>
                ))}
            </div>
        </div>
    );
}
