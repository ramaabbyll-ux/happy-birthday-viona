document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Fade out loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 1,
            delay: 1.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
                initAnimations();
                startConfetti();
            }
        });
    }

    // Audio Control
    const audio = document.getElementById('bgm');
    const toggleBtn = document.getElementById('music-toggle');
    let isPlaying = false;

    if (toggleBtn && audio) {
        toggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                toggleBtn.textContent = '🎵';
            } else {
                audio.play().catch(e => console.log("Audio play failed:", e));
                toggleBtn.textContent = '🔇';
            }
            isPlaying = !isPlaying;
        });
    }

    function initAnimations() {
        // Hero Animations
        const tl = gsap.timeline();
        tl.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" })
            .from(".hero-subtitle", { y: 30, opacity: 0, duration: 1 }, "-=0.5")
            .from(".hero-badge", { scale: 0, rotation: -10, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5")
            .from(".scroll-indicator", { opacity: 0, y: -20, duration: 0.5 }, "-=0.2");

        // Section Headers
        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1
            });
        });

        // Cards (Staggered)
        gsap.utils.toArray(".grid-cards").forEach(grid => {
            gsap.from(grid.children, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2, // 0.2s delay between each card
                ease: "power2.out"
            });
        });

        // Love Letter (Scale Up)
        gsap.from(".letter-card", {
            scrollTrigger: {
                trigger: "#letter",
                start: "top 75%"
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        // Achievements (Count Up)
        gsap.utils.toArray(".achievement-number").forEach(num => {
            ScrollTrigger.create({
                trigger: num,
                start: "top 85%",
                onEnter: () => animateValue(num)
            });
        });

        // Polaroids (Rotation effect)
        gsap.from(".polaroid", {
            scrollTrigger: {
                trigger: ".polaroid-grid",
                start: "top 80%"
            },
            rotation: (i) => i % 2 === 0 ? -10 : 10,
            opacity: 0,
            y: 100,
            duration: 1,
            stagger: 0.3,
            ease: "back.out(1.5)"
        });
    }


    // Cake Interaction
    const cakeContainer = document.getElementById('birthday-cake');
    const cakeEmoji = cakeContainer ? cakeContainer.querySelector('.cake-emoji') : null;
    const wishMessage = document.getElementById('wish-message');

    if (cakeEmoji) {
        cakeEmoji.addEventListener('click', () => {

            // GSAP Animation for Cake
            gsap.to(cakeEmoji, {
                scale: 1.5,
                rotation: 360,
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    cakeEmoji.textContent = '🍰';
                    gsap.to(cakeEmoji, { scale: 1, opacity: 1, rotation: 0, duration: 0.5 });
                }
            });

            if (wishMessage) {
                wishMessage.classList.remove('hidden');
                wishMessage.classList.add('visible');
                gsap.fromTo(wishMessage, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" });
            }

            // Effects
            triggerConfettiCanon();
            createHeartRain();
        });
    }

    // --- EASTER EGGS ---

    // 1. Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg("Secret from Bapaim: Sayang, you're the best thing that ever happened to me. ❤️");
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // 2. Type "bapaim"
    const secretWord = "bapaim";
    let keyHistory = "";

    document.addEventListener('keypress', (e) => {
        keyHistory += e.key.toLowerCase();
        if (keyHistory.length > secretWord.length) {
            keyHistory = keyHistory.slice(-secretWord.length);
        }
        if (keyHistory === secretWord) {
            activateEasterEgg("Yes, that's me! Your forever supporter 💪❤️");
        }
    });

    function activateEasterEgg(message) {
        alert(message);
        triggerConfettiCanon();
    }

    // Helper: Confetti Canon
    function triggerConfettiCanon() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        var random = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // Helper: Startup Confetti
    function startConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    // Helper: Heart Rain
    function createHeartRain() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('falling-heart');
                heart.innerHTML = '❤️';
                heart.style.position = 'fixed';
                heart.style.top = '-50px';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
                heart.style.zIndex = '9999';
                document.body.appendChild(heart);

                gsap.to(heart, {
                    y: window.innerHeight + 100,
                    rotation: Math.random() * 360,
                    duration: Math.random() * 3 + 2,
                    ease: "none",
                    onComplete: () => heart.remove()
                });

            }, i * 300);
        }
    }

    // Helper: Animate Numbers
    function animateValue(obj) {
        if (obj.getAttribute('data-animated')) return;

        const targetStr = obj.getAttribute('data-target');
        const target = parseInt(targetStr);
        if (isNaN(target)) return;

        const cont = { val: 0 };
        gsap.to(cont, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                obj.innerHTML = Math.floor(cont.val) + (targetStr.includes('+') ? '+' : '');
            },
            onComplete: () => {
                obj.innerHTML = targetStr;
            }
        });

        obj.setAttribute('data-animated', 'true');
    }
});
