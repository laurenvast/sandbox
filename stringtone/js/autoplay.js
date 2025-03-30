// Auto-play configuration
const autoPlay = {
    enabled: true,
    isPlaying: false,
    tempo: 120, // BPM - beats per minute
    minTempo: 80,
    maxTempo: 160,
    currentPattern: null,
    patternIndex: 0,
    patternLength: 16, // Default pattern length
    noteGroups: [], // Each element will be a group of notes planned to play together
    lastPlayedLines: new Map(), // Map to track recently played lines to avoid immediate repetition
    timerId: null,
    melodyType: 'arpeggio', // 'arpeggio', 'scale', 'random', 'cluster', 'song'
    dynamicLevel: 'medium', // 'soft', 'medium', 'loud'
    phraseDuration: 8000, // Duration of a musical phrase in ms
    phraseTimer: null,
    patternChangeTime: null,
    usingSongMelody: false, // Flag to indicate if we're using an extracted song melody
    songMelodyNotes: [], // Array to hold the notes of the extracted song melody
    currentSongName: null, // Track the currently playing song name
    isChangingSong: false  // Lock to prevent concurrent song changes
};

// Start auto-play with musical patterns
function startAutoPlay() {
    if (autoPlay.isPlaying) return;

    autoPlay.isPlaying = true;
    autoPlay.patternChangeTime = Date.now() + autoPlay.phraseDuration;

    // Generate initial pattern
    generateMusicalPattern();

    // Start the playback loop
    scheduleNextNote();

    // Set up timer to change patterns for musical variety
    // Only if not using song melody
    if (!autoPlay.usingSongMelody) {
        autoPlay.phraseTimer = setInterval(() => {
            if (autoPlay.enabled) {
                generateMusicalPattern();
                autoPlay.patternIndex = 0; // Reset to beginning of new pattern

                // Randomly change melodic style for variety
                changeMusicalStyle();
            }
        }, autoPlay.phraseDuration);
    }
}

// Stop auto-play
function stopAutoPlay() {
    autoPlay.isPlaying = false;

    if (autoPlay.timerId) {
        clearTimeout(autoPlay.timerId);
        autoPlay.timerId = null;
    }

    if (autoPlay.phraseTimer) {
        clearInterval(autoPlay.phraseTimer);
        autoPlay.phraseTimer = null;
    }
}

// Reset playback state and clean up audio
function resetPlaybackState() {
    // Stop current auto-play if running
    if (autoPlay.isPlaying) {
        stopAutoPlay();
    }

    // Clear any existing timers
    if (autoPlay.timerId) {
        clearTimeout(autoPlay.timerId);
        autoPlay.timerId = null;
    }

    if (autoPlay.phraseTimer) {
        clearInterval(autoPlay.phraseTimer);
        autoPlay.phraseTimer = null;
    }

    // Reset state
    autoPlay.noteGroups = [];
    autoPlay.patternIndex = 0;
    autoPlay.lastPlayedLines = new Map();

    // Clean up any ongoing audio
    if (window.stopAllAudio) {
        try {
            window.stopAllAudio();
        } catch (audioError) {
            console.warn("Error stopping audio:", audioError);
        }
    }
}

// Set a song melody to be used for auto-play
function setSongMelody(melodyNotes, songName) {
    // Prevent concurrent song changes
    if (autoPlay.isChangingSong) {
        console.log('Song change in progress, please wait...');
        return;
    }

    autoPlay.isChangingSong = true;
    console.log(`Setting up song melody for "${songName}"...`);

    try {
        // Reset the playback state
        resetPlaybackState();

        // Set the current song name
        autoPlay.currentSongName = songName || 'Unknown Melody';

        // Set the new melody notes
        autoPlay.songMelodyNotes = [...melodyNotes];
        autoPlay.patternLength = melodyNotes.length;

        // Store each note directly with its original value
        autoPlay.noteGroups = melodyNotes.map(note => ({
            noteValue: note,
            isOriginal: true
        }));

        // Set flag to indicate we're using a song melody
        autoPlay.usingSongMelody = true;
        autoPlay.melodyType = 'song';

        // Adjust tempo based on melody length (longer melodies play a bit faster)
        autoPlay.tempo = Math.min(160, Math.max(80, 100 + melodyNotes.length / 2));

        // Update all the lines with notes from this song melody
        if (typeof updateLinesWithSongNotes === 'function') {
            updateLinesWithSongNotes(melodyNotes);
        }

        console.log(`Now playing: "${autoPlay.currentSongName}" with ${melodyNotes.length} notes`);

        // Start auto-play with the new melody after a short delay
        if (autoPlay.enabled) {
            setTimeout(startAutoPlay, 100);
        }
    } catch (error) {
        console.error('Error setting song melody:', error);
    } finally {
        // Always release the lock, even if there's an error
        autoPlay.isChangingSong = false;
    }
}

