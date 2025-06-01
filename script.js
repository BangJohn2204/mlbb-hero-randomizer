// State Management
class HeroRandomizer {
    constructor() {
        this.heroes = [];
        this.filteredHeroes = [];
        this.currentRole = "All";
        this.spinCount = 0;
        this.isSpinning = false;
        
        // DOM Elements
        this.heroImg = document.getElementById("hero-img");
        this.heroName = document.getElementById("hero-name");
        this.heroRole = document.getElementById("hero-role");
        this.spinBtn = document.getElementById("spin-btn");
        this.loadingSection = document.getElementById("loading-section");
        this.roleButtons = document.querySelectorAll(".role-btn");
        
        // Statistics elements
        this.totalHeroesEl = document.getElementById("total-heroes");
        this.availableHeroesEl = document.getElementById("available-heroes");
        this.spinCountEl = document.getElementById("spin-count");
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadHeroes();
            this.setupEventListeners();
            this.filterHeroes();
            this.updateStatistics();
            this.addLoadingAnimation();
        } catch (error) {
            console.error("Error initializing app:", error);
            this.showError("Gagal memuat data hero. Periksa koneksi internet Anda.");
        }
    }
    
    async loadHeroes() {
        try {
            const response = await fetch("hero_mlbb_with_images.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.heroes = await response.json();
        } catch (error) {
            // Fallback data untuk demo
            this.heroes = [
                {
                    name: "Alucard",
                    role: ["Fighter"],
                    img: "https://via.placeholder.com/200x200/ff6b6b/ffffff?text=Alucard"
                },
                {
                    name: "Miya",
                    role: ["Marksman"],
                    img: "https://via.placeholder.com/200x200/4ecdc4/ffffff?text=Miya"
                },
                {
                    name: "Tigreal",
                    role: ["Tank"],
                    img: "https://via.placeholder.com/200x200/45b7d1/ffffff?text=Tigreal"
                }
            ];
            console.warn("Using fallback hero data");
        }
    }
    
    setupEventListeners() {
        // Role button listeners
        this.roleButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const role = e.currentTarget.dataset.role;
                this.setRole(role);
            });
        });
        
        // Spin button listener
        this.spinBtn.addEventListener("click", () => {
            if (!this.isSpinning && this.filteredHeroes.length > 0) {
                this.spinHero();
            }
        });
        
        // Keyboard listener
        document.addEventListener("keydown", (e) => {
            if (e.code === "Space" && !this.isSpinning && this.filteredHeroes.length > 0) {
                e.preventDefault();
                this.spinHero();
            }
        });
    }
    
    setRole(role) {
        if (this.isSpinning) return;
        
        this.currentRole = role;
        
        // Update active button and aria attributes
        this.roleButtons.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-selected", "false");
            if (btn.dataset.role === role) {
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
            }
        });
        
        this.filterHeroes();
        this.updateStatistics();
        
        // Add button animation
        const activeBtn = document.querySelector(`[data-role="${role}"]`);
        activeBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
            activeBtn.style.transform = "";
        }, 150);
    }
    
    filterHeroes() {
        this.filteredHeroes = this.currentRole === "All" 
            ? [...this.heroes]
            : this.heroes.filter(hero => hero.role.includes(this.currentRole));
        
        if (this.filteredHeroes.length > 0) {
            const randomHero = this.getRandomHero();
            this.displayHero(randomHero, false);
        } else {
            this.showNoHeroes();
        }
    }
    
    getRandomHero() {
        const randomIndex = Math.floor(Math.random() * this.filteredHeroes.length);
        return this.filteredHeroes[randomIndex];
    }
    
    displayHero(hero, animate = true) {
        if (!hero) return;
        
        // Update image
        this.heroImg.src = hero.img;
        this.heroImg.alt = hero.name;
        
        // Update text content
        this.heroName.textContent = hero.name;
        this.heroRole.textContent = `Role: ${hero.role.join(", ")}`;
        
        if (animate) {
            // Add show animations
            setTimeout(() => {
                this.heroImg.classList.add("show");
                this.heroName.classList.add("show");
                this.heroRole.classList.add("show");
            }, 100);
        } else {
            // Show immediately without animation
            this.heroImg.classList.add("show");
            this.heroName.classList.add("show");
            this.heroRole.classList.add("show");
        }
        
        // Handle image load error
        this.heroImg.onerror = () => {
            this.heroImg.src = `https://via.placeholder.com/200x200/4ecdc4/ffffff?text=${encodeURIComponent(hero.name)}`;
        };
    }
    
    showNoHeroes() {
        this.heroImg.src = "";
        this.heroImg.classList.remove("show");
        this.heroName.textContent = "Tidak ada hero dalam role ini";
        this.heroName.classList.remove("show");
        this.heroRole.textContent = "";
        this.heroRole.classList.remove("show");
    }
    
    showError(message) {
        this.heroImg.src = "";
        this.heroImg.classList.remove("show");
        this.heroName.textContent = message;
        this.heroName.classList.remove("show");
        this.heroRole.textContent = "";
        this.heroRole.classList.remove("show");
    }
    
    async spinHero() {
        if (this.filteredHeroes.length === 0 || this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinCount++;
        this.updateStatistics();
        
        // Hide current hero
        this.heroImg.classList.remove("show");
        this.heroName.classList.remove("show");
        this.heroRole.classList.remove("show");
        
        // Show loading
        this.loadingSection.style.display = "block";
        this.spinBtn.style.opacity = "0.6";
        this.spinBtn.style.pointerEvents = "none";
        
        // Animate button
        const buttonIcon = this.spinBtn.querySelector("i");
        buttonIcon.style.animation = "spin 2s linear infinite";
        
        // Spin animation duration
        const spinDuration = 3000 + Math.random() * 2000; // 3-5 seconds
        const spinInterval = 150; // Change hero every 150ms
        
        let spinTimer;
        let currentSpinTime = 0;
        
        // Rapid hero changes during spin
        spinTimer = setInterval(() => {
            currentSpinTime += spinInterval;
            
            if (currentSpinTime >= spinDuration) {
                clearInterval(spinTimer);
                this.finishSpin();
            } else {
                // Show random hero during spin (just for effect)
                const tempHero = this.getRandomHero();
                this.heroImg.src = tempHero.img;
                this.heroName.textContent = tempHero.name;
                this.heroRole.textContent = `Role: ${tempHero.role.join(", ")}`;
            }
        }, spinInterval);
    }
    
    finishSpin() {
        // Hide loading
        this.loadingSection.style.display = "none";
        
        // Stop spin sound
        this.soundManager.stopSpinSound();
        
        // Reset button
        this.spinBtn.style.opacity = "";
        this.spinBtn.style.pointerEvents = "";
        const buttonIcon = this.spinBtn.querySelector("i");
        buttonIcon.style.animation = "";
        
        // Show final hero with animation
        const finalHero = this.getRandomHero();
        this.displayHero(finalHero, true);
        
        // Play result sound
        setTimeout(() => {
            this.soundManager.playResultSound();
        }, 300);
        
        // Add celebration effect
        this.addCelebrationEffect();
        
        this.isSpinning = false;
    }
    
    addCelebrationEffect() {
        // Create confetti-like effect
        const container = document.querySelector('.container');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffa500'];
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '0%';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${1 + Math.random() * 2}s ease-out forwards`;
            
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }
        
        // Add CSS animation for confetti
        if (!document.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(600px) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    updateStatistics() {
        this.totalHeroesEl.textContent = this.heroes.length;
        this.availableHeroesEl.textContent = this.filteredHeroes.length;
        this.spinCountEl.textContent = this.spinCount;
        
        // Animate numbers
        [this.totalHeroesEl, this.availableHeroesEl, this.spinCountEl].forEach(el => {
            el.style.transform = 'scale(1.2)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    addLoadingAnimation() {
        // Add pulse effect to container
        const container = document.querySelector('.container');
        let pulseInterval;
        
        const startPulse = () => {
            pulseInterval = setInterval(() => {
                if (!this.isSpinning) {
                    container.style.boxShadow = `
                        0 25px 50px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        0 0 30px rgba(78, 205, 196, 0.3)
                    `;
                    setTimeout(() => {
                        container.style.boxShadow = `
                            0 25px 50px rgba(0, 0, 0, 0.5),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `;
                    }, 1000);
                }
            }, 3000);
        };
        
        startPulse();
    }
}

// Sound Effects Class
class SoundManager {
    constructor() {
        this.initSounds();
    }
    
    initSounds() {
        // Load audio files
        this.spinSound = new Audio("spin.mp3");
        this.resultSound = new Audio("result.mp3");
        
        // Set audio properties
        this.spinSound.volume = 0.7;
        this.resultSound.volume = 0.8;
        
        // Preload audio files
        this.spinSound.preload = "auto";
        this.resultSound.preload = "auto";
        
        // Handle audio loading errors
        this.spinSound.onerror = () => {
            console.warn("Spin sound file not found or failed to load");
        };
        
        this.resultSound.onerror = () => {
            console.warn("Result sound file not found or failed to load");
        };
    }
    
    playSpinSound() {
        try {
            this.spinSound.currentTime = 0;
            this.spinSound.play().catch(e => {
                console.warn("Could not play spin sound:", e);
            });
        } catch (error) {
            console.warn("Error playing spin sound:", error);
        }
    }
    
    playResultSound() {
        try {
            this.resultSound.currentTime = 0;
            this.resultSound.play().catch(e => {
                console.warn("Could not play result sound:", e);
            });
        } catch (error) {
            console.warn("Error playing result sound:", error);
        }
    }
    
    stopSpinSound() {
        try {
            this.spinSound.pause();
            this.spinSound.currentTime = 0;
        } catch (error) {
            console.warn("Error stopping spin sound:", error);
        }
    }
}

// Enhanced Hero Randomizer with Sound
class EnhancedHeroRandomizer extends HeroRandomizer {
    constructor() {
        super();
        this.soundManager = new SoundManager();
    }
    
    async spinHero() {
        if (this.filteredHeroes.length === 0 || this.isSpinning) return;
        
        // Play spin sound
        this.soundManager.playSpinSound();
        
        // Call parent spin method
        await super.spinHero();
    }
}

// Utility Functions
const utils = {
    // Animate element with bounce effect
    bounceElement(element) {
        element.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
        
        // Add bounce keyframes if not exists
        if (!document.querySelector('#bounce-style')) {
            const style = document.createElement('style');
            style.id = 'bounce-style';
            style.textContent = `
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Create ripple effect
    createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Add ripple styles if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: rippleEffect 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes rippleEffect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the enhanced hero randomizer
    const app = new EnhancedHeroRandomizer();
    
    // Add ripple effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            utils.createRipple(button, e);
        });
    });
    
    // Add keyboard shortcuts info
    const addKeyboardInfo = () => {
        const info = document.createElement('div');
        info.style.position = 'fixed';
        info.style.bottom = '20px';
        info.style.right = '20px';
        info.style.background = 'rgba(0, 0, 0, 0.7)';
        info.style.color = 'white';
        info.style.padding = '10px 15px';
        info.style.borderRadius = '8px';
        info.style.fontSize = '0.85rem';
        info.style.zIndex = '1000';
        info.innerHTML = '<i class="fas fa-keyboard"></i> Tekan SPACE untuk spin';
        document.body.appendChild(info);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            info.style.opacity = '0';
            info.style.transition = 'opacity 0.5s';
            setTimeout(() => info.remove(), 500);
        }, 5000);
    };
    
    // Show keyboard shortcut info after 3 seconds
    setTimeout(addKeyboardInfo, 3000);
    
    // Console welcome message
    console.log(`
    🎯 MLBB Hero Randomizer Pro
    ═══════════════════════════
    Created with ❤️ for MLBB players
    
    Features:
    • Professional UI/UX design
    • Smooth animations
    • Sound effects
    • Keyboard shortcuts (SPACE to spin)
    • Responsive design
    • Real-time statistics
    
    Enjoy spinning your heroes! 🎮
    `);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
