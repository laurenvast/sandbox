// Initialize Tone.js with windchime-like sounds
// Create a metallic sound with shimmer and sustain
const reverb = new Tone.Reverb({
    decay: 2,
    wet: 0.3
}).toDestination();

// Create a music box-like synth
const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.05,
        release: 1.2,
    },
    volume: -8
}).connect(reverb);

// Define a scale for music box sounds - typically higher register
const musicBoxScale = ["D#5", "F5", "F#5", "G#5", "A#5", "C6", "C#6", "D#6", "F6", "F#6"];

// Check if device is mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Track active animations to prevent multiple on same element
const animatingLines = new Set();

// Track audio initialization state
let audioInitialized = false;

// Play welcome chime
function playWelcomeChime() {
    try {
        // Play a quick ascending 3-note pattern typical of music boxes
        synth.triggerAttackRelease('C6', 0.1);
        setTimeout(() => synth.triggerAttackRelease('E6', 0.1), 150);
        setTimeout(() => synth.triggerAttackRelease('G6', 0.1), 300);
    } catch (e) {
        console.warn("Could not play welcome notes:", e);
    }
}

// Initialize Tone.js audio context
function initializeToneContext() {
    if (Tone.context.state !== 'running') {
        return Tone.start()
            .then(() => {
                console.log('Audio context started');
                audioInitialized = true;
                return true;
            })
            .catch(error => {
                console.error("Error initializing Tone.js:", error);
                return false;
            });
    } else {
        console.log('Audio system already initialized');
        audioInitialized = true;
        return Promise.resolve(true);
    }
}

// Function to start the audio context - called on user interaction
function startAudio() {
    initializeToneContext().then(success => {
        if (success) {
            // Update UI elements
            const audioNotice = document.getElementById('audioNotice');
            const autoPlayToggle = document.getElementById('autoPlayToggle');

            if (audioNotice) {
                audioNotice.style.opacity = '0';
                setTimeout(() => {
                    audioNotice.style.display = 'none';
                    if (autoPlayToggle) {
                        autoPlayToggle.style.display = 'flex';
                    }
                }, 500);
            }

            // Play welcome sound if first initialization
            if (!window.welcomeSoundPlayed) {
                window.welcomeSoundPlayed = true;
                setTimeout(playWelcomeChime, 300);
            }
        }
    });
}

// Make initializeAudio available globally
window.initializeAudio = function () {
    return initializeToneContext();
};

// Function to completely stop all audio
window.stopAllAudio = function () {
    console.log("Stopping all audio...");

    try {
        // Release all notes that might be currently playing
        if (synth && typeof synth.releaseAll === 'function') {
            synth.releaseAll();
        }

        // Cancel any scheduled events in Tone.js
        Tone.Transport.cancel();

        // Reset any animating lines
        animatingLines.clear();
        document.querySelectorAll('.line.thickened, .line.thinning, .line.plucked').forEach(line => {
            line.classList.remove('thickened', 'thinning', 'plucked');
        });

        console.log("All audio stopped");
    } catch (error) {
        console.error("Error stopping audio:", error);
    }
}

// Simulate interaction with a specific line
function simulateLineInteraction(lineElement, duration) {
    if (!lineElement || animatingLines.has(lineElement.dataset.id)) return;

    // Play the assigned note with music box characteristics
    const note = lineElement.dataset.note;

    // Get duration for the note
    // If duration was passed as a parameter, use that
    // Otherwise try to get from the dataset, or fall back to default 0.5s
    let noteDuration = 0.5; // Default duration

    if (duration !== undefined) {
        noteDuration = duration;
    } else if (lineElement.dataset.duration) {
        // Convert duration multiplier to actual seconds (with some adjustments for musicality)
        // Limit to range of 0.1 to 2.0 seconds
        noteDuration = Math.min(2.0, Math.max(0.1, parseFloat(lineElement.dataset.duration) * 0.5));
    }

    synth.triggerAttackRelease(note, noteDuration);

    // Visual effect - identical to user interaction code
    lineElement.classList.add('thickened');

    // Get current position for later restoring rotation speed
    lineElement.dataset.y = lineElement.getBoundingClientRect().top;

    // Track this animation
    animatingLines.add(lineElement.dataset.id);

    // Get current computed rotation to ensure smooth transition
    const computedStyle = window.getComputedStyle(lineElement);
    const transformMatrix = new DOMMatrix(computedStyle.transform);
    const currentAngle = Math.atan2(transformMatrix.b, transformMatrix.a) * (180 / Math.PI);

    // Update rotation variable to current position for smooth transition
    lineElement.style.setProperty('--rotation', `${currentAngle}deg`);

    // Pause current rotation
    lineElement.style.animationPlayState = 'paused';

    // Calculate appropriate rotation duration based on vertical position
    const y = parseFloat(lineElement.dataset.y);
    const height = window.innerHeight;
    const normalizedY = y / height;
    const minDuration = 10;
    const maxDuration = 40;
    const rotationDuration = minDuration + (normalizedY * (maxDuration - minDuration));

    // Store for later use
    lineElement.dataset.rotationDuration = rotationDuration;

    // Start the pendulum swing animation (combined counterclockwise and clockwise motion)
    const swingDuration = 1.5; // 1.5 seconds for the entire motion

    setTimeout(() => {
        // Apply the pendulum animation
        lineElement.style.animation = `pendulum-swing ${swingDuration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`;

        // When the pendulum completes, seamlessly transition back to normal rotation
        setTimeout(() => {
            if (animatingLines.has(lineElement.dataset.id)) {
                // Get the final angle after pendulum motion
                const matrix = new DOMMatrix(window.getComputedStyle(lineElement).transform);
                const endAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
                lineElement.style.setProperty('--rotation', `${endAngle}deg`);

                // Resume normal rotation with the stored duration
                lineElement.style.animation = `rotate ${rotationDuration}s linear infinite`;

                // Reset position to original (removing parallax temporarily)
                const originalX = parseFloat(lineElement.dataset.originalX);
                const originalY = parseFloat(lineElement.dataset.originalY);
                lineElement.style.left = `${originalX}px`;
                lineElement.style.top = `${originalY}px`;

                // Remove thinning class after transition completes
                setTimeout(() => {
                    lineElement.classList.remove('thinning');
                }, 1500);

                // Remove tracking to allow future interactions
                animatingLines.delete(lineElement.dataset.id);
            }
        }, swingDuration * 1000);

        // Start gradual thickness reduction
        lineElement.classList.remove('thickened');
        lineElement.classList.add('thinning');

        // Add the plucked class to create vertical oscillation simultaneously
        lineElement.classList.add('plucked');
    }, 50);

    // Remove plucked class when that animation completes
    lineElement.addEventListener('animationend', event => {
        if (event.animationName === 'pluck') {
            lineElement.classList.remove('plucked');
        }
    }, { once: true });
} 