// Clear song melody and return to normal auto-play
function clearSongMelody() {
    if (!autoPlay.usingSongMelody && !autoPlay.isPlaying) return;

    // Prevent concurrent song changes
    if (autoPlay.isChangingSong) {
        console.log('Song change in progress, please wait...');
        return;
    }

    autoPlay.isChangingSong = true;
    console.log('Clearing song melody...');

    try {
        // Reset the playback state
        resetPlaybackState();

        // Reset song-related state
        autoPlay.usingSongMelody = false;
        autoPlay.songMelodyNotes = [];
        autoPlay.currentSongName = null;

        // Clear the song notes from lines too
        if (typeof updateLinesWithSongNotes === 'function') {
            updateLinesWithSongNotes([]);
        }

        // Generate a new pattern with regular algorithm
        autoPlay.melodyType = ['arpeggio', 'scale', 'random', 'cluster'][Math.floor(Math.random() * 4)];
        generateMusicalPattern();

        // Start new auto-play if enabled after a short delay
        if (autoPlay.enabled) {
            setTimeout(startAutoPlay, 100);
        }

        console.log('Cleared song melody, returning to regular auto-play');
    } catch (error) {
        console.error('Error clearing song melody:', error);

        // Force reset of critical state variables
        autoPlay.isPlaying = false;
        autoPlay.usingSongMelody = false;
    } finally {
        // Always release the lock, even if there's an error
        autoPlay.isChangingSong = false;
    }
}

