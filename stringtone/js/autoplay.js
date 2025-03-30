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
    melodyType: 'arpeggio', // 'arpeggio', 'scale', 'random', 'cluster'
    dynamicLevel: 'medium', // 'soft', 'medium', 'loud'
    phraseDuration: 8000, // Duration of a musical phrase in ms
    phraseTimer: null,
    patternChangeTime: null
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
    autoPlay.phraseTimer = setInterval(() => {
        if (autoPlay.enabled) {
            generateMusicalPattern();
            autoPlay.patternIndex = 0; // Reset to beginning of new pattern

            // Randomly change melodic style for variety
            changeMusicalStyle();
        }
    }, autoPlay.phraseDuration);
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

// Generate a musical pattern based on the current melodic type
function generateMusicalPattern() {
    const pattern = [];
    autoPlay.noteGroups = [];

    // Select a pattern length (8, 12, or 16 notes)
    autoPlay.patternLength = [8, 12, 16][Math.floor(Math.random() * 3)];

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

    // Calculate variations for different note lengths
    // Possibilities: eighth note, quarter note, dotted quarter
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
    let noteTime = noteDurations[durationIndex];

    // Add a slight human feel with +/- 5% timing variations
    const humanFeel = 1 + (Math.random() * 0.1 - 0.05);
    noteTime *= humanFeel;

    // Before playing, check if we should play now or add a rest
    if (autoPlay.patternIndex < autoPlay.noteGroups.length) {
        const noteIdxGroup = autoPlay.noteGroups[autoPlay.patternIndex];

        // If the group isn't empty (i.e., not a rest), play the notes
        if (noteIdxGroup && noteIdxGroup.length > 0) {
            // Play the line(s) corresponding to these notes
            playAutomatedLines(noteIdxGroup);
        }

        // Move to next note in pattern
        autoPlay.patternIndex = (autoPlay.patternIndex + 1) % autoPlay.noteGroups.length;
    }

    // Schedule the next note
    autoPlay.timerId = setTimeout(scheduleNextNote, noteTime);
}

// Play one or more lines automatically
function playAutomatedLines(noteIndices) {
    if (!autoPlay.enabled || noteIndices.length === 0) return;

    // Find lines that match these notes
    const availableLines = [];

    // Get all lines with the specified notes
    parallax.lines.forEach(line => {
        if (animatingLines.has(line.dataset.id)) return; // Skip already-animating lines

        const lineNote = line.dataset.note;
        // Find the index of this note in our scale
        const noteIndex = musicBoxScale.indexOf(lineNote);

        if (noteIndices.includes(noteIndex)) {
            availableLines.push(line);
        }
    });

    // Shuffle available lines
    shuffleArray(availableLines);

    // Select lines to play based on dynamic level
    let linesToPlay = 1; // Default for 'soft'
    if (autoPlay.dynamicLevel === 'medium') {
        linesToPlay = Math.min(2, availableLines.length);
    } else if (autoPlay.dynamicLevel === 'loud') {
        linesToPlay = Math.min(3, availableLines.length);
    }

    // Limit to the number of available lines
    linesToPlay = Math.min(linesToPlay, availableLines.length);

    // Play the selected lines
    for (let i = 0; i < linesToPlay; i++) {
        if (i < availableLines.length) {
            const line = availableLines[i];
            simulateLineInteraction(line);
        }
    }
} 