(function() {
    const styles = [
        'color: #00ff00',
        'font-family: monospace',
        'font-size: 14px',
        'font-weight: bold',
        'text-shadow: 0 0 5px #00ff00'
    ].join(';');
    
    const titleStyles = [
        'color: #00ff00',
        'font-family: monospace',
        'font-size: 20px',
        'font-weight: bold',
        'text-shadow: 0 0 10px #00ff00'
    ].join(';');
    
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const hotkey = isMac ? 'Cmd + K' : 'Ctrl + K';
    
    console.log('%c⚠️  UNAUTHORIZED ACCESS DETECTED...', styles);
    console.log('%cJust kidding! Welcome, fellow developer. 👨‍💻', styles);
    console.log('%c', 'color: #00ff00; font-family: monospace;');
    console.log('%c> You\'ve found the hidden terminal.', styles);
    console.log('%c> Want to explore more?', styles);
    console.log('%c', 'color: #00ff00; font-family: monospace;');
    console.log(`%c📟 Press ${hotkey} to access the Matrix Terminal`, 'color: #00ff00; font-family: monospace; font-size: 16px; font-weight: bold; background: #0a0a0a; padding: 5px;');
    console.log('%c', 'color: #00ff00; font-family: monospace;');
    console.log('%cType "help" for available commands once inside.', 'color: #00ff00; font-family: monospace; font-style: italic;');
})();

function initNeuralNetwork() {
    if (typeof THREE === 'undefined') {
        return;
    }
    
    const canvas = document.getElementById('neural-network-canvas');
    if (!canvas) {
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    const nodes = [];
    const isMobile = window.innerWidth <= 768;
    const nodeCount = isMobile ? 30 : 50;
    const nodeGeometry = new THREE.SphereGeometry(0.3, isMobile ? 8 : 16, isMobile ? 8 : 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8
    });

    for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.x = (Math.random() - 0.5) * 80;
        node.position.y = (Math.random() - 0.5) * 60;
        node.position.z = (Math.random() - 0.5) * 40;
        
        node.userData.velocity = {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        };
        
        scene.add(node);
        nodes.push(node);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.2
    });

    function updateConnections() {
        const linesToRemove = scene.children.filter(child => child.type === 'Line');
        linesToRemove.forEach(line => scene.remove(line));

        const maxDistance = 15;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                
                if (distance < maxDistance) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        nodes[i].position,
                        nodes[j].position
                    ]);
                    
                    const material = lineMaterial.clone();
                    material.opacity = 0.3 * (1 - distance / maxDistance);
                    
                    const line = new THREE.Line(geometry, material);
                    scene.add(line);
                }
            }
        }
    }

    const particleCount = isMobile ? 50 : 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions.push(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 50
        );
    }
    
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xec4899,
        size: 0.5,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        nodes.forEach(node => {
            node.position.x += node.userData.velocity.x;
            node.position.y += node.userData.velocity.y;
            node.position.z += node.userData.velocity.z;

            const bounds = { x: 40, y: 30, z: 20 };
            if (Math.abs(node.position.x) > bounds.x) node.userData.velocity.x *= -1;
            if (Math.abs(node.position.y) > bounds.y) node.userData.velocity.y *= -1;
            if (Math.abs(node.position.z) > bounds.z) node.userData.velocity.z *= -1;

            const scale = 1 + Math.sin(frameCount * 0.02 + node.position.x) * 0.2;
            node.scale.set(scale, scale, scale);

            const hue = (frameCount * 0.001 + node.position.x * 0.01) % 1;
            node.material.color.setHSL(0.65 + hue * 0.1, 0.8, 0.6);
        });

        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0003;

        const updateFrequency = isMobile ? 5 : 3;
        if (frameCount % updateFrequency === 0) {
            updateConnections();
        }

        camera.position.x = Math.sin(frameCount * 0.0003) * 5;
        camera.position.y = Math.cos(frameCount * 0.0004) * 3;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);
    
    updateConnections();
    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNeuralNetwork);
} else {
    initNeuralNetwork();
}

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateStats() {
    if (hasAnimated) return;

    const statsSection = document.querySelector('.about-stats');
    const statsSectionTop = statsSection.offsetTop;
    const statsSectionHeight = statsSection.offsetHeight;
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;

    if (scrollY > statsSectionTop - windowHeight + statsSectionHeight / 2) {
        hasAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + suffix;
                }
            };

            updateCounter();
        });
    }
}

window.addEventListener('scroll', animateStats);