// Generate a musical pattern based on the current melodic type
function generateMusicalPattern() {
    // If using song melody, we don't need to generate a pattern
    if (autoPlay.usingSongMelody) return;

    const pattern = [];
    autoPlay.noteGroups = [];

    // Select a pattern length (8, 12, or 16 notes)
    autoPlay.patternLength = [8, 12, 16][Math.floor(Math.random() * 3)];

    // Note: For algorithmic patterns we still use arrays of indices
    // This is different from song melodies which use objects with noteValue properties
    // These arrays of indices will be handled by the updated playAutomatedLines function

    // Create different note patterns based on the melody type
    switch (autoPlay.melodyType) {
        case 'arpeggio':
            // Create an arpeggio-like pattern (ascending, descending, or mixed)
            const arpeggioType = ['ascending', 'descending', 'mixed'][Math.floor(Math.random() * 3)];
            const baseNoteIndices = [];

            // Choose 3-4 notes from the scale to form a chord
            while (baseNoteIndices.length < 3 + Math.floor(Math.random() * 2)) {
                const idx = Math.floor(Math.random() * musicBoxScale.length);
                if (!baseNoteIndices.includes(idx)) {
                    baseNoteIndices.push(idx);
                }
            }

            if (arpeggioType === 'ascending') {
                baseNoteIndices.sort((a, b) => a - b);
            } else if (arpeggioType === 'descending') {
                baseNoteIndices.sort((a, b) => b - a);
            }

            // Create the arpeggio pattern
            for (let i = 0; i < autoPlay.patternLength; i++) {
                let position;
                if (arpeggioType === 'mixed') {
                    position = Math.floor(Math.random() * baseNoteIndices.length);
                } else {
                    position = i % baseNoteIndices.length;
                }

                // Add as a single note or occasionally as a chord
                if (Math.random() < 0.2) { // 20% chance for a chord
                    // Add a two-note chord
                    const secondNoteIdx = (baseNoteIndices[position] + 2) % musicBoxScale.length;
                    autoPlay.noteGroups.push([baseNoteIndices[position], secondNoteIdx]);
                } else {
                    autoPlay.noteGroups.push([baseNoteIndices[position]]);
                }
            }
            break;

        case 'scale':
            // Create a scale-like pattern (continuous motion up/down the scale)
            let direction = Math.random() < 0.5 ? 1 : -1; // up or down
            let currentIdx = Math.floor(Math.random() * musicBoxScale.length);

            for (let i = 0; i < autoPlay.patternLength; i++) {
                autoPlay.noteGroups.push([currentIdx]);

                // Move up or down the scale
                currentIdx += direction;

                // If we reach the edges, change direction
                if (currentIdx >= musicBoxScale.length || currentIdx < 0) {
                    direction *= -1;
                    currentIdx += direction * 2; // Adjust to stay in bounds
                }

                // Occasionally change direction for variety
                if (Math.random() < 0.2) {
                    direction *= -1;
                }
            }
            break;

        case 'random':
            // Completely random pattern but still musical
            for (let i = 0; i < autoPlay.patternLength; i++) {
                // 10% chance of silence (rest)
                if (Math.random() < 0.1) {
                    autoPlay.noteGroups.push([]);
                }
                // 15% chance of a chord
                else if (Math.random() < 0.15) {
                    const noteIdx1 = Math.floor(Math.random() * musicBoxScale.length);
                    const interval = [2, 4, 7][Math.floor(Math.random() * 3)]; // 2nd, 3rd, or 5th
                    const noteIdx2 = (noteIdx1 + interval) % musicBoxScale.length;
                    autoPlay.noteGroups.push([noteIdx1, noteIdx2]);
                }
                // 75% chance of a single note
                else {
                    autoPlay.noteGroups.push([Math.floor(Math.random() * musicBoxScale.length)]);
                }
            }
            break;

        case 'cluster':
            // Create a pattern with clusters of notes close together in time
            for (let i = 0; i < autoPlay.patternLength; i++) {
                // Create clusters of 1-3 notes
                if (i % 4 === 0) { // Start of a cluster
                    const clusterSize = 1 + Math.floor(Math.random() * 3);
                    const baseNoteIdx = Math.floor(Math.random() * musicBoxScale.length);

                    for (let j = 0; j < clusterSize && i + j < autoPlay.patternLength; j++) {
                        if (j === 0) {
                            autoPlay.noteGroups.push([baseNoteIdx]);
                        } else {
                            const offset = [-2, -1, 1, 2][Math.floor(Math.random() * 4)];
                            let newIdx = (baseNoteIdx + offset + musicBoxScale.length) % musicBoxScale.length;
                            autoPlay.noteGroups.push([newIdx]);
                        }
                    }
                    i += clusterSize - 1; // Skip ahead
                } else {
                    // Outside clusters, use random notes or rests
                    if (Math.random() < 0.3) { // 30% chance of silence
                        autoPlay.noteGroups.push([]);
                    } else {
                        autoPlay.noteGroups.push([Math.floor(Math.random() * musicBoxScale.length)]);
                    }
                }
            }
            break;
    }

    autoPlay.currentPattern = pattern;
    autoPlay.patternIndex = 0;

    // Adjust tempo slightly for variety (within bounds)
    autoPlay.tempo = autoPlay.minTempo + Math.floor(Math.random() * (autoPlay.maxTempo - autoPlay.minTempo));
}

// Randomly change the musical style for variety
function changeMusicalStyle() {
    // Pick a new melody type
    const melodyTypes = ['arpeggio', 'scale', 'random', 'cluster'];
    let newType;
    do {
        newType = melodyTypes[Math.floor(Math.random() * melodyTypes.length)];
    } while (newType === autoPlay.melodyType);

    autoPlay.melodyType = newType;

    // Change dynamic level occasionally
    if (Math.random() < 0.4) { // 40% chance to change dynamics
        autoPlay.dynamicLevel = ['soft', 'medium', 'loud'][Math.floor(Math.random() * 3)];
    }

    // Change phrase duration for variety
    autoPlay.phraseDuration = 6000 + Math.floor(Math.random() * 6000); // 6-12 seconds
}

