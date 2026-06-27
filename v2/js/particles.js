// Particle system
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    const duration = Math.random() * 10 + 10;
    particle.style.animationDuration = duration + 's';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 10 + 's';
    
    // Random color from theme
    const colors = [
        'var(--accent)',
        'var(--accent-secondary)',
        'var(--accent-tertiary)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    return particle;
}

// Initialize particles
function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        particlesContainer.appendChild(particle);
    }
}

// Mouse interaction with particles
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left / window.innerWidth;
        const particleY = rect.top / window.innerHeight;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - particleX, 2) + 
            Math.pow(mouseY - particleY, 2)
        );
        
        if (distance < 0.1) {
            particle.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px)`;
            particle.style.opacity = '1';
        }
    });
});

// Initialize on load
if (particlesContainer) {
    initParticles();
}

// Add click burst effect
document.addEventListener('click', (e) => {
    const burstCount = 10;
    
    for (let i = 0; i < burstCount; i++) {
        const particle = createParticle();
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.position = 'fixed';
        particle.style.pointerEvents = 'none';
        
        const angle = (Math.PI * 2 * i) / burstCount;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.animation = 'none';
        particle.style.transition = 'all 0.5s ease-out';
        
        document.body.appendChild(particle);
        
        requestAnimationFrame(() => {
            particle.style.transform = `translate(${vx}px, ${vy}px)`;
            particle.style.opacity = '0';
        });
        
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
});
