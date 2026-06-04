document.addEventListener('DOMContentLoaded', () => {
    // 1. Staggered Entrance Animation for Menu Buttons
    const buttons = document.querySelectorAll('.menu-button');
    
    buttons.forEach((button, index) => {
        // Add a slight delay for each consecutive button
        setTimeout(() => {
            button.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
            
            // Remove the hardcoded inline transition after the entrance animation finishes 
            // so the CSS hover effects take back over smoothly.
            setTimeout(() => {
                button.style.transition = '';
            }, 600);
            
        }, 200 * index); // 200ms delay between each button
    });

    // 2. Subtle Background Parallax Effect
    const bgLayer = document.getElementById('bg-layer');
    
    // Only apply parallax on devices with a mouse
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Calculate movement - the division factor controls the intensity of the parallax
            const moveX = ((mouseX / windowWidth) - 0.5) * 20; // 20px movement max
            const moveY = ((mouseY / windowHeight) - 0.5) * 20;
            
            // Apply the inverse translation to the background
            bgLayer.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        });
    }
});