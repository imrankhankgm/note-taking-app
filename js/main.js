import { addPage } from './pages.js';
import { setupDrawing } from './drawing.js';
import { handleStart, handleMove, handleEnd } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    const pagesContainer = document.getElementById('pagesContainer');
    let currentPageIndex = 0;
    console.log('hello')
    // Add initial page
    addPage(pagesContainer);

    // Initialization
    const svgElements = pagesContainer.querySelectorAll('.page .drawing-svg');
    svgElements.forEach(svg => {
        setupDrawing(svg);
        svg.addEventListener('touchstart', handleStart);
        svg.addEventListener('mousedown', handleStart);
        svg.addEventListener('touchmove', handleMove);
        svg.addEventListener('mousemove', handleMove);
        svg.addEventListener('touchend', handleEnd);
        svg.addEventListener('mouseup', handleEnd);
        svg.addEventListener('mouseleave', handleEnd);
    });
});
