document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // --- 1. DOM Element Selection and Configuration ---
    // -------------------------------------------------------------------

    const personalityIconsContainer = document.querySelector('.personality-icons');

    // Ensure the container exists before querying for items
    const iconItems = personalityIconsContainer ? personalityIconsContainer.querySelectorAll('li') : [];
    const iconItemCount = iconItems.length;
    const centerTextDisplay = document.getElementById('personality-center-text');

    // State variable for the reset timer
    let tooltipResetTimer = null; 

    // Delay in milliseconds before resetting the tooltip text after mouseleave (e.g., 2000ms = 2 seconds)
    const RESET_DELAY_MS = 100000; 

    // -------------------------------------------------------------------
    // --- 2. Circular Layout Positioning Logic ---
    // -------------------------------------------------------------------

    /**
     * Calculates and applies CSS transforms to position the list items in a circle.
     */
    const positionIconsInCircle = () => {
        if (iconItemCount === 0 || !personalityIconsContainer) return;

        const containerWidth = personalityIconsContainer.clientWidth;
        // Radius is half the container's width/height
        const radius = containerWidth / 2;
        // Offset angle starts positioning at the top (-90 degrees)
        const offsetAngle = -90; 
        
        // Angle between each item
        const angleStep = 360 / iconItemCount;

        iconItems.forEach((item, index) => {
            const angle = angleStep * index + offsetAngle;
            // Convert degrees to radians: (angle * PI) / 180
            const radian = (angle * Math.PI) / 180;

            // Calculate coordinates (relative to the center)
            const x = radius * Math.cos(radian);
            const y = radius * Math.sin(radian);

            // Apply position
            item.style.transform = `translate(${x}px, ${y}px)`;
        });
    };

    // -------------------------------------------------------------------
    // --- 3. Tooltip Interaction Logic ---
    // -------------------------------------------------------------------

    /**
     * Retrieves the default text, which is the tooltip of the first item.
     * @returns {string} The default tooltip text.
     */
    const getDefaultTooltipText = () => {
        return iconItems.length > 0 ? iconItems[0].getAttribute('data-tooltip') : '';
    };

    /**
     * Clears the reset timer if it's running.
     */
    const clearResetTimer = () => {
        if (tooltipResetTimer !== null) {
            clearTimeout(tooltipResetTimer);
            tooltipResetTimer = null;
        }
    }

    /**
     * Displays the tooltip text from the hovered element.
     * @param {Event} event - The mouseenter or click event.
     */
    const handleIconEnter = (event) => {
        if (!centerTextDisplay) return;

        // Clear timer immediately to prevent reset while hovering
        clearResetTimer();

        const tooltipText = event.currentTarget.getAttribute('data-tooltip');
        if (tooltipText) {
            centerTextDisplay.textContent = tooltipText;
            centerTextDisplay.style.opacity = '1';
        }
    };

    /**
     * Starts the timer to reset the tooltip to the default text after a delay.
     */
    const handleContainerLeave = () => {
        if (!centerTextDisplay) return;

        // Ensure no multiple timers are set
        clearResetTimer(); 

        tooltipResetTimer = setTimeout(() => {
            // Reset to the fixed default text after the delay
            centerTextDisplay.textContent = getDefaultTooltipText();
            centerTextDisplay.style.opacity = '1';
            tooltipResetTimer = null; // Clear the timer ID
        }, RESET_DELAY_MS);
    };

    /**
     * Sets up all necessary event listeners for the icons and container.
     */
    const setupEventListeners = () => {
        if (centerTextDisplay && personalityIconsContainer) {
            // Attach enter/click handlers to individual icons
            iconItems.forEach(item => {
                item.addEventListener('mouseenter', handleIconEnter);
                // Also attaching click handler as per original code's intent
                item.addEventListener('click', handleIconEnter); 
            });

            // Attach leave handler to the parent container
            personalityIconsContainer.addEventListener('mouseleave', handleContainerLeave);
        }
    };

    // -------------------------------------------------------------------
    // --- 4. Initialization Block ---
    // -------------------------------------------------------------------

    const initializeAboutPage = () => {
        // A. Set initial layout
        if (iconItemCount > 0) {
            positionIconsInCircle(); 
            // Optional: Run again on window resize for greater responsiveness
            window.addEventListener('resize', positionIconsInCircle);
        }
        
        // B. Set initial tooltip state
        if (centerTextDisplay) {
            centerTextDisplay.textContent = getDefaultTooltipText();
            centerTextDisplay.style.opacity = '1';
        }

        // C. Setup all user interaction
        setupEventListeners();
    };

    initializeAboutPage();
});