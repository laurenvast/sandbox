// Configuration for lines
let numLines = 260; // Increased from 240 for better density
const lineLength = 150; // 100px lines
const batchSize = 200; // Number of lines per batch

// Adjust number of lines for mobile devices
if (isMobile) {
    numLines = 80; // Fewer lines for better mobile performance
}

// Fisher-Yates shuffle algorithm (implemented locally to avoid reference errors)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Track the currently active song notes for lines
let activeSongNotes = []; // Will hold notes from the selected song

// Function to update all lines with notes from a specific song
function updateLinesWithSongNotes(songNotes) {
    if (!songNotes || songNotes.length === 0) {
        // If no valid song notes provided, revert to random notes
        activeSongNotes = [];
        return;
    }

    // Store the song notes for use when drawing lines
    activeSongNotes = [...songNotes];

    // Update existing lines with notes from the song
    const lines = document.querySelectorAll('.line');
    lines.forEach((line, index) => {
        // Use modulo to cycle through the song notes
        const noteIndex = index % songNotes.length;
        line.dataset.note = songNotes[noteIndex];
    });

    console.log(`Updated ${lines.length} lines with notes from song (${songNotes.length} unique notes)`);
}

// Draw lines function
function drawLines() {
    const container = document.getElementById('container');

    // Clear previous lines
    container.innerHTML = '';

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Extend grid area beyond viewport to ensure edges aren't empty
    // Create a grid with padding on all sides - smaller padding for more even distribution
    const gridPadding = 0.1; // Reduced to 10% for better distribution
    const extendedWidth = width * (1 + gridPadding * 2);
    const extendedHeight = height * (1 + gridPadding * 2);

    // Calculate offset to center the extended grid
    const offsetX = -(width * gridPadding);
    const offsetY = -(height * gridPadding);

    // Calculate grid spacing for even distribution
    const area = extendedWidth * extendedHeight;
    const areaPerLine = area / numLines;
    const gridSpacing = Math.sqrt(areaPerLine);

    const cols = Math.ceil(extendedWidth / gridSpacing);
    const rows = Math.ceil(extendedHeight / gridSpacing);

    const totalPositions = cols * rows;
    const positions = Array.from({ length: totalPositions }, (_, i) => i);

    // Shuffle array to randomize positions while maintaining even distribution
    shuffleArray(positions);

    // Take the first numLines positions (or fewer if the window is small)
    const selectedPositions = positions.slice(0, numLines);

    // Create batches for better performance
    const numBatches = Math.ceil(numLines / batchSize);

    for (let b = 0; b < numBatches; b++) {
        const batchContainer = document.createElement('div');
        batchContainer.className = 'batch';
        const startIdx = b * batchSize;
        const endIdx = Math.min((b + 1) * batchSize, numLines);

        const fragment = document.createDocumentFragment();

        for (let i = startIdx; i < endIdx; i++) {
            const index = selectedPositions[i];
            if (index === undefined) continue;

            const row = Math.floor(index / cols);
            const col = index % cols;

            // Calculate position in the extended grid
            const gridX = col * gridSpacing + (Math.random() * gridSpacing * 0.5);
            const gridY = row * gridSpacing + (Math.random() * gridSpacing * 0.5);

            // Apply offset to position the grid correctly
            const x = gridX + offsetX;
            const y = gridY + offsetY;

            const angle = Math.random() * 360; // Random angle in degrees

            // Check if this line will be fully out of view
            // Consider line length and angle to determine visibility
            const halfLength = lineLength / 2;

            // Calculate how far off-screen the line can be and still have a portion visible
            // This considers the rotation angle of the line
            const angleRad = angle * (Math.PI / 180);
            const xProjection = Math.abs(Math.cos(angleRad) * halfLength);
            const yProjection = Math.abs(Math.sin(angleRad) * halfLength);

            // Only make minimal adjustments to maintain even distribution
            // If a line is completely off screen (with no chance of being visible),
            // make a small adjustment to bring a small portion into view
            let adjustedX = x;
            let adjustedY = y;

            // Make smaller adjustments (only 10-15px) to maintain distribution
            // Only adjust lines that are completely invisible
            if (x < -halfLength - xProjection) {
                adjustedX = -halfLength - xProjection + (Math.random() * 10);
            } else if (x > width + halfLength + xProjection) {
                adjustedX = width + halfLength + xProjection - (Math.random() * 10);
            }

            if (y < -halfLength - yProjection) {
                adjustedY = -halfLength - yProjection + (Math.random() * 10);
            } else if (y > height + halfLength + yProjection) {
                adjustedY = height + halfLength + yProjection - (Math.random() * 10);
            }

            // Create line element
            const line = document.createElement('div');
            line.className = 'line';
            line.dataset.id = i; // Add ID for tracking

            // Assign a note based on active song or random from music box scale
            if (activeSongNotes.length > 0) {
                // Use notes from the active song, cycling through them
                const songNoteIndex = i % activeSongNotes.length;
                line.dataset.note = activeSongNotes[songNoteIndex];
            } else {
                // Use random note from music box scale
                const randomNoteIndex = Math.floor(Math.random() * musicBoxScale.length);
                line.dataset.note = musicBoxScale[randomNoteIndex];
            }

            // Store original angle for animation
            line.style.setProperty('--rotation', `${angle}deg`);

            // Calculate rotation speed based on vertical position
            // Lines at the top (y close to 0) rotate faster than lines at the bottom
            // Map y position (0 to height) to rotation duration (10s to 40s)
            const minDuration = 10; // Faster rotation at the top (10 seconds)
            const maxDuration = 40; // Slower rotation at the bottom (40 seconds)
            const normalizedY = adjustedY / height; // 0 at top, 1 at bottom
            const rotationDuration = minDuration + (normalizedY * (maxDuration - minDuration));

            line.style.animation = `rotate ${rotationDuration}s linear infinite`;

            // Calculate a pluck height based on line length (10-20% of length)
            const pluckHeight = 5 + Math.random() * 10;
            line.style.setProperty('--pluck-height', `${pluckHeight}px`);

            // Set position using adjusted coordinates that ensure visibility
            line.style.left = `${adjustedX}px`;
            line.style.top = `${adjustedY}px`;
            line.style.width = `${lineLength}px`;

            // Store original position for parallax effect
            line.dataset.originalX = adjustedX;
            line.dataset.originalY = adjustedY;

            // Assign a random depth factor for parallax (0.1 to 1.0)
            // Closer to 1 = more movement (seems closer to viewer)
            const depthFactor = 0.1 + Math.random() * 0.9;
            line.dataset.depth = depthFactor;

            // Apply depth-based styling
            // Deeper elements (higher depth factor) appear closer to the viewer
            // They should be larger, more opaque, and on top

            // Scale based on depth (deeper = larger)
            const scaleAmount = 0.7 + (depthFactor * 0.6); // Scale from 70% to 130%
            line.style.transform = `rotate(${angle}deg) scale(${scaleAmount})`;

            // Opacity based on depth (deeper = more opaque)
            const opacity = 0.3 + (depthFactor * 0.7); // Opacity from 30% to 100%
            line.style.opacity = opacity;

            // Z-index based on depth (deeper = higher z-index)
            const zIndex = Math.floor(depthFactor * 10);
            line.style.zIndex = zIndex;

            // Add to parallax tracked elements
            parallax.lines.push(line);

            // Set thickness (1px to 3px for better visibility)
            line.style.height = `1px`;

            // Set rotation
            line.style.transform = `rotate(${angle}deg)`;

            // Set color from the specified palette
            const colorPalette = ['#8338ec', '#ff0054', '#ff5400', '#f2c02c'];
            const randomColorIndex = Math.floor(Math.random() * colorPalette.length);
            line.style.backgroundColor = colorPalette[randomColorIndex];

            // Add to batch
            fragment.appendChild(line);
        }

        batchContainer.appendChild(fragment);
        container.appendChild(batchContainer);
    }

    // Set up event delegation for line interactions
    setupEventListeners();
}

// Function to handle interaction (both mouse and touch)
function handleInteraction(event) {
    // Get the touch or mouse position
    const clientX = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : null);
    const clientY = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : null);

    // If this is a touch event, prevent default to avoid scrolling issues
    if (event.type.startsWith('touch')) {
        event.preventDefault();
    }

    // Find the element at this position (for touch events)
    let lineElement;
    if (event.type.startsWith('touch')) {
        const elementsUnderTouch = document.elementsFromPoint(clientX, clientY);
        lineElement = elementsUnderTouch.find(el => el.classList.contains('line'));
    } else {
        lineElement = event.target.closest('.line');
    }

    if (lineElement && !animatingLines.has(lineElement.dataset.id)) {
        // Use the shared simulation function that auto-play also uses
        simulateLineInteraction(lineElement);
    }
}

function setupEventListeners() {
    const container = document.getElementById('container');

    // Register event listeners for line interaction
    container.addEventListener('mouseover', handleInteraction);
    container.addEventListener('touchstart', handleInteraction, { passive: false });
} 