const typingElement = document.querySelector('.typing-animation');
if (typingElement) {
    const text = typingElement.textContent;
    typingElement.textContent = 'S';
    let index = 1;

    function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 500);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

    contactForm.reset();
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const isMobile = window.innerWidth <= 768;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: isMobile ? '80px' : '100px',
        right: isMobile ? '50%' : '20px',
        transform: isMobile ? 'translateX(50%)' : 'none',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: isMobile ? '0.8rem 1.5rem' : '1rem 2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: isMobile ? 'fadeIn 0.3s ease' : 'slideIn 0.3s ease',
        maxWidth: isMobile ? 'calc(100% - 32px)' : '400px',
        fontSize: isMobile ? '0.9rem' : '1rem',
        textAlign: 'center'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = isMobile ? 'fadeOut 0.3s ease' : 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateX(50%) translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(50%) translateY(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(50%) translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content, .gradient-circle');
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('gradient-circle') ? 0.3 : 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.className = 'dark-mode-toggle';
    
    Object.assign(toggle.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'var(--transition-medium)'
    });

    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
    });

    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    highlightNavigation();
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedHighlight = debounce(highlightNavigation, 10);
const debouncedStats = debounce(animateStats, 10);

window.removeEventListener('scroll', highlightNavigation);
window.removeEventListener('scroll', animateStats);
window.addEventListener('scroll', debouncedHighlight);
window.addEventListener('scroll', debouncedStats);

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';

