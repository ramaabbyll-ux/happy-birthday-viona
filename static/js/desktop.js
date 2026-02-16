// Desktop Manager
// Start Overlay Function
window.enterSite = function () {
    const overlay = document.getElementById('start-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    }
    // Start Music
    const bgmAudio = document.getElementById('player-audio');
    const playBtn = document.getElementById('play-btn');
    if (bgmAudio) {
        bgmAudio.play().then(() => {
            if (playBtn) {
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
            }
        }).catch(e => console.log(e));
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- START SCREEN LOGIC ---
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const bgm = document.getElementById('bgm');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Check password if needed, or just start
            startScreen.style.display = 'none';
            // Play Audio
            if (bgm) bgm.play().catch(e => console.log("Audio requires interaction"));
            // Trigger Confetti
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 9999 });
            // Show Guide Arrow after delay
            setTimeout(() => {
                const guide = document.getElementById('guide-arrow');
                if (guide) guide.style.display = 'block';
            }, 1000);
        });
    }

    // --- CLOCK WIDGET ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        const tEl = document.getElementById('clock-time');
        const dEl = document.getElementById('clock-date');
        if (tEl) tEl.textContent = timeString;
        if (dEl) dEl.textContent = dateString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- WINDOW MANAGEMENT ---
    const windows = document.querySelectorAll('.window');
    let highestZ = 2000; // Start higher than sidebar (1000)

    // Make windows draggable
    windows.forEach(win => {
        makeDraggable(win);

        // Z-Index on click
        win.addEventListener('mousedown', () => {
            highestZ++;
            win.style.zIndex = highestZ;

            // Hide guide if user interacts with a window
            const guide = document.getElementById('guide-arrow');
            if (guide) guide.style.display = 'none';
        });

        // Close button
        const closeBtn = win.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeWindow(win.id);
            });
        }
    });

    // --- WINDOW CONTROLS ---
    window.openWindow = function (windowId) {
        const win = document.getElementById(windowId);
        if (win) {
            win.classList.add('open');
            highestZ++;
            win.style.zIndex = highestZ;

            // Hide guide
            const guide = document.getElementById('guide-arrow');
            if (guide) guide.style.display = 'none';

            // Center position (reset random logic)
            if (!win.dataset.opened) {
                win.style.top = '50%';
                win.style.left = '50%';
                win.dataset.opened = "true";
            }
        }
    };

    window.closeWindow = function (windowId) {
        const win = document.getElementById(windowId);
        if (win) win.classList.remove('open');
    };

    // --- DRAG LOGIC ---
    function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = elmnt.querySelector('.window-header');

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            // e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // --- CAKE INTERACTION ---
    const cakeEmoji = document.getElementById('cake-emoji');
    if (cakeEmoji) {
        cakeEmoji.onclick = function () {
            this.textContent = '🍰';
            const msg = document.getElementById('cake-msg');
            if (msg) msg.style.display = 'block';
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 9999
            });
        };
    }

    // --- MUSIC WIDGET ---
    const playBtn = document.getElementById('play-btn');
    const bgmAudio = document.getElementById('player-audio'); // Renamed variable
    let isPlaying = false;

    if (playBtn && bgmAudio) {
        // Auto-play attempt
        const tryPlay = () => {
            bgmAudio.play().then(() => {
                isPlaying = true;
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
            }).catch(e => {
                console.log("Autoplay blocked, waiting for interaction.");
            });
        };

        // Try playing immediately
        tryPlay();

        // Retry on first click if blocked
        document.body.addEventListener('click', () => {
            if (bgmAudio.paused) {
                tryPlay();
            }
        }, { once: true });

        playBtn.onclick = function () {
            if (bgmAudio.paused) {
                bgmAudio.play();
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
            } else {
                bgmAudio.pause();
                playBtn.classList.remove('fa-pause');
                playBtn.classList.add('fa-play');
            }
        };
    }
});
