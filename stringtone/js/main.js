document.addEventListener('DOMContentLoaded', () => {
    // Core elements
    const container = document.getElementById('container');
    const audioNotice = document.getElementById('audioNotice');
    const autoPlayToggle = document.getElementById('autoPlayToggle');
    const autoPlayCheckbox = document.getElementById('autoPlayCheckbox');

    // Hide auto-play toggle until audio is enabled
    autoPlayToggle.style.display = 'none';

    // Initialize checkbox to match auto-play state
    autoPlayCheckbox.checked = autoPlay.enabled;

    // Add auto-play toggle event listener
    autoPlayCheckbox.addEventListener('change', () => {
        autoPlay.enabled = autoPlayCheckbox.checked;
        if (autoPlay.enabled) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    });

    // Start Tone.js audio context on first user interaction
    document.addEventListener('click', startAudio, { once: true });
    document.addEventListener('touchstart', startAudio, { once: true });

    // Fisher-Yates shuffle algorithm (utility function used in multiple modules)
    window.shuffleArray = function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Initial draw
    drawLines();

    // Redraw on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(drawLines, 300);
    });
}); 