class MatrixTerminal {
    constructor() {
        this.terminal = document.getElementById('matrix-terminal');
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.closeBtn = document.getElementById('terminal-close');
        this.history = [];
        this.historyIndex = -1;
        this.isFirstOpen = !localStorage.getItem('terminal-opened');
        
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            
            if (e.key === 'Escape' && !this.terminal.classList.contains('terminal-hidden')) {
                this.close();
            }
        });
        
        this.closeBtn.addEventListener('click', () => this.close());
        
        this.terminal.addEventListener('click', (e) => {
            if (e.target === this.terminal) {
                this.close();
            }
        });
        
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            }
        });
    }
    
    toggle() {
        if (this.terminal.classList.contains('terminal-hidden')) {
            this.open();
        } else {
            this.close();
        }
    }
    
    open() {
        this.terminal.classList.remove('terminal-hidden');
        this.input.focus();
        
        if (this.isFirstOpen) {
            this.showWelcome();
            localStorage.setItem('terminal-opened', 'true');
            this.isFirstOpen = false;
        }
    }
    
    close() {
        this.terminal.classList.add('terminal-hidden');
    }
    
    showWelcome() {
        this.printLine(`
╔══════════════════════════════════════════════════════╗
║  SYSTEM ACCESS GRANTED - WELCOME TO THE MATRIX       ║
╚══════════════════════════════════════════════════════╝

Initializing Najam's Portfolio Terminal v1.0...

Type 'help' to see available commands.
`, 'terminal-success');
    }
    
    printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }
    
    printCommand(command) {
        this.printLine(`> ${command}`, 'terminal-command');
    }
    
    scrollToBottom() {
        const terminalBody = document.getElementById('terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    clearScreen() {
        this.output.innerHTML = '';
    }
    
    executeCommand(input) {
        this.printCommand(input);
        
        const [command, ...args] = input.toLowerCase().split(' ');
        
        const commands = {
            help: () => this.cmdHelp(),
            about: () => this.cmdAbout(),
            skills: () => this.cmdSkills(),
            projects: () => this.cmdProjects(),
            contact: () => this.cmdContact(),
            clear: () => this.clearScreen(),
            cls: () => this.clearScreen(),
            exit: () => this.close(),
            whoami: () => this.cmdWhoami(),
            ls: () => this.cmdLs(),
            hack: () => this.cmdHack(),
            sudo: () => this.cmdSudo(),
            cd: () => this.cmdCd(args[0]),
        };
        
        if (commands[command]) {
            commands[command]();
        } else {
            this.printLine(`Command not found: ${command}`, 'terminal-error');
            this.printLine(`Type 'help' for available commands.`);
        }
    }
    
    cmdHelp() {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const hotkey = isMac ? 'Cmd+K' : 'Ctrl+K';
        
        this.printLine(`
╔══════════════════════════════════════════════════════╗
║                  AVAILABLE COMMANDS                   ║
╚══════════════════════════════════════════════════════╝

Navigation:
  help              Show this help message
  about             Learn about Najam
  skills            View technical skills
  projects          See featured projects
  contact           Get contact information
  cd <section>      Navigate to a section
  
System:
  clear / cls       Clear the terminal
  exit              Close terminal
  
Fun:
  whoami            Who is this?
  ls                List sections
  hack              Initiate hacking sequence
  sudo              Try sudo access
  
Press ${hotkey} to toggle terminal
Press ESC to close terminal
Use ↑↓ arrows for command history
        `);
    }
    
    cmdAbout() {
        this.printLine(`
╔══════════════════════════════════════════════════════╗
║                    NAJAM TARIQ                        ║
╚══════════════════════════════════════════════════════╝

> Role: Software Engineer & AI Enthusiast
> Education: Computer Science @ Colby College
> Current: Software Engineer @ ParaAI

I'm a passionate developer who loves building AI-driven
solutions and scalable applications. Currently working
on tools that have reached 200K+ users.

My work spans full-stack development, AI/ML engineering,
and research. I thrive on solving complex technical
challenges and building products that make a difference.

⚡ Fun fact: I secured $150K in Microsoft credits for
   our AI writing tool at ParaAI!

Type 'skills' to see my technical expertise.
Type 'projects' to see what I've built.
        `);
    }
    
    cmdSkills() {
        this.printLine(`
╔══════════════════════════════════════════════════════╗
║                  TECHNICAL SKILLS                     ║
╚══════════════════════════════════════════════════════╝

Programming Languages:
  → Python, Java, C/C++, JavaScript, PHP, PineScript

AI & Machine Learning:
  → GPT-5, Llama 4, Phi4, Opus 4.1
  → Fine-tuning, RAG Pipeline, Zero-shot Learning

Frameworks & Tools:
  → React, Next.js, Flask, PyQt5
  → Git, Postman, Docker, Kubernetes

Cloud & DevOps:
  → AWS, GCP, CI/CD, GitHub Actions

Databases:
  → MongoDB, PostgreSQL, MySQL, Redis, Firebase

Data Processing:
  → Pandas, NumPy, ETL, JSON

Currently mastering: Advanced AI architectures and
distributed systems.
        `);
    }
    
    cmdProjects() {
        this.printLine(`
╔══════════════════════════════════════════════════════╗
║                 FEATURED PROJECTS                     ║
╚══════════════════════════════════════════════════════╝

[1] VibeMail - AI Email Assistant
    Chrome extension that enhances Gmail with AI-powered
    email composition, smart suggestions, and context-
    aware completions.
    → https://vibemail.email

[2] DeepDrive - Cloud Storage Bot
    Telegram bot for secure file sharing with 2GB limit
    and zero data loss. Integrated with LiveGram for
    95% faster backups.
    → https://t.me/DeepDriveBot

[3] Fibonacci Ribbon - Trading Indicator
    TradingView indicator using Fibonacci numbers and
    multiple moving averages for stock analysis.
    → github.com/najam-tariq/Fibonacci-EMA-SMA

[4] Fix8 - Eye-Tracking Tool (Research)
    PyQt5 GUI for automated eye-tracking data correction.
    Published in Springer. Processed 5,000+ JSON files.
    → github.com/nalmadi/fix8

Want to collaborate? Type 'contact' to reach out!
        `);
    }
    
    cmdContact() {
        this.printLine(`
╔══════════════════════════════════════════════════════╗
║                  CONTACT INFORMATION                  ║
╚══════════════════════════════════════════════════════╝

📧 Email:    najam.tariq@colby.edu
📞 Phone:    +1 (207) 313-6193
📍 Location: Waterville, ME

🔗 Links:
   GitHub:   github.com/najam-tariq
   LinkedIn: linkedin.com/in/najam-tariq

I typically respond within 24 hours. Let's build
something amazing together! 🚀
        `);
    }
    
    cmdWhoami() {
        this.printLine(`
najam@portfolio:~$ whoami

Najam Tariq - Software Engineer & AI Enthusiast
        `);
    }
    
    cmdLs() {
        this.printLine(`
about/      experience/     projects/       skills/
research/   contact/        opensource/

Total: 7 sections
Hint: Use 'cd <section>' to navigate
        `);
    }
    
    cmdCd(section) {
        if (!section) {
            this.printLine('Usage: cd <section>');
            this.printLine('Available: about, experience, projects, skills, research, contact');
            return;
        }
        
        const validSections = ['about', 'experience', 'projects', 'skills', 'research', 'contact', 'opensource', 'home'];
        
        if (validSections.includes(section)) {
            this.printLine(`Navigating to ${section}...`);
            this.close();
            
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        } else {
            this.printLine(`Section not found: ${section}`, 'terminal-error');
            this.printLine('Type "ls" to see available sections.');
        }
    }
    
    cmdHack() {
        const steps = [
            'Initializing hack sequence...',
            'Connecting to mainframe...',
            'Bypassing firewall...',
            'Accessing database...',
            'Downloading files...',
            '████████████████████ 100%',
            '',
            'HACK COMPLETE! ✓',
            '',
            'Just kidding! I build secure systems, not break them. 😄'
        ];
        
        let delay = 0;
        steps.forEach(step => {
            setTimeout(() => {
                this.printLine(step);
            }, delay);
            delay += 400;
        });
    }
    
    cmdSudo() {
        this.printLine(`
[sudo] password for najam: 

Nice try! But you don't have sudo privileges here. 😏

However, I appreciate your curiosity!
Type 'help' to see what you CAN do.
        `, 'terminal-error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MatrixTerminal();
});

