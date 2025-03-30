document.addEventListener('DOMContentLoaded', () => {
    // Core elements
    const container = document.getElementById('container');
    const audioNotice = document.getElementById('audioNotice');

    // Unified Player elements
    const unifiedPlayer = document.getElementById('unifiedPlayer');
    const toggleSongPanel = document.getElementById('toggleSongPanel');
    const songPanel = document.getElementById('songPanel');
    const songNameInput = document.getElementById('songNameInput');
    const extractButton = document.getElementById('extractButton');
    const suggestionList = document.getElementById('suggestionList');
    const extractionStatus = document.getElementById('extractionStatus');
    const currentSongName = document.getElementById('currentSongName');
    const playerStatus = document.getElementById('playerStatus');
    const playPauseButton = document.getElementById('playPauseButton');
    const musicIcon = document.getElementById('musicIcon');

    // Default song for autoplay
    const DEFAULT_SONG = "Twinkle Twinkle Little Star";

    // Initialize application
    initUI();
    setupEventListeners();
    drawLines();
    setupResizeHandler();

    // Initialize UI elements
    function initUI() {
        // Hide song panel by default
        songPanel.classList.remove('active');

        // Hide unified player until audio is enabled
        unifiedPlayer.style.display = 'none';

        // Set initial player status text
        updatePlayerStatus();

        // Initialize song suggestions
        initSongSuggestions();

        // Add a status check interval to ensure UI stays in sync
        setInterval(ensureCorrectStatusClass, 2000);
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Toggle song panel
        toggleSongPanel.addEventListener('click', (e) => {
            toggleSongPanelVisibility();
            e.stopPropagation(); // Prevent propagation to parent elements
        });

        // Also make the header collapsible
        document.querySelector('.player-header').addEventListener('click', (e) => {
            // Only toggle if not clicking on play/pause button
            if (!e.target.closest('#playPauseButton')) {
                toggleSongPanelVisibility();
            }
        });

        // Play/Pause button
        playPauseButton.addEventListener('click', (e) => {
            togglePlayPause();
            e.stopPropagation(); // Prevent propagation to parent elements
        });

        // Extract melody button
        extractButton.addEventListener('click', () => handleExtractButtonClick());

        // Extract melody on Enter key
        songNameInput.addEventListener('keypress', handleSongNameInputKeypress);

        // Start audio on first user interaction
        document.addEventListener('click', startAudio, { once: true });
        document.addEventListener('touchstart', startAudio, { once: true });

        // Check scrolling when window is resized
        window.addEventListener('resize', checkAndApplyScrolling);
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (autoPlay.isPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }

        updatePlayerStatus();
    }

    // Update the player status text based on auto-play state
    function updatePlayerStatus() {
        // If the song is currently loading, don't update the player status
        if (currentSongName && currentSongName.getAttribute('data-loading') === 'true') {
            console.log('Song is currently loading, not updating player status');
            return;
        }

        if (autoPlay.isPlaying) {
            // Remove the separate player status since we're combining it
            // playerStatus.textContent = "Now Playing";
            playPauseButton.textContent = "⏸";
            unifiedPlayer.classList.add('active');

            // Update currently playing indicator in suggestion list
            if (autoPlay.currentSongName) {
                updateCurrentlyPlayingIndicator(autoPlay.currentSongName);
            }

            // Make music note dance
            musicIcon.classList.add('dancing');

            // Update the current song display to include playing status
            if (currentSongName && currentSongName.textContent !== "None") {
                updateCurrentSongDisplay(autoPlay.currentSongName || currentSongName.textContent, true);
            }
        } else {
            // Remove the separate player status since we're combining it
            // playerStatus.textContent = "Paused";
            playPauseButton.textContent = "⏵";

            // Remove playing indicator from all songs in the list when paused
            Array.from(suggestionList.children).forEach(li => {
                li.classList.remove('playing');
            });

            // Only remove active class if not currently displaying a song
            if (!currentSongName.textContent || currentSongName.textContent === "None") {
                unifiedPlayer.classList.remove('active');
            } else {
                // Update the current song display to show paused status
                updateCurrentSongDisplay(currentSongName.textContent, false);
            }

            // Stop music note dancing
            musicIcon.classList.remove('dancing');
        }
    }

    // Toggle song panel visibility
    function toggleSongPanelVisibility() {
        songPanel.classList.toggle('active');
        toggleSongPanel.classList.toggle('active');
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
            li.setAttribute('data-song-name', song);

            li.addEventListener('click', () => {
                songNameInput.value = song;
                extractMelodyFromSong(song);
            });
            suggestionList.appendChild(li);
        });

        // If there's a default song already playing, mark it
        if (autoPlay.currentSongName) {
            updateCurrentlyPlayingIndicator(autoPlay.currentSongName);
        }
    }

    // Initialize default song
    function initDefaultSong() {
        if (melodyExtractor.hasPredefinedMelody(DEFAULT_SONG)) {
            console.log(`Setting up default song: ${DEFAULT_SONG}`);
            songNameInput.value = DEFAULT_SONG;

            // Initialize the current song display
            updateCurrentSongDisplay(DEFAULT_SONG, false);

            // Extract and play the default melody
            setTimeout(() => {
                extractMelodyFromSong(DEFAULT_SONG);

                // Ensure player status is updated after extraction
                setTimeout(updatePlayerStatus, 1000);
            }, 500);
        } else {
            // If no default song, still initialize the current song display
            updateCurrentSongDisplay("None", false);
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

        // Store the loading song name for reference
        const loadingSong = songName;

        // Update the current song name to show loading status
        if (currentSongName) {
            // Prepare all changes before making any DOM modifications to ensure synchronous updates
            console.log(`Setting up loading UI for: ${loadingSong}`);

            // Set data attributes first to track loading state
            currentSongName.setAttribute('data-loading', 'true');
            currentSongName.setAttribute('data-loading-song', loadingSong);

            // Now remove existing status classes
            currentSongName.classList.remove('status-playing', 'status-paused', 'status-error');

            // Apply text content and loading class in immediate succession
            // This ensures they happen in the same paint cycle
            currentSongName.textContent = `Loading: ${loadingSong}`;
            currentSongName.classList.add('status-loading');

            if (playerStatus) {
                playerStatus.style.display = 'none';
            }
        }

        // Update extraction status
        if (extractionStatus) {
            extractionStatus.textContent = `Loading melody for "${loadingSong}"...`;
        }

        unifiedPlayer.classList.remove('pulsing');
        unifiedPlayer.classList.remove('active');
    }

    // Stop current playback
    function stopCurrentPlayback() {
        if (autoPlay.isPlaying) {
            stopAutoPlay();
        }

        if (window.stopAllAudio) {
            window.stopAllAudio();
        }

        // Only update player status if not in loading state
        if (!(currentSongName && currentSongName.getAttribute('data-loading') === 'true')) {
            updatePlayerStatus();
        }
    }

    // A helper function to reset all status classes
    function resetStatusClasses() {
        if (currentSongName) {
            console.log('Resetting all status classes');
            // Clear all status classes
            currentSongName.classList.remove('status-loading', 'status-playing', 'status-paused', 'status-error');
            // Remove the loading attributes
            currentSongName.removeAttribute('data-loading');
            currentSongName.removeAttribute('data-loading-song');
        }
    }

    // Handle successful extraction
    function handleSuccessfulExtraction(songName, melodyNotes) {
        try {
            // Set the melody for auto-play
            setSongMelody(melodyNotes, songName);

            // Update UI
            if (extractionStatus) {
                extractionStatus.textContent = `"${songName}" loaded`;
            }

            unifiedPlayer.classList.add('pulsing');
            unifiedPlayer.classList.add('active');

            // Clear loading state using our helper function
            resetStatusClasses();

            // Update current song display
            updateCurrentSongDisplay(songName, true);

            // Add the song to the top of the suggestion list if it's not already in predefined songs
            addSongToSuggestionList(songName);

            // Show the song panel for a short time before hiding it
            setTimeout(() => {
                if (songPanel && songPanel.classList.contains('active')) {
                    toggleSongPanelVisibility();
                }

                // Stop pulsing effect after panel closes
                setTimeout(() => {
                    unifiedPlayer.classList.remove('pulsing');
                }, 500);
            }, 1500);

            // Clear input field for next search
            if (songNameInput) {
                songNameInput.value = '';
            }
        } catch (err) {
            console.error('Error in handleSuccessfulExtraction:', err);
        }
    }

    // Handle failed extraction
    function handleFailedExtraction(songName) {
        try {
            console.warn(`Failed to extract melody for "${songName}"`);

            if (extractionStatus) {
                extractionStatus.textContent = `Could not extract melody from "${songName}". Please try another song.`;
            }

            // Clear loading state using our helper function
            resetStatusClasses();

            // Update the current song name to show error
            if (currentSongName) {
                currentSongName.textContent = `Failed: ${songName}`;
                currentSongName.classList.add('status-error');

                // Show player status for additional info
                if (playerStatus) {
                    playerStatus.style.display = 'block';
                    playerStatus.textContent = "Try another song";
                }
            }

            clearSongMelody();

            // Update current song display to show no song is active after a short delay
            setTimeout(() => {
                updateCurrentSongDisplay("None", false);
            }, 3000);
        } catch (err) {
            console.error('Error in handleFailedExtraction:', err);
        }
    }

    // Handle extraction error
    function handleExtractionError(error) {
        try {
            console.error('Error in melody extraction:', error);

            if (extractionStatus) {
                extractionStatus.textContent = `Error: ${error.message || 'Could not extract melody'}`;
            }

            // Clear loading state using our helper function
            resetStatusClasses();

            // Update the current song name to show error
            if (currentSongName) {
                currentSongName.textContent = `Error: ${error.message || 'Extraction failed'}`;
                currentSongName.classList.add('status-error');

                // Show player status for additional info
                if (playerStatus) {
                    playerStatus.style.display = 'block';
                    playerStatus.textContent = "Please try again";
                }
            }

            clearSongMelody();

            // Update current song display to show no song is active after a short delay
            setTimeout(() => {
                updateCurrentSongDisplay("None", false);
            }, 3000);
        } catch (err) {
            console.error('Error in handleExtractionError:', err);
        }
    }

    // Start audio context on first user interaction
    function startAudio() {
        // Hide audio notice
        audioNotice.style.opacity = 0;
        setTimeout(() => {
            audioNotice.style.display = 'none';
        }, 500);

        // Show unified player
        unifiedPlayer.style.display = 'block';

        // Initialize audio system
        if (window.initializeAudio) {
            try {
                window.initializeAudio().then(success => {
                    if (success) {
                        // Set up the default song after initialization
                        setTimeout(() => {
                            initDefaultSong();

                            // Ensure player status is correctly set after default song loads
                            setTimeout(() => {
                                updatePlayerStatus();
                            }, 1500);
                        }, 1000);
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

    // Update the current song display
    function updateCurrentSongDisplay(songName, isActive) {
        if (!currentSongName) {
            return; // Exit early if currentSongName is not defined
        }

        // Check if the song is currently loading - if so, don't update
        if (currentSongName.getAttribute('data-loading') === 'true') {
            console.log('Song is currently loading, not updating display');

            // Ensure the loading song name is displayed
            const loadingSong = currentSongName.getAttribute('data-loading-song');
            if (loadingSong && currentSongName.textContent !== `Loading: ${loadingSong}`) {
                currentSongName.textContent = `Loading: ${loadingSong}`;
            }

            return;
        }

        // Reset all status classes
        resetStatusClasses();

        // Combine song name with status (playing/paused)
        if (songName && songName !== 'None') {
            // Set the text content without the prefix (it's added via CSS)
            currentSongName.textContent = songName;

            // Add the appropriate status class
            if (isActive) {
                currentSongName.classList.add('status-playing');
            } else {
                currentSongName.classList.add('status-paused');
            }

            // Double-check with autoPlay status to ensure consistency
            if (autoPlay && typeof autoPlay.isPlaying !== 'undefined') {
                if (autoPlay.isPlaying && !currentSongName.classList.contains('status-playing')) {
                    // If music is playing but we don't have status-playing, fix it
                    currentSongName.classList.remove('status-paused', 'status-error', 'status-loading');
                    currentSongName.classList.add('status-playing');
                } else if (!autoPlay.isPlaying && currentSongName.classList.contains('status-playing')) {
                    // If music is not playing but we have status-playing, fix it
                    currentSongName.classList.remove('status-playing', 'status-error', 'status-loading');
                    currentSongName.classList.add('status-paused');
                }
            }

            // Hide the separate player status text since it's now combined
            if (playerStatus) {
                playerStatus.style.display = 'none';
            }
        } else {
            currentSongName.textContent = 'None';

            // Show the separate player status for general status messages
            if (playerStatus) {
                playerStatus.style.display = 'block';
                playerStatus.textContent = isActive ? "Ready to play" : "Paused";
            }
        }

        if (isActive) {
            unifiedPlayer.classList.add('active');
            // Update which song is currently playing in the suggestion list
            updateCurrentlyPlayingIndicator(songName);
        } else {
            unifiedPlayer.classList.remove('active');
        }

        // Check if scrolling is needed for long names
        checkAndApplyScrolling();
    }

    // Check if song name is too long and apply scrolling if needed
    function checkAndApplyScrolling() {
        // Reset scrolling class
        currentSongName.classList.remove('scrolling');

        // Get the actual text width
        const textWidth = currentSongName.clientWidth;
        const containerWidth = currentSongName.parentElement.clientWidth;

        // If the text is wider than its container, enable scrolling
        if (textWidth > containerWidth) {
            currentSongName.classList.add('scrolling');
        }
    }

    // Add song to the top of suggestion list if not already present
    function addSongToSuggestionList(songName) {
        // Skip if the song is already in the predefined songs list
        if (melodyExtractor.suggestedSongs.includes(songName)) {
            // Still need to update the currently playing indicator
            updateCurrentlyPlayingIndicator(songName);
            return;
        }

        // Check if this song is already in the list from a previous request
        const existingLi = Array.from(suggestionList.children).find(li => li.textContent === songName);
        if (existingLi) {
            // Move it to the top if it exists
            suggestionList.removeChild(existingLi);
            suggestionList.insertBefore(existingLi, suggestionList.firstChild);
            // Update the currently playing indicator
            updateCurrentlyPlayingIndicator(songName);
            return;
        }

        // Create a new list item for the song
        const li = document.createElement('li');
        li.textContent = songName;
        li.setAttribute('data-song-name', songName);

        // Add click handler
        li.addEventListener('click', () => {
            songNameInput.value = songName;
            extractMelodyFromSong(songName);
        });

        // Add to the top of the list
        if (suggestionList.firstChild) {
            suggestionList.insertBefore(li, suggestionList.firstChild);
        } else {
            suggestionList.appendChild(li);
        }

        // Update the currently playing indicator
        updateCurrentlyPlayingIndicator(songName);
    }

    // Update the indicator showing which melody is currently playing
    function updateCurrentlyPlayingIndicator(currentSongName) {
        // Remove 'playing' class from all list items
        Array.from(suggestionList.children).forEach(li => {
            li.classList.remove('playing');
        });

        // Add 'playing' class to the currently playing song
        if (currentSongName && currentSongName !== 'None') {
            const songItem = Array.from(suggestionList.children).find(li => li.textContent === currentSongName);
            if (songItem) {
                songItem.classList.add('playing');
            }
        }
    }

    // Fix for setSongMelody to ensure status-loading is removed and status-playing is applied
    const originalSetSongMelody = setSongMelody;
    setSongMelody = function (melodyNotes, songName) {
        // Call the original function
        originalSetSongMelody(melodyNotes, songName);

        // Ensure the loading status is completely removed
        if (currentSongName) {
            // Clear loading class and attribute
            currentSongName.classList.remove('status-loading');
            currentSongName.removeAttribute('data-loading');

            // If music is playing, ensure we have the playing status
            if (autoPlay.isPlaying) {
                currentSongName.classList.remove('status-paused', 'status-error');
                currentSongName.classList.add('status-playing');
            }
        }
    };

    // Wrap the existing startAutoPlay function to ensure correct status
    if (typeof startAutoPlay !== 'undefined') {
        const originalStartAutoPlay = startAutoPlay;
        startAutoPlay = function () {
            // Call the original function
            const result = originalStartAutoPlay.apply(this, arguments);

            // Ensure the status is correctly set after starting playback
            if (currentSongName) {
                // Remove any other status classes
                currentSongName.classList.remove('status-paused', 'status-error', 'status-loading');
                currentSongName.removeAttribute('data-loading');

                // Set playing status
                currentSongName.classList.add('status-playing');
            }

            return result;
        };
    }

    // Wrap the existing stopAutoPlay function to ensure correct status
    if (typeof stopAutoPlay !== 'undefined') {
        const originalStopAutoPlay = stopAutoPlay;
        stopAutoPlay = function () {
            // Call the original function
            const result = originalStopAutoPlay.apply(this, arguments);

            // Ensure the status is correctly set after stopping playback
            if (currentSongName && !currentSongName.getAttribute('data-loading')) {
                // Remove any other status classes
                currentSongName.classList.remove('status-playing', 'status-error', 'status-loading');

                // Set paused status
                currentSongName.classList.add('status-paused');
            }

            return result;
        };
    }

    // Failsafe function to ensure the status class is always correct
    function ensureCorrectStatusClass() {
        if (!currentSongName) return;

        // Handle loading state first
        if (currentSongName.getAttribute('data-loading') === 'true') {
            // Make sure we have the loading class
            if (!currentSongName.classList.contains('status-loading')) {
                console.log('Correcting missing status-loading class');
                currentSongName.classList.remove('status-playing', 'status-paused', 'status-error');
                currentSongName.classList.add('status-loading');
            }

            // Make sure the content shows the correct loading song
            const loadingSong = currentSongName.getAttribute('data-loading-song');
            if (loadingSong && currentSongName.textContent !== `Loading: ${loadingSong}`) {
                console.log(`Correcting loading song text to: ${loadingSong}`);
                currentSongName.textContent = `Loading: ${loadingSong}`;
            }

            return;
        } else if (currentSongName.classList.contains('status-loading')) {
            // If we have the loading class but not the data attribute, this is inconsistent
            console.log('Inconsistent state: status-loading class without data-loading attribute');

            // Check if we have a loading song stored
            const loadingSong = currentSongName.getAttribute('data-loading-song');
            if (loadingSong) {
                // We have loading song info, so fully restore the loading state
                console.log(`Restoring proper loading state for: ${loadingSong}`);
                currentSongName.setAttribute('data-loading', 'true');
                if (currentSongName.textContent !== `Loading: ${loadingSong}`) {
                    currentSongName.textContent = `Loading: ${loadingSong}`;
                }
                return;
            } else {
                // No loading info available, so remove the loading class
                console.log('Removing incorrect status-loading class');
                currentSongName.classList.remove('status-loading');
                // Continue with normal status checking below
            }
        }

        // Get all status classes
        const hasLoading = currentSongName.classList.contains('status-loading');
        const hasPlaying = currentSongName.classList.contains('status-playing');
        const hasPaused = currentSongName.classList.contains('status-paused');
        const hasError = currentSongName.classList.contains('status-error');

        // Check if we're in an inconsistent state
        if (autoPlay.isPlaying && !hasPlaying) {
            // Should be playing but isn't
            console.log('Status correction: Setting to playing');
            currentSongName.classList.remove('status-loading', 'status-paused', 'status-error');
            currentSongName.classList.add('status-playing');
        } else if (!autoPlay.isPlaying && !hasPaused && !hasError && !hasLoading) {
            // Should be paused but isn't
            console.log('Status correction: Setting to paused');
            currentSongName.classList.remove('status-loading', 'status-playing', 'status-error');
            currentSongName.classList.add('status-paused');
        }
    }
}); 