document.addEventListener('DOMContentLoaded', () => {
    // Core elements
    const container = document.getElementById('container');
    const audioNotice = document.getElementById('audioNotice');
    const autoPlayToggle = document.getElementById('autoPlayToggle');
    const autoPlayCheckbox = document.getElementById('autoPlayCheckbox');

    // Song input elements
    const songInputContainer = document.getElementById('songInputContainer');
    const toggleSongInput = document.getElementById('toggleSongInput');
    const songInputPanel = document.getElementById('songInputPanel');
    const songNameInput = document.getElementById('songNameInput');
    const extractButton = document.getElementById('extractButton');
    const suggestionList = document.getElementById('suggestionList');
    const extractionStatus = document.getElementById('extractionStatus');

    // Hide song input panel by default
    songInputPanel.classList.remove('active');

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

    // Toggle song input panel visibility
    toggleSongInput.addEventListener('click', () => {
        songInputPanel.classList.toggle('active');
        toggleSongInput.classList.toggle('active');
    });

    // Initialize song suggestions
    melodyExtractor.suggestedSongs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song;

        li.addEventListener('click', () => {
            songNameInput.value = song;
            extractMelodyFromSong(song);
        });
        suggestionList.appendChild(li);
    });

    // Extract melody when button is clicked
    extractButton.addEventListener('click', () => {
        const songName = songNameInput.value.trim();
        if (songName) {
            extractMelodyFromSong(songName);
        }
    });

    // Also extract melody when Enter is pressed in the input field
    songNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const songName = songNameInput.value.trim();
            if (songName) {
                extractMelodyFromSong(songName);
            }
        }
    });

    // Function to extract melody from a song
    async function extractMelodyFromSong(songName) {
        // Update UI to show extraction is in progress
        extractButton.disabled = true;

        // Show loading message
        extractionStatus.textContent = `Loading melody for "${songName}"...`;

        songInputContainer.classList.remove('pulsing');
        autoPlayToggle.classList.remove('song-active');

        try {
            // Extract melody using our melodyExtractor (which checks for predefined melodies first)
            const melodyNotes = await melodyExtractor.extractMelody(songName);

            if (melodyNotes && melodyNotes.length > 0) {
                // Success! Set the melody for auto-play
                setSongMelody(melodyNotes);

                // Update UI to show success
                extractionStatus.textContent = `Now playing: "${songName}" (${melodyNotes.length} notes)`;

                songInputContainer.classList.add('pulsing');
                autoPlayToggle.classList.add('song-active');

                console.log(`Melody notes for "${songName}": ${JSON.stringify(melodyNotes)}`);
            } else {
                // Handle extraction failure
                extractionStatus.textContent = `Could not extract melody from "${songName}". Please try another song.`;

                // Return to regular auto-play
                clearSongMelody();
            }
        } catch (error) {
            console.error('Error in melody extraction:', error);
            extractionStatus.textContent = `Error: ${error.message || 'Could not extract melody'}`;

            // Return to regular auto-play
            clearSongMelody();
        } finally {
            // Re-enable the extract button
            extractButton.disabled = false;
        }
    }

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