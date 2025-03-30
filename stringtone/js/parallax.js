// Store the parallax data
const parallax = {
    enabled: true,
    mouseX: 0,
    mouseY: 0,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    intensity: 80, // Increased from 15 to 30 for more pronounced effect
    lines: []
};

// Function to update parallax effect based on mouse position
function updateParallax(event) {
    if (!parallax.enabled) return;

    // Update mouse position
    parallax.mouseX = event.clientX || parallax.mouseX;
    parallax.mouseY = event.clientY || parallax.mouseY;

    // Calculate center position
    const centerX = parallax.windowWidth / 2;
    const centerY = parallax.windowHeight / 2;

    // Calculate offset from center as a percentage
    const offsetX = (parallax.mouseX - centerX) / centerX;
    const offsetY = (parallax.mouseY - centerY) / centerY;

    // Apply parallax to each line based on its depth
    parallax.lines.forEach(line => {
        // Skip lines that are currently animating
        if (animatingLines.has(line.dataset.id)) return;

        const depth = parseFloat(line.dataset.depth);
        const originalX = parseFloat(line.dataset.originalX);
        const originalY = parseFloat(line.dataset.originalY);

        // Calculate parallax movement with increased intensity for edge elements
        // Depth impacts the movement intensity
        const moveX = offsetX * parallax.intensity * depth;
        const moveY = offsetY * parallax.intensity * depth;

        // Determine if this is an edge element (based on original position)
        const edgeThreshold = lineLength * 0.75; // Distance from edge to be considered an edge element
        const isEdgeElement =
            originalX < edgeThreshold ||
            originalX > parallax.windowWidth - edgeThreshold ||
            originalY < edgeThreshold ||
            originalY > parallax.windowHeight - edgeThreshold;

        // Enhanced edge element movement - smoothly transitions lines into view
        let edgeBoostX = 0;
        let edgeBoostY = 0;

        if (isEdgeElement) {
            // Calculate boosted movement based on position relative to viewport edge
            // This creates a "pull" effect to bring edge elements smoothly into view

            // Horizontal edge boost - more subtle to maintain even distribution
            if (originalX < edgeThreshold) {
                // Left edge - boost rightward movement more when mouse is on right side
                const leftEdgeFactor = 1 - (originalX / edgeThreshold);
                edgeBoostX = Math.max(0, offsetX) * 10 * depth * leftEdgeFactor;
            } else if (originalX > parallax.windowWidth - edgeThreshold) {
                // Right edge - boost leftward movement more when mouse is on left side
                const rightEdgeFactor = (originalX - (parallax.windowWidth - edgeThreshold)) / edgeThreshold;
                edgeBoostX = Math.min(0, offsetX) * 10 * depth * rightEdgeFactor;
            }

            // Vertical edge boost
            if (originalY < edgeThreshold) {
                // Top edge - boost downward movement more when mouse is on bottom half
                const topEdgeFactor = 1 - (originalY / edgeThreshold);
                edgeBoostY = Math.max(0, offsetY) * 10 * depth * topEdgeFactor;
            } else if (originalY > parallax.windowHeight - edgeThreshold) {
                // Bottom edge - boost upward movement more when mouse is on top half
                const bottomEdgeFactor = (originalY - (parallax.windowHeight - edgeThreshold)) / edgeThreshold;
                edgeBoostY = Math.min(0, offsetY) * 10 * depth * bottomEdgeFactor;
            }
        }

        // Handle completely off-screen elements with a different approach
        // For elements completely outside viewport, give them a chance to enter
        if (originalX < -lineLength / 2 || originalX > parallax.windowWidth + lineLength / 2 ||
            originalY < -lineLength / 2 || originalY > parallax.windowHeight + lineLength / 2) {

            // Check which direction would bring them into view
            if (originalX < -lineLength / 2 && offsetX > 0) {
                // Off-screen left, needs to move right
                edgeBoostX += offsetX * 8 * depth;
            } else if (originalX > parallax.windowWidth + lineLength / 2 && offsetX < 0) {
                // Off-screen right, needs to move left
                edgeBoostX += offsetX * 8 * depth;
            }

            if (originalY < -lineLength / 2 && offsetY > 0) {
                // Off-screen top, needs to move down
                edgeBoostY += offsetY * 8 * depth;
            } else if (originalY > parallax.windowHeight + lineLength / 2 && offsetY < 0) {
                // Off-screen bottom, needs to move up
                edgeBoostY += offsetY * 8 * depth;
            }
        }

        // Calculate a subtle scale adjustment based on mouse position
        // Lines closer to mouse appear slightly larger
        const distanceToMouse = Math.sqrt(
            Math.pow((originalX + moveX) - parallax.mouseX, 2) +
            Math.pow((originalY + moveY) - parallax.mouseY, 2)
        );
        const maxDistance = Math.sqrt(Math.pow(parallax.windowWidth, 2) + Math.pow(parallax.windowHeight, 2));
        const normalizedDistance = Math.min(distanceToMouse / (maxDistance * 0.5), 1);
        const proximityScale = 1 + ((1 - normalizedDistance) * 0.1 * depth);

        // Apply the base scale from depth
        const baseScale = 0.7 + (depth * 0.6);

        // Combine with proximity scale for dynamic scaling
        const totalScale = baseScale * proximityScale;

        // Get rotation from current transform
        const angle = line.style.getPropertyValue('--rotation') || "0deg";

        // Apply the movement and scale
        line.style.left = `${originalX + moveX + edgeBoostX}px`;
        line.style.top = `${originalY + moveY + edgeBoostY}px`;
        line.style.transform = `rotate(${angle}) scale(${totalScale})`;
    });
}

// Handle device tilt for mobile devices (optional)
function handleDeviceTilt(event) {
    if (!parallax.enabled || !event.gamma || !event.beta) return;

    // Normalize device orientation values to a similar range as mouse movement
    // gamma is left/right tilt (-90 to 90)
    // beta is front/back tilt (-180 to 180)
    const tiltX = event.gamma / 45; // Normalize to roughly -1 to 1
    const tiltY = event.beta / 90;  // Normalize to roughly -1 to 1

    // Calculate virtual mouse position based on tilt
    const virtualMouseX = parallax.windowWidth * (0.5 + tiltX * 0.5);
    const virtualMouseY = parallax.windowHeight * (0.5 + tiltY * 0.5);

    // Update parallax using the virtual mouse position
    const virtualEvent = { clientX: virtualMouseX, clientY: virtualMouseY };
    updateParallax(virtualEvent);
}

// Initialize parallax event listeners
function initParallax() {
    // Add mousemove event for parallax effect
    window.addEventListener('mousemove', updateParallax);

    // Add device orientation for mobile parallax
    if (isMobile && window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceTilt);
    }

    // Reset parallax on window resize
    window.addEventListener('resize', () => {
        parallax.windowWidth = window.innerWidth;
        parallax.windowHeight = window.innerHeight;

        // Reset lines array (will be repopulated on drawLines)
        parallax.lines = [];
    });
}

// Initialize parallax when document is ready
document.addEventListener('DOMContentLoaded', initParallax); 