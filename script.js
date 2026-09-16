/**
 * BIRTHDAY CARD INTERACTIVE SCRIPT - GABI'S 21st BIRTHDAY EDITORIAL EDITION
 * Features: Web Audio API synth, Confetti canvas, Envelope intro animation,
 * Candle blowing logic, Balloon & Heart generator, Editorial paper feel.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const cardScreen = document.getElementById('card-screen');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const balloonsContainer = document.getElementById('balloons-container');

    // Display elements
    const displayName = document.getElementById('display-name');
    const displayAge = document.getElementById('display-age');
    const displayMessage = document.getElementById('display-message');
    const displaySender = document.getElementById('display-sender');
    const displayPhoto = document.getElementById('display-photo');
    const letterRecipient = document.getElementById('letter-recipient');

    // Cake & Candles
    const candlesContainer = document.getElementById('candles-container');
    const blowBtn = document.getElementById('blow-btn');
    const rekindleBtn = document.getElementById('rekindle-btn');
    const wishMessage = document.getElementById('wish-message');

    const defaultPoem = `Felices 21.

Dicen que las flores no necesitan anunciar que son bonitas; simplemente florecen, y quien las mira lo sabe.

Creo que contigo pasa algo parecido.

Tienes una belleza que no necesita explicación, porque se encuentra en la forma en que sonríes, en tu dulzura, en tu manera de ser y en esos pequeños detalles que hacen que seas imposible de confundir con alguien más.

Si fueras una flor, no serías solamente aquella que destaca por sus colores, sino la que hace que alguien se detenga a contemplar el jardín un instante más.

Si fueras una tarde, serías de esas en las que el cielo se pinta lentamente de colores y nadie quiere que llegue la noche.

Si fueras una estrella, serías de esas que no necesitan ser la más brillante del cielo para conseguir que alguien levante la mirada y sonría.

Y si fueras primavera, serías esa que llega después de un invierno largo y le recuerda al mundo que todavía existen cosas bonitas por florecer.

Pero quizás la naturaleza se queda corta cuando intenta describir a alguien como tú, porque hay cosas que no caben en un paisaje, ni en una flor, ni siquiera en las palabras.

Por eso deseo que tus 21 sean como un jardín en primavera:

llenos de flores que representen sueños cumplidos, caminos nuevos por descubrir, días soleados, lluvias que te hagan crecer y momentos tan bonitos que quieras guardarlos para siempre.

Que nunca dejes de florecer a tu manera.

Que nunca permitas que nadie apague esa luz tan tuya.

Y que, incluso en los días nublados, recuerdes que el sol nunca deja de existir; simplemente a veces se esconde detrás de las nubes.

Hoy comienza otro capítulo de tu vida, y ojalá sea uno de los más bonitos: uno lleno de aventuras, de aprendizajes, de risas, de personas que te quieran bonito y de momentos que hagan que tu corazón diga:

“Qué bonito es estar aquí.”

Porque el mundo es un lugar un poquito más bonito simplemente porque tú estás en él.

Feliz cumpleaños, hermosa Gabi.

Felices 21 años.`;

    // ==========================================================================
    // INITIALIZATION & BALLOONS
    // ==========================================================================
    generateBalloons(16);
    loadSavedData();

    // Envelope click event
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
    }

    // ==========================================================================
    // ENVELOPE ANIMATION
    // ==========================================================================
    function openEnvelope() {
        if (envelope.classList.contains('open')) return;
        
        envelope.classList.add('open');
        playChimeSound();
        burstConfetti(40);

        setTimeout(() => {
            envelopeScreen.style.opacity = '0';
            setTimeout(() => {
                envelopeScreen.classList.remove('active');
                envelopeScreen.classList.add('hidden');
                cardScreen.classList.remove('hidden');
                cardScreen.classList.add('active');
                
                if (balloonsContainer) {
                    balloonsContainer.classList.add('active');
                }

                burstConfetti(120);
                startMusic();
            }, 700);
        }, 1500);
    }

    // ==========================================================================
    // CAKE & CANDLE INTERACTION
    // ==========================================================================
    const candles = candlesContainer ? candlesContainer.querySelectorAll('.candle') : [];

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            const isBlown = candle.getAttribute('data-blown') === 'true';
            candle.setAttribute('data-blown', !isBlown);
            checkAllCandlesBlown();
        });
    });

    if (blowBtn) {
        blowBtn.addEventListener('click', () => {
            candles.forEach(c => c.setAttribute('data-blown', 'true'));
            checkAllCandlesBlown();
        });
    }

    if (rekindleBtn) {
        rekindleBtn.addEventListener('click', () => {
            candles.forEach(c => c.setAttribute('data-blown', 'false'));
            if (wishMessage) wishMessage.classList.add('hidden');
            rekindleBtn.classList.add('hidden');
            if (blowBtn) blowBtn.classList.remove('hidden');
        });
    }

    function checkAllCandlesBlown() {
        const allBlown = Array.from(candles).every(c => c.getAttribute('data-blown') === 'true');

        if (allBlown) {
            if (wishMessage) wishMessage.classList.remove('hidden');
            if (rekindleBtn) rekindleBtn.classList.remove('hidden');
            if (blowBtn) blowBtn.classList.add('hidden');

            playCelebrationSound();
            burstConfetti(220);
        }
    }

    // ==========================================================================
    // WEB AUDIO API SYNTHESIZER (SOFT HAPPY BIRTHDAY MELODY)
    // ==========================================================================
    let audioCtx = null;
    let isPlayingMusic = false;
    let musicTimeout = null;

    const notes = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00,
        'A4': 440.00, 'A#4': 466.16, 'B4': 493.88, 'C5': 523.25
    };

    const song = [
        ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
        ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
        ['C4', 0.75], ['C4', 0.25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
        ['A#4', 0.75], ['A#4', 0.25], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2]
    ];

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playNote(freq, duration) {
        if (!audioCtx || !isPlayingMusic) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function playSong(noteIndex = 0) {
        if (!isPlayingMusic) return;

        if (noteIndex >= song.length) {
            musicTimeout = setTimeout(() => playSong(0), 1800);
            return;
        }

        const [note, duration] = song[noteIndex];
        const freq = notes[note];
        const tempo = 480;

        playNote(freq, (duration * tempo) / 1000);

        musicTimeout = setTimeout(() => {
            playSong(noteIndex + 1);
        }, duration * tempo);
    }

    function startMusic() {
        initAudio();
        isPlayingMusic = true;
        if (musicIcon) musicIcon.textContent = '🎵';
        playSong(0);
    }

    function stopMusic() {
        isPlayingMusic = false;
        if (musicIcon) musicIcon.textContent = '🔇';
        if (musicTimeout) clearTimeout(musicTimeout);
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (isPlayingMusic) {
                stopMusic();
            } else {
                startMusic();
            }
        });
    }

    function playChimeSound() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
        chimeNotes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.6);
        });
    }

    function playCelebrationSound() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        arpeggio.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.5);
        });
    }

    // ==========================================================================
    // FLOATING BALLOONS GENERATOR (EDITORIAL PASTEL TONES)
    // ==========================================================================
    function generateBalloons(count) {
        if (!balloonsContainer) return;
        balloonsContainer.innerHTML = '';
        const colors = ['#e8b4b8', '#d9939a', '#c49a45', '#e8d3c5', '#9e4a5b'];

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomLeft = Math.random() * 95;
            const randomDelay = Math.random() * 12;
            const randomDuration = 12 + Math.random() * 8;
            const randomScale = 0.75 + Math.random() * 0.5;

            balloon.style.backgroundColor = randomColor;
            balloon.style.left = `${randomLeft}%`;
            balloon.style.animationDelay = `${randomDelay}s`;
            balloon.style.animationDuration = `${randomDuration}s`;
            balloon.style.transform = `scale(${randomScale})`;

            balloonsContainer.appendChild(balloon);
        }
    }

    // ==========================================================================
    // CONFETTI CANVAS ENGINE
    // ==========================================================================
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let confettiParticles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticle() {
        const colors = ['#e8b4b8', '#d9939a', '#c49a45', '#f2d3d6', '#8c3b4d'];
        return {
            x: Math.random() * (canvas ? canvas.width : 500),
            y: -20,
            size: Math.random() * 7 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 5,
            opacity: 1
        };
    }

    function burstConfetti(count = 100) {
        if (!ctx) return;
        for (let i = 0; i < count; i++) {
            const p = createParticle();
            p.y = Math.random() * (canvas.height / 2);
            confettiParticles.push(p);
        }
        if (!animationFrameId) {
            updateConfetti();
        }
    }

    function updateConfetti() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.003;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > canvas.height || p.opacity <= 0) {
                confettiParticles.splice(i, 1);
            }
        }

        if (confettiParticles.length > 0) {
            animationFrameId = requestAnimationFrame(updateConfetti);
        } else {
            animationFrameId = null;
        }
    }

    // ==========================================================================
    // INITIAL DATA LOADING
    // ==========================================================================
    function applyCustomData(data) {
        if (displayName) displayName.textContent = data.name;
        if (letterRecipient) letterRecipient.textContent = data.name;
        if (displayAge) displayAge.textContent = data.age;
        if (displaySender) displaySender.textContent = data.sender;
        
        if (displayMessage && data.message) {
            const paragraphs = data.message.split(/\n+/).filter(p => p.trim() !== '');
            displayMessage.innerHTML = paragraphs.map((p, idx) => {
                const text = p.trim();
                if (idx === 0) return `<p class="poem-intro">${text}</p>`;
                if (text.includes("Qué bonito es estar aquí")) return `<p class="poem-highlight">${text}</p>`;
                if (text.startsWith("Feliz cumpleaños") || text.startsWith("Felices 21")) return `<p class="poem-closing">${text}</p>`;
                return `<p>${text}</p>`;
            }).join('');
        }

        if (displayPhoto && data.photo) {
            displayPhoto.src = data.photo;
        }
    }

    function loadSavedData() {
        applyCustomData({
            name: 'Gabi',
            age: '21',
            sender: 'Con mucho amor y cariño',
            message: defaultPoem,
            photo: '',
            theme: 'warm-rose'
        });
    }

});