// Schedule the next note or chord in the pattern
function scheduleNextNote() {
    if (!autoPlay.isPlaying || !autoPlay.enabled) return;

    // Calculate how much time between notes based on tempo
    // 60000 ms / tempo = ms per quarter note
    const quarterNoteTime = 60000 / autoPlay.tempo;

    let noteTime;

    if (autoPlay.usingSongMelody) {
        // For song melodies, use more consistent timing
        // Most song melodies work well with quarter notes
        noteTime = quarterNoteTime;

        // Only add very slight human feel (±2%) for song melodies
        const minimalHumanFeel = 1 + (Math.random() * 0.04 - 0.02);
        noteTime *= minimalHumanFeel;
    } else {
        // For algorithmic melodies, use more varied timing
        // Calculate variations for different note lengths
        const noteDurations = [
            quarterNoteTime / 2,      // Eighth note (0.5x quarter note)
            quarterNoteTime,         // Quarter note (1x)
            quarterNoteTime * 1.5    // Dotted quarter note (1.5x)
        ];

        // Generate a weighted selection favoring quarter notes
        // 20% eighth notes, 60% quarter notes, 20% dotted quarter notes
        let durationIndex;
        const rand = Math.random();
        if (rand < 0.2) {
            durationIndex = 0; // Eighth
        } else if (rand < 0.8) {
            durationIndex = 1; // Quarter
        } else {
            durationIndex = 2; // Dotted quarter
        }

        // Get the note timing
        noteTime = noteDurations[durationIndex];

        // Add a slight human feel with +/- 5% timing variations
        const humanFeel = 1 + (Math.random() * 0.1 - 0.05);
        noteTime *= humanFeel;
    }

    // Before playing, check if we should play now or add a rest
    if (autoPlay.patternIndex < autoPlay.noteGroups.length) {
        const noteItem = autoPlay.noteGroups[autoPlay.patternIndex];

        // Check if we have a note to play
        if (noteItem) {
            if (autoPlay.usingSongMelody) {
                // For song melodies, we have note objects
                playNoteDirectly(noteItem);
            } else {
                // For other melody types, we still have arrays of indices
                playAutomatedLines(noteItem);
            }
        }

        // Move to next note in pattern
        autoPlay.patternIndex = (autoPlay.patternIndex + 1) % autoPlay.noteGroups.length;
    }

    // Schedule the next note
    autoPlay.timerId = setTimeout(scheduleNextNote, noteTime);
}

