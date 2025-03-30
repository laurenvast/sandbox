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

// Function to start the audio context
function startAudio() {
    if (Tone.context.state !== 'running') {
        Tone.start().then(() => {
            console.log('Audio context started');
            const audioNotice = document.getElementById('audioNotice');
            const autoPlayToggle = document.getElementById('autoPlayToggle');

            audioNotice.style.opacity = '0';
            setTimeout(() => {
                audioNotice.style.display = 'none';
                autoPlayToggle.style.display = 'flex'; // Show auto-play toggle after audio is enabled
            }, 500);

            // Play a subtle music box sound to confirm audio is working
            setTimeout(() => {
                // Play a quick ascending 3-note pattern typical of music boxes
                synth.triggerAttackRelease('C6', 0.1);
                setTimeout(() => synth.triggerAttackRelease('E6', 0.1), 150);
                setTimeout(() => synth.triggerAttackRelease('G6', 0.1), 300);

                // Start auto-play after the welcome notes
                setTimeout(() => {
                    if (autoPlay.enabled) {
                        startAutoPlay();
                    }
                }, 500);
            }, 300);
        });
    }
}

// Simulate interaction with a specific line
function simulateLineInteraction(lineElement) {
    if (!lineElement || animatingLines.has(lineElement.dataset.id)) return;

    // Play the assigned note with music box characteristics
    const note = lineElement.dataset.note;
    synth.triggerAttackRelease(note, 0.5);

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