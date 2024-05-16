document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('noteSVG');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let pathData = '';

    const colorPicker = document.getElementById('colorPicker');
    const penSizeInput = document.getElementById('penSize');
    const pencilButton = document.getElementById('pencilButton');
    const eraserButton = document.getElementById('eraserButton');

    let strokeColor = colorPicker.value;
    let penSize = penSizeInput.value;
    let isEraserMode = false;

    colorPicker.addEventListener('input', () => {
        strokeColor = colorPicker.value;
    });

    penSizeInput.addEventListener('input', () => {
        penSize = penSizeInput.value;
    });

    pencilButton.addEventListener('click', () => {
        isEraserMode = false;
        pencilButton.classList.add('active');
        eraserButton.classList.remove('active');
    });

    eraserButton.addEventListener('click', () => {
        isEraserMode = true;
        eraserButton.classList.add('active');
        pencilButton.classList.remove('active');
    });

    function getSVGPoint(svg, event) {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    function startDrawing(x, y) {
        isDrawing = true;
        lastX = x;
        lastY = y;
        pathData = `M ${x} ${y}`;
    }

    function draw(x, y) {
        if (!isDrawing) return;
        const dx = x - lastX;
        const dy = y - lastY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.5) return; // Ignore tiny movements
        pathData += ` Q ${(lastX + x) / 2} ${(lastY + y) / 2} ${x} ${y}`;
        lastX = x;
        lastY = y;
        renderPath();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function renderPath() {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', isEraserMode ? '#ffffff' : strokeColor);
        path.setAttribute('stroke-width', penSize);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
    }

    function handleStart(event) {
        if (event.touches && event.touches.length === 1 && event.touches[0].touchType === 'stylus') {
            event.preventDefault();
            const { x, y } = getSVGPoint(svg, event.touches[0]);
            startDrawing(x, y);
        } else if (event.button === 0) { // Check if left mouse button is clicked
            const { x, y } = getSVGPoint(svg, event);
            startDrawing(x, y);
        }
    }

    function handleMove(event) {
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

    function handleEnd(event) {
        if (event.touches && event.touches.length === 0) {
            stopDrawing();
        } else if (!event.touches && event.button === 0) { // Check if left mouse button is released
            stopDrawing();
        }
    }

    svg.addEventListener('touchstart', handleStart);
    svg.addEventListener('mousedown', handleStart);
    svg.addEventListener('touchmove', handleMove);
    svg.addEventListener('mousemove', handleMove);
    svg.addEventListener('touchend', handleEnd);
    svg.addEventListener('mouseup', handleEnd);
    svg.addEventListener('mouseleave', handleEnd);

    // Increase point density for larger stroke sizes
    penSizeInput.addEventListener('input', () => {
        penSize = penSizeInput.value;
    });
});
