// ==========================================================================
// NEO-BRUTALIST CUSTOM CURSOR
// ==========================================================================
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('custom-cursor-dot');
let isCursorMoving = false;

document.addEventListener('mousemove', (e) => {
    isCursorMoving = true;
    if (cursor && cursorDot) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    }
});

// Cursor Hover Effects
const hoverTargets = document.querySelectorAll('a, button, .terminal-trigger, .terminal-header, input, textarea');
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
    });
    target.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    if (cursor && cursorDot) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
    }
});
document.addEventListener('mouseenter', () => {
    if (cursor && cursorDot) {
        cursor.style.display = 'block';
        cursorDot.style.display = 'block';
    }
});

// ==========================================================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// ==========================================================================
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once revealed, no need to track it anymore
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ==========================================================================
// MOBILE MENU DRAWER
// ==========================================================================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Simple menu button animation
        const bars = mobileMenuToggle.querySelectorAll('.bar');
        if (mobileNav.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Auto-close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const bars = mobileMenuToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
}

// ==========================================================================
// TOAST NOTIFICATION & EMAIL COPIER
// ==========================================================================
const copyEmailBtn = document.getElementById('copy-email-btn');
const toast = document.getElementById('toast');

if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener('click', () => {
        const emailText = copyEmailBtn.querySelector('.btn-text').textContent;
        navigator.clipboard.writeText(emailText).then(() => {
            toast.classList.add('show');
            // Confetti explosion on successful copy!
            triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }).catch(err => {
            console.error('Error copying text to clipboard: ', err);
        });
    });
}

// ==========================================================================
// CANVAS CONFETTI SYSTEM (NEO-BRUTALIST PARTICLES)
// ==========================================================================
const canvas = document.getElementById('canvas-confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particleColors = ['#FF6B35', '#2EC4B6', '#FF3366', '#0F172A', '#F8FAFC'];

class BrutalistParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 8; // Bold chunky sizes
        this.speedX = Math.random() * 12 - 6;
        this.speedY = Math.random() * -14 - 4; // Explode upward
        this.gravity = 0.4;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 8 - 4;
        this.life = 100;
    }

    update() {
        this.x += this.speedX;
        this.speedY += this.gravity;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life -= 1.2;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        
        // Draw squares or circles randomly
        if (Math.random() > 0.5) {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

function triggerConfetti(startX, startY) {
    // Generate particles
    for (let i = 0; i < 40; i++) {
        particles.push(new BrutalistParticle(startX, startY));
    }
    
    // Start animation if not already running
    if (!animationFrameId) {
        animateParticles();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0 || particles[i].y > canvas.height) {
            particles.splice(i, 1);
        }
    }
    
    if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animateParticles);
    } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// Bind confetti triggers to primary CTA buttons
const ctaProjects = document.getElementById('hero-btn-projects');
const navCta = document.getElementById('nav-cta');
const contactForm = document.getElementById('contact-form');

if (ctaProjects) {
    ctaProjects.addEventListener('click', (e) => {
        triggerConfetti(e.clientX, e.clientY);
    });
}
if (navCta) {
    navCta.addEventListener('click', (e) => {
        triggerConfetti(e.clientX, e.clientY);
    });
}
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Standard placeholder submit trigger
        const submitBtn = document.getElementById('contact-submit');
        submitBtn.innerHTML = "MESSAGE SENT!";
        submitBtn.style.backgroundColor = "var(--color-teal)";
        submitBtn.style.color = "var(--color-navy)";
        
        // Center screen confetti explosion!
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
        
        // Reset form
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = "SEND MESSAGE";
            submitBtn.style.backgroundColor = "var(--color-navy)";
            submitBtn.style.color = "var(--color-white)";
        }, 3000);
    });
}

// ==========================================================================
// INTERACTIVE RETRO TERMINAL
// ==========================================================================
const terminalDrawer = document.getElementById('terminal-drawer');
const terminalTrigger = document.getElementById('terminal-trigger');
const terminalMinimize = document.getElementById('terminal-minimize');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const terminalLog = terminalBody.querySelector('.terminal-log');

