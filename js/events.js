export function handleStart(event) {
    const svg = event.currentTarget;
    if (event.touches && event.touches.length === 1 && event.touches[0].touchType === 'stylus') {
        event.preventDefault();
        const { x, y } = getSVGPoint(svg, event.touches[0]);
        startDrawing(x, y);
    } else if (event.button === 0) { // Check if left mouse button is clicked
        const { x, y } = getSVGPoint(svg, event);
        startDrawing(x, y);
    }
}

export function handleMove(event) {
    const svg = event.currentTarget;
    if (isDrawing) {
        event.preventDefault();
        if (event.touches && event.touches.length === 1 && event.touches[0].touchType === 'stylus') {
            const { x, y } = getSVGPoint(svg, event.touches[0]);
            draw(x, y);
        } else {
            const { x, y } = getSVGPoint(svg, event);
            draw(x, y);
        }
    }
}

export function handleEnd(event) {
    const svg = event.currentTarget;
    if (event.touches && event.touches.length === 0) {
        stopDrawing();
    } else if (!event.touches && event.button === 0) { // Check if left mouse button is released
        stopDrawing();
    }
}
