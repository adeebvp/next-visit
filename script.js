// ---------------------------------------------------------
// Settings
// ---------------------------------------------------------
// Photos inside the assets folder, named 1, 2, 3 ... and shown in that order.
// Any of these extensions works (e.g. 1.jpg, 2.JPG, 3.png). Missing numbers are skipped.
const PHOTOS = ['1', '2', '3', '4', '5', '6'];
const PHOTO_EXTENSIONS = ['.webp', '.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG'];

// Next visit: Dec 16, 2026 (India time, IST +05:30)
const VISIT_DATE = "2026-12-16T00:00:00+05:30";

const HEART_PATH = 'M20.8 4.6a5.5 5.5 0 00-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21.3l7.8-7.8 1.1-1.1a5.5 5.5 0 000-7.8z';
const HEART_SVG = `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="${HEART_PATH}"/></svg>`;

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------
    // 1. DOM Elements & Variables
    // ---------------------------------------------------------
    const coverScreen = document.getElementById('cover-screen');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    // ---------------------------------------------------------
    // 2. Cover: floating hearts & open
    // ---------------------------------------------------------
    const coverHearts = document.getElementById('cover-hearts');
    if (coverHearts) {
        for (let i = 0; i < 14; i++) {
            const heart = document.createElement('div');
            heart.classList.add('float-heart');
            heart.innerHTML = HEART_SVG;
            const size = 12 + Math.random() * 22;
            heart.style.left = Math.random() * 100 + '%';
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';
            heart.style.animationDuration = 8 + Math.random() * 8 + 's';
            heart.style.animationDelay = -Math.random() * 16 + 's';
            coverHearts.appendChild(heart);
        }
    }

    const setMusicState = (playing) => {
        if (musicIcon) musicIcon.textContent = playing ? '🔊' : '🔇';
        if (musicToggle) musicToggle.setAttribute('aria-label', playing ? 'Mute music' : 'Play music');
    };

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (coverScreen) coverScreen.classList.add('opened');

            setTimeout(() => {
                if (coverScreen) coverScreen.style.display = 'none';
                if (mainContent) mainContent.classList.remove('hidden');
            }, 900); // Matches the CSS cover fade

            // The mute button shows as soon as the page opens. If the phone blocks
            // autoplay it shows 🔇 so a tap starts the song; it hides only when
            // assets/music.mp3 is missing.
            if (bgMusic) {
                if (musicToggle) musicToggle.classList.remove('hidden');
                bgMusic.play()
                    .catch((err) => {
                        setMusicState(false);
                        if (err.name === 'NotSupportedError' && musicToggle) musicToggle.classList.add('hidden');
                    });
            }
        });
    }

    // ---------------------------------------------------------
    // 3. Audio Toggle Logic
    // ---------------------------------------------------------
    // The icon follows the audio element itself, so it is right even while the
    // song is still loading or after the browser pauses it.
    if (musicToggle && bgMusic) {
        bgMusic.addEventListener('play', () => setMusicState(true));
        bgMusic.addEventListener('pause', () => setMusicState(false));
        // No song file: hide the button again
        const musicSource = bgMusic.querySelector('source');
        if (musicSource) musicSource.addEventListener('error', () => musicToggle.classList.add('hidden'));
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().catch(() => setMusicState(false));
            } else {
                bgMusic.pause();
            }
        });
    }

    // ---------------------------------------------------------
    // 4. Photo Gallery
    // ---------------------------------------------------------
    const gallery = document.getElementById('gallery');
    const gallerySection = document.getElementById('gallery-section');
    let photosLeft = PHOTOS.length;

    const photoGone = () => {
        photosLeft--;
        // Hide the whole section until at least one photo exists
        if (photosLeft === 0 && gallerySection) gallerySection.style.display = 'none';
    };

    if (gallery) {
        PHOTOS.forEach((name, i) => {
            const img = document.createElement('img');
            img.alt = 'Sana & Adeeb ' + (i + 1);
            img.className = 'gallery-img';
            img.decoding = 'async';
            img.loading = 'lazy';

            // Try each extension in turn until one loads
            let extIndex = 0;
            img.addEventListener('error', () => {
                extIndex++;
                if (extIndex < PHOTO_EXTENSIONS.length) {
                    img.src = 'assets/' + name + PHOTO_EXTENSIONS[extIndex];
                } else {
                    img.remove();
                    photoGone();
                }
            });
            img.src = 'assets/' + name + PHOTO_EXTENSIONS[0];
            gallery.appendChild(img);
        });
    }
    if (PHOTOS.length === 0 && gallerySection) gallerySection.style.display = 'none';

    // ---------------------------------------------------------
    // 5. Scroll Fade-in Animation Observer
    // ---------------------------------------------------------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ---------------------------------------------------------
    // 6. Countdown Timer
    // ---------------------------------------------------------
    const targetDate = new Date(VISIT_DATE).getTime();

    const updateCountdown = () => {
        const distance = targetDate - new Date().getTime();

        if (distance < 0) {
            clearInterval(interval);
            const doneEl = document.getElementById("countdown-done");
            if (doneEl) doneEl.classList.remove('hidden');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("mins").innerText = mins.toString().padStart(2, '0');
        document.getElementById("secs").innerText = secs.toString().padStart(2, '0');
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // ---------------------------------------------------------
    // 7. Scratch to Reveal (Three separate boxes)
    // ---------------------------------------------------------
    const scratchIds = ['scratch-day', 'scratch-month', 'scratch-year'];
    let fullyRevealedCount = 0;

    scratchIds.forEach(id => {
        const scratchCanvas = document.getElementById(id);
        if (!scratchCanvas) return;
        const scratchCtx = scratchCanvas.getContext('2d');

        scratchCanvas.width = 90;
        scratchCanvas.height = 90;

        const gradient = scratchCtx.createLinearGradient(0, 0, 90, 90);
        gradient.addColorStop(0, '#e8d090');
        gradient.addColorStop(0.5, '#b38745');
        gradient.addColorStop(1, '#e8d090');

        scratchCtx.fillStyle = gradient;
        scratchCtx.fillRect(0, 0, 90, 90);

        let isDrawing = false;
        let scratchedPixels = 0;
        let isRevealed = false;

        const getPos = (e) => {
            const rect = scratchCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const scratch = (e) => {
            if (!isDrawing || isRevealed) return;
            e.preventDefault();
            const { x, y } = getPos(e);

            scratchCtx.globalCompositeOperation = 'destination-out';
            scratchCtx.beginPath();
            scratchCtx.arc(x, y, 12, 0, Math.PI * 2, false);
            scratchCtx.fill();

            scratchedPixels++;

            if (scratchedPixels > 25) {
                isRevealed = true;
                scratchCanvas.style.opacity = '0';
                setTimeout(() => { scratchCanvas.style.display = 'none'; }, 500);

                fullyRevealedCount++;
                if (fullyRevealedCount === scratchIds.length) {
                    triggerHeartBurst(document.getElementById('visit-boxes'));
                }
            }
        };

        scratchCanvas.addEventListener('mousedown', () => { isDrawing = true; });
        scratchCanvas.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', () => { isDrawing = false; });

        scratchCanvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
        scratchCanvas.addEventListener('touchmove', scratch, { passive: false });
        scratchCanvas.addEventListener('touchend', () => { isDrawing = false; });
    });

    // ---------------------------------------------------------
    // 8. Golden Heart Burst (after all boxes are revealed)
    // ---------------------------------------------------------
    function triggerHeartBurst(boxesEl) {
        if (!boxesEl) return;

        // Make the revealed boxes glow
        boxesEl.classList.add('celebrate');

        const rect = boxesEl.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        for (let i = 0; i < 24; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart-burst');
            heart.innerHTML = HEART_SVG;

            // Fly outwards in a ring, drifting slightly upwards
            const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.3;
            const distance = 90 + Math.random() * 110;
            const size = 10 + Math.random() * 12;
            heart.style.left = originX + 'px';
            heart.style.top = originY + 'px';
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';
            heart.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            heart.style.setProperty('--dy', Math.sin(angle) * distance - 40 + 'px');
            heart.style.animationDelay = Math.random() * 0.2 + 's';
            document.body.appendChild(heart);

            setTimeout(() => { heart.remove(); }, 2000);
        }
    }

});