// Open Terminal
if (terminalTrigger) {
    terminalTrigger.addEventListener('click', () => {
        terminalDrawer.classList.add('active');
        terminalTrigger.classList.add('hide');
        setTimeout(() => {
            terminalInput.focus();
        }, 100);
    });
}

// Minimize Terminal
if (terminalMinimize) {
    terminalMinimize.addEventListener('click', () => {
        terminalDrawer.classList.remove('active');
        terminalTrigger.classList.remove('hide');
    });
}

// Clicking body focuses input
if (terminalBody) {
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });
}

// Command execution registry
const commands = {
    help: () => {
        return `
Available commands:
  <span class="term-highlight">about</span>      Display brief biographical summary
  <span class="term-highlight">skills</span>     List primary technologies in the stack
  <span class="term-highlight">projects</span>   Show details of featured software products
  <span class="term-highlight">contact</span>    Get social references and communication links
  <span class="term-highlight">confetti</span>   Trigger canvas particle explosion
  <span class="term-highlight">clear</span>      Wipe the terminal screen buffer
  <span class="term-highlight">secret</span>     Execute secret subroutine
        `;
    },
    about: () => {
        return `Aryan is a full stack developer dedicated to building robust backend infrastructures and high-impact web frontends. He loves clean code, Unix shells, and bold, neo-brutalist interfaces.`;
    },
    skills: () => {
        return `
CORE STACK:
  • <span class="term-highlight">React / Next.js</span> (Expert)
  • <span class="term-highlight">TypeScript / JavaScript</span> (Expert)
  • <span class="term-highlight">Node.js / Express</span> (Advanced)
  • <span class="term-highlight">PostgreSQL / SQL</span> (Advanced)
  • <span class="term-highlight">Docker / Containers</span> (Intermediate)
  • <span class="term-highlight">AWS Cloud Services</span> (Intermediate)
        `;
    },
    projects: () => {
        return `
FEATURED PROJECTS:
  1. <span class="term-highlight">NEXUS.OS</span> - Real-time collaborative team canvas.
  2. <span class="term-highlight">KRYPTON.DB</span> - Ultra-low latency distributed key-value store.
  3. <span class="term-highlight">AURA.AI</span> - Local AI agent unit test orchestration suite.
Type their names or visit the 'Projects' section above to try live demos!
        `;
    },
    contact: () => {
        return `
COMMUNICATION NODES:
  • Email:    <span class="term-highlight">aryan@example.com</span> (Click copy button in contact section)
  • LinkedIn: <span class="term-highlight">linkedin.com/in/aryan</span>
  • GitHub:   <span class="term-highlight">github.com/aryan</span>
        `;
    },
    confetti: () => {
        triggerConfetti(window.innerWidth - 200, window.innerHeight - 200);
        return `<span class="term-success">BOOM! Confetti sequence executed successfully.</span>`;
    },
    secret: () => {
        return `
    /\\_/\\
   ( o.o )
    > ^ <
<span class="term-highlight">[ MEOW. Aryan's secret feline debugger says hello! ]</span>
        `;
    },
    clear: () => {
        terminalLog.innerHTML = '';
        return '';
    }
};

// Input execution listener
if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawInput = terminalInput.value;
            const cleanInput = rawInput.trim().toLowerCase();
            
            // Output the prompt log
            const promptLog = document.createElement('div');
            promptLog.innerHTML = `<span class="terminal-prompt">guest@aryan.dev:~$</span> <span>${rawInput}</span>`;
            terminalLog.appendChild(promptLog);
            
            // Execute or print error
            if (cleanInput) {
                if (commands[cleanInput]) {
                    const response = commands[cleanInput]();
                    if (response) {
                        const responseLog = document.createElement('div');
                        responseLog.innerHTML = response;
                        terminalLog.appendChild(responseLog);
                    }
                } else {
                    const errorLog = document.createElement('div');
                    errorLog.className = 'term-error';
                    errorLog.innerHTML = `command not found: ${rawInput}. Type <span class="term-highlight">help</span> for guidelines.`;
                    terminalLog.appendChild(errorLog);
                }
            }
            
            // Clear input & auto scroll
            terminalInput.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}