// Play a note directly without relying on lines
function playNoteDirectly(noteItem) {
    if (!autoPlay.enabled) return;

    const noteValue = noteItem.noteValue;

    // Try to find a matching line for visual feedback
    let matchingLine = null;

    // Get the window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Define edge boundaries (consider 10% of screen width/height as edge)
    const edgeThresholdX = windowWidth * 0.1;
    const edgeThresholdY = windowHeight * 0.1;

    // First try to find a non-edge line with matching note
    parallax.lines.forEach(line => {
        if (!matchingLine && !animatingLines.has(line.dataset.id)) {
            const lineNote = line.dataset.note;

            // Get line position
            const rect = line.getBoundingClientRect();
            const lineX = rect.left + rect.width / 2;
            const lineY = rect.top + rect.height / 2;

            // Check if line is not at the edge
            const isEdgeLine = (
                lineX < edgeThresholdX ||
                lineX > (windowWidth - edgeThresholdX) ||
                lineY < edgeThresholdY ||
                lineY > (windowHeight - edgeThresholdY)
            );

            // Try for an exact match first, but only use it if not at edge
            if (lineNote === noteValue && !isEdgeLine) {
                matchingLine = line;
            }
        }
    });

    // If we couldn't find an exact match, try to find a non-edge line
    if (!matchingLine) {
        // Get all available lines that aren't at the edges
        const availableLines = [...parallax.lines].filter(line => {
            if (animatingLines.has(line.dataset.id)) return false;

            // Check position
            const rect = line.getBoundingClientRect();
            const lineX = rect.left + rect.width / 2;
            const lineY = rect.top + rect.height / 2;

            // Return true only for lines not at edges
            return !(
                lineX < edgeThresholdX ||
                lineX > (windowWidth - edgeThresholdX) ||
                lineY < edgeThresholdY ||
                lineY > (windowHeight - edgeThresholdY)
            );
        });

        if (availableLines.length > 0) {
            matchingLine = availableLines[Math.floor(Math.random() * availableLines.length)];
        } else {
            // If all lines are at edges or animating, fall back to any non-animating line
            const anyAvailableLine = [...parallax.lines].filter(
                line => !animatingLines.has(line.dataset.id)
            );

            if (anyAvailableLine.length > 0) {
                matchingLine = anyAvailableLine[Math.floor(Math.random() * anyAvailableLine.length)];
            }
        }
    }

    // Play the sound directly
    synth.triggerAttackRelease(noteValue, 0.5);

    // Animate a line for visual feedback if one is available
    if (matchingLine) {
        simulateLineInteraction(matchingLine);
    }
}

// Play one or more lines automatically
function playAutomatedLines(noteIndices) {
    // Handle both formats: array of indices (old) or note object (new)
    if (!autoPlay.enabled) return;

    // If we have a note object (from song melody), use playNoteDirectly instead
    if (noteIndices && typeof noteIndices === 'object' && noteIndices.noteValue) {
        playNoteDirectly(noteIndices);
        return;
    }

    // Old format handling (for algorithmic patterns)
    if (!Array.isArray(noteIndices) || noteIndices.length === 0) return;

    // Get window dimensions and define edge boundaries
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const edgeThresholdX = windowWidth * 0.1;
    const edgeThresholdY = windowHeight * 0.1;

    // Find lines that match these notes
    const availableLines = [];
    const edgeLines = []; // Separate array to store edge lines as fallback

    // Get all lines with the specified notes
    parallax.lines.forEach(line => {
        if (animatingLines.has(line.dataset.id)) return; // Skip already-animating lines

        const lineNote = line.dataset.note;
        // Find the index of this note in our scale
        const noteIndex = musicBoxScale.indexOf(lineNote);

        if (noteIndices.includes(noteIndex)) {
            // Check if line is at the edge
            const rect = line.getBoundingClientRect();
            const lineX = rect.left + rect.width / 2;
            const lineY = rect.top + rect.height / 2;

            const isEdgeLine = (
                lineX < edgeThresholdX ||
                lineX > (windowWidth - edgeThresholdX) ||
                lineY < edgeThresholdY ||
                lineY > (windowHeight - edgeThresholdY)
            );

            const lineObj = {
                line: line,
                noteIndex: noteIndex
            };

            // Sort into appropriate array
            if (isEdgeLine) {
                edgeLines.push(lineObj);
            } else {
                availableLines.push(lineObj);
            }
        }
    });

    // If no non-edge lines are available, use edge lines as fallback
    let linesToUse = availableLines.length > 0 ? availableLines : edgeLines;

    // For non-song melodies, shuffle 
    shuffleArray(linesToUse);

    // Select lines to play based on dynamic level
    let linesToPlay = 1; // Default for 'soft'
    if (autoPlay.dynamicLevel === 'medium') {
        linesToPlay = Math.min(2, linesToUse.length);
    } else if (autoPlay.dynamicLevel === 'loud') {
        linesToPlay = Math.min(3, linesToUse.length);
    }

    // Limit to the number of available lines
    linesToPlay = Math.min(linesToPlay, linesToUse.length);

    // Play the selected lines
    for (let i = 0; i < linesToPlay; i++) {
        if (i < linesToUse.length) {
            const lineObj = linesToUse[i];
            simulateLineInteraction(lineObj.line);
        }
    }
} 