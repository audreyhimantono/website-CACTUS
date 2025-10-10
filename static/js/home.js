document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------
    // --- 1. Introduction Animation ---
    // -------------------------------------------------------------------

    function animateIntro() {
        const titleElement = document.querySelector('.introduction-animation h1');
        const subtitleElement = document.querySelector('.introduction-animation .subtitle'); 
        const ctaElement = document.querySelector('.introduction-animation .scroll-down-cta'); 

        // Define a smooth transition curve similar to the reference site
        const transitionStyle = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        // const transitionStyle = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        if (titleElement) {
            // Set initial state (out of view)
            titleElement.style.opacity = '0';
            titleElement.style.transform = 'translateY(150%)'; // Dramatic slide up
            titleElement.style.transition = transitionStyle;
            
            // Animate H1 after a short initial delay
            setTimeout(() => {
                titleElement.style.opacity = '1';
                titleElement.style.transform = 'translateY(0)';
            }, 200);
        }

        if (subtitleElement) {
            // Set initial state (out of view)
            subtitleElement.style.opacity = '0';
            subtitleElement.style.transform = 'translateY(150%)';
            subtitleElement.style.transition = transitionStyle;

            // Animate P shortly after H1
            setTimeout(() => {
                subtitleElement.style.opacity = '1';
                subtitleElement.style.transform = 'translateY(0)';
            }, 500); // Start 300ms after the H1 animation begins
        }

        if (subtitleElement) {
            // Set initial state (out of view)
            ctaElement.style.opacity = '0';
            ctaElement.style.transform = 'translateY(150%)';
            ctaElement.style.transition = transitionStyle;

            // Animate P shortly after H1
            setTimeout(() => {
                ctaElement.style.opacity = '1';
                ctaElement.style.transform = 'translateY(0)';
            }, 700); // Start 200ms after the subtitle animation begins
        }
    }

    // -------------------------------------------------------------------
    // --- 2. Scroll-Down Call-to-Action (CTA) Logic ---
    // -------------------------------------------------------------------

    // Get the link element with the ID 'scrollDownCta'
    const cta = document.getElementById('scrollDownCta');
    // Get the destination element
    const targetElement = document.getElementById('overview');

    // Ensure both elements exist before setting up the listener
    if (cta && targetElement) {
        cta.addEventListener('click', (e) => {
            // 1. Stop the default anchor link behavior (i.e., immediate jump)
            e.preventDefault(); 
            
            // 2. Calculate the position of the target element relative to the document top
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            
            // 3. Determine the height of the fixed header, mobile and desktop
            const headerHeight = window.innerWidth <= 991 ? 70 : 120;
            
            // 4. Calculate the final scroll position
            const finalPosition = targetPosition - headerHeight;

            // 5. Execute the smooth scroll
            window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
            });
        });
    }

    // -------------------------------------------------------------------
    // --- 3. Full Page Smooth Scroll ---
    // -------------------------------------------------------------------

    // Defines the full-page sections to navigate between, adapting to screen size.
    const getSections = () => {
        // IDs of the mandatory main sections
        const mainSections = ['overview', 'expertise', 'industries'];
        
        // Breakpoint for Companies/Education row is 991px
        if (window.innerWidth <= 991) {
            // Small screen: Snap to individual sections
            mainSections.push('companies', 'education');
        } else {
            // Large screen: Snap to the combined row
            mainSections.push('companies-education-row');
        }
        
        // Breakpoint for Skills/Contact row is 1341px
        if (window.innerWidth <= 1341) {
            // Medium/Small screen: Snap to individual sections
            mainSections.push('skills', 'contact');
        } else {
            // Large screen: Snap to the combined row
            mainSections.push('skills-contact-row');
        }


        // Map IDs/Classes to their actual elements, filtering out any that don't exist
        return mainSections
            .map(id => document.querySelector(`.${id}`) || document.getElementById(id))
            .filter(el => el != null);
    };

    let isScrolling = false;
    // Set a debounce period slightly longer than the browser's default smooth scroll time (~500ms)
    const SCROLL_DEBOUNCE = 700; 
    
    // Function to find the next section's target scroll position
    const getNextTarget = (sections, direction) => {
        // The header height determines the "snap" offset
        const headerHeight = window.innerWidth <= 991 ? 70 : 120;
        // Current top of the viewport content area, adjusted for the fixed header
        const currentScroll = window.scrollY + headerHeight + 1; 

        let targetElement = null;
        let targetIndex = -1;

        if (direction === 'down') {
            // Find the first section whose top is below the current scroll
            for(let i = 0; i < sections.length; i++) {
                if (sections[i].offsetTop > currentScroll) {
                    targetElement = sections[i];
                    targetIndex = i;
                    break;
                }
            }
            // If we are on the home section, always target the first real section
            if (targetElement === null && window.scrollY < sections[0].offsetTop) {
                 targetElement = sections[0];
            }

        } else if (direction === 'up') {
            // Find the section that is currently visible or the one just before it
            let previousIndex = -1;
            for(let i = 0; i < sections.length; i++) {
                if (sections[i].offsetTop <= currentScroll) {
                    previousIndex = i;
                } else {
                    break;
                }
            }
            
            if (previousIndex >= 0) {
                targetElement = sections[previousIndex];
                
                // If we are at the top of the current section, move to the previous one
                if (Math.abs(currentScroll - sections[previousIndex].offsetTop) < 20) {
                    if (previousIndex > 0) {
                        targetElement = sections[previousIndex - 1];
                    } else {
                        // Scroll back to the very top (#home)
                        return 0;
                    }
                }
            } else {
                // Already at the very top
                return 0;
            }
        }
        
        if (targetElement) {
            return targetElement.offsetTop - headerHeight;
        } else {
            // Check if we are at the bottom of the page and scrolling down
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (direction === 'down' && window.scrollY < totalHeight) {
                // Allow normal scroll to reach the absolute bottom
                return null;
            }
            return null; // Don't scroll (e.g., reached the end)
        }
    };


    // Main scroll event handler for mouse wheel
    window.addEventListener('wheel', (e) => {
        // Prevent scroll if already in motion
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        const sections = getSections();
        if (sections.length === 0) return;

        const direction = e.deltaY > 0 ? 'down' : 'up';
        
        let targetScrollPosition = getNextTarget(sections, direction);

        if (targetScrollPosition !== null) {
            e.preventDefault(); // Stop default scroll
            isScrolling = true;
            
            // Execute native smooth scroll
            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });

            // Debounce scrolling: re-enable scroll after the browser animation should have finished
            setTimeout(() => {
                isScrolling = false;
            }, SCROLL_DEBOUNCE); 
        }
    }, { passive: false }); 


    // Also handle keyboard navigation (for accessibility)
    window.addEventListener('keydown', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        const sections = getSections();
        if (sections.length === 0) return;

        let targetScrollPosition = null;
        let direction = null;

        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            direction = 'down';
            targetScrollPosition = getNextTarget(sections, direction);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            direction = 'up';
            targetScrollPosition = getNextTarget(sections, direction);
        }

        if (targetScrollPosition !== null) {
            e.preventDefault();
            isScrolling = true;
            
            // Execute native smooth scroll
            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isScrolling = false;
            }, SCROLL_DEBOUNCE);
        }
    });

    // -------------------------------------------------------------------
    // --- 4. Overview Counter Animation Logic ---
    // -------------------------------------------------------------------



    // -------------------------------------------------------------------
    // --- 5. Skills Logos Scatter Layout Logic ---
    // -------------------------------------------------------------------

    function scatterLogos() {
        const container = document.querySelector('.skills-logos');
        const logos = container ? container.querySelectorAll('.logo-svg') : [];
        if (!container || logos.length === 0) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const positions = [];
        const MIN_DISTANCE = 20; // Minimum required distance between logo edges (Requirement 2)
        const logoMarginStyle = window.getComputedStyle(logos[0]).margin;
        const MARGIN_BUFFER = 15; // Safe pixel buffer to cover the 0.5vw margin on one side
        const totalBuffer = MARGIN_BUFFER * 2; 


        logos.forEach(logo => {
            let placed = false;
            let attempts = 0;
            const logoWidth = logo.offsetWidth;
            const logoHeight = logo.offsetHeight;

            while (!placed && attempts < 100) { // Limit attempts to prevent infinite loops
                // Generate random position (Requirement 1)
                const randomX = Math.random() * (containerWidth - logoWidth - totalBuffer);
                const randomY = Math.random() * (containerHeight - logoHeight - totalBuffer);

                const newPosition = {
                    x: randomX,
                    y: randomY,
                    width: logoWidth,
                    height: logoHeight
                };

                // Check for overlap with already placed logos (Requirement 2)
                let overlap = false;
                for (const pos of positions) {
                    // Simple AABB collision detection with minimum distance
                    if (
                        newPosition.x < pos.x + pos.width + MIN_DISTANCE &&
                        newPosition.x + newPosition.width + MIN_DISTANCE > pos.x &&
                        newPosition.y < pos.y + pos.height + MIN_DISTANCE &&
                        newPosition.y + newPosition.height + MIN_DISTANCE > pos.y
                    ) {
                        overlap = true;
                        break;
                    }
                }

                if (!overlap) {
                    // Apply position
                    logo.style.left = `${randomX}px`;
                    logo.style.top = `${randomY}px`;
                    positions.push(newPosition);
                    placed = true;
                }
                attempts++;
            }
            // If placed is false after max attempts, the logo remains unpositioned (it's hidden by overflow) or in its default state
        });
    }

    // -------------------------------------------------------------------
    // --- 6. Initialization and Event Binding ---
    // ------------------------------------------------------------------- 

    // Initialize introduction animation
    animateIntro();

    // Initialize overview counter animation
    

    // Initialize logo scattering
    scatterLogos();
    // Re-scatter on window resize for responsivemess
    window.addEventListener('resize', scatterLogos); 
    // Small delay for initial load to ensure all sizes are correctly calculated
    setTimeout(scatterLogos, 100); 
});

