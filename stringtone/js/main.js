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

    // Default song for autoplay
    const DEFAULT_SONG = "Twinkle Twinkle Little Star";

    // Initialize application
    initUI();
    setupEventListeners();
    drawLines();
    setupResizeHandler();

    // Initialize UI elements
    function initUI() {
        // Hide song input panel by default
        songInputPanel.classList.remove('active');

        // Hide auto-play toggle until audio is enabled
        autoPlayToggle.style.display = 'none';

        // Initialize checkbox to match auto-play state
        autoPlayCheckbox.checked = autoPlay.enabled;

        // Initialize song suggestions
        initSongSuggestions();
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Auto-play toggle
        autoPlayCheckbox.addEventListener('change', handleAutoPlayToggle);

        // Song input panel toggle
        toggleSongInput.addEventListener('click', toggleSongInputPanel);

        // Extract melody button
        extractButton.addEventListener('click', () => handleExtractButtonClick());

        // Extract melody on Enter key
        songNameInput.addEventListener('keypress', handleSongNameInputKeypress);

        // Start audio on first user interaction
        document.addEventListener('click', startAudio, { once: true });
        document.addEventListener('touchstart', startAudio, { once: true });
    }

    // Handle auto-play toggle change
    function handleAutoPlayToggle() {
        autoPlay.enabled = autoPlayCheckbox.checked;
        if (autoPlay.enabled) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    }

    // Toggle song input panel visibility
    function toggleSongInputPanel() {
        songInputPanel.classList.toggle('active');
        toggleSongInput.classList.toggle('active');
    }

    // Handle extract button click
    function handleExtractButtonClick() {
        const songName = songNameInput.value.trim();
        if (songName) {
            extractMelodyFromSong(songName);
        }
    }

    // Handle keypress in song name input
    function handleSongNameInputKeypress(e) {
        if (e.key === 'Enter') {
            const songName = songNameInput.value.trim();
            if (songName) {
                extractMelodyFromSong(songName);
            }
        }
    }

    // Initialize song suggestions
    function initSongSuggestions() {
        melodyExtractor.suggestedSongs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song;

            li.addEventListener('click', () => {
                songNameInput.value = song;
                extractMelodyFromSong(song);
            });
            suggestionList.appendChild(li);
        });
    }

    // Initialize default song
    function initDefaultSong() {
        if (melodyExtractor.hasPredefinedMelody(DEFAULT_SONG)) {
            console.log(`Setting up default song: ${DEFAULT_SONG}`);
            songNameInput.value = DEFAULT_SONG;

            // Wait for any previous audio operations to complete
            setTimeout(() => extractMelodyFromSong(DEFAULT_SONG), 500);
        }
    }

    // Extract melody from a song
    async function extractMelodyFromSong(songName) {
        // Update UI to show extraction is in progress
        updateUIForExtractionStart(songName);

        // Stop any current playback
        stopCurrentPlayback();

        try {
            // Extract melody
            const melodyNotes = await melodyExtractor.extractMelody(songName);

            if (melodyNotes && melodyNotes.length > 0) {
                handleSuccessfulExtraction(songName, melodyNotes);
            } else {
                handleFailedExtraction(songName);
            }
        } catch (error) {
            handleExtractionError(error);
        } finally {
            extractButton.disabled = false;
        }
    }

    // Update UI for extraction start
    function updateUIForExtractionStart(songName) {
        extractButton.disabled = true;
        extractionStatus.textContent = `Loading melody for "${songName}"...`;
        songInputContainer.classList.remove('pulsing');
        autoPlayToggle.classList.remove('song-active');
    }

    // Stop current playback
    function stopCurrentPlayback() {
        if (autoPlay.isPlaying) {
            stopAutoPlay();
        }

        if (window.stopAllAudio) {
            window.stopAllAudio();
        }
    }

    // Handle successful extraction
    function handleSuccessfulExtraction(songName, melodyNotes) {
        console.log(`Successfully extracted melody for "${songName}"`);

        // Set the melody for auto-play
        setSongMelody(melodyNotes, songName);

        // Update UI
        extractionStatus.textContent = `Now playing: "${songName}" (${melodyNotes.length} notes)`;
        songInputContainer.classList.add('pulsing');
        autoPlayToggle.classList.add('song-active');

        // Log melody information
        console.log(`Melody notes for "${songName}":`, melodyNotes);
        console.log(`Melody as JSON string: ${JSON.stringify(melodyNotes)}`);
    }

    // Handle failed extraction
    function handleFailedExtraction(songName) {
        console.warn(`Failed to extract melody for "${songName}"`);
        extractionStatus.textContent = `Could not extract melody from "${songName}". Please try another song.`;
        clearSongMelody();
    }

    // Handle extraction error
    function handleExtractionError(error) {
        console.error('Error in melody extraction:', error);
        extractionStatus.textContent = `Error: ${error.message || 'Could not extract melody'}`;
        clearSongMelody();
    }

    // Start the audio system
    function startAudio() {
        // Update UI
        if (audioNotice) {
            audioNotice.style.display = 'none';
        }

        autoPlayToggle.style.display = 'flex';

        // Initialize audio system
        if (window.initializeAudio) {
            try {
                window.initializeAudio().then(success => {
                    if (success) {
                        // Set up the default song after initialization
                        setTimeout(initDefaultSong, 1000);
                    }
                });
            } catch (error) {
                console.error("Error initializing audio:", error);
            }
        }
    }

    // Setup window resize handler
    function setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Store the current song notes before redrawing
                const currentSongNotes = activeSongNotes && activeSongNotes.length > 0
                    ? [...activeSongNotes]
                    : [];

                // Redraw the lines
                drawLines();

                // If there were song notes active, restore them to the new lines
                if (currentSongNotes.length > 0 && typeof updateLinesWithSongNotes === 'function') {
                    updateLinesWithSongNotes(currentSongNotes);
                }
            }, 300);
        });
    }

    // Fisher-Yates shuffle algorithm (utility function)
    // Only define if not already defined (to avoid conflicts with lines.js implementation)
    if (!window.shuffleArray) {
        window.shuffleArray = function (array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };
    }
}); 