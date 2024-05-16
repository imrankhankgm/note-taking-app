document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('noteCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match the screen dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

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

    function getTouchPos(touchEvent) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (touchEvent.touches[0].clientX - rect.left) * scaleX,
            y: (touchEvent.touches[0].clientY - rect.top) * scaleY
        };
    }


    function startDrawing(x, y) {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    }

    function draw(x, y) {
        if (!isDrawing) return;
        ctx.lineCap = 'round'; // Ensures smooth lines
        if (isEraserMode) {
            // Set the global composite operation to 'destination-out' to erase pixels
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = penSize;
        } else {
            // Set stroke color and global composite operation for drawing with pencil
            ctx.strokeStyle = strokeColor;
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = penSize;
        }
        // Draw the stroke
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Detect if the device is a touchscreen device
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    // Add event listeners based on device type
    if (isTouchDevice) {
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches[0].touchType === 'stylus') {
                e.preventDefault();
                const touchPos = getTouchPos(e);
                startDrawing(touchPos.x, touchPos.y);
            }
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches[0].touchType === 'stylus') {
                e.preventDefault();
                const touchPos = getTouchPos(e);
                draw(touchPos.x, touchPos.y);
            }
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            if (e.touches[0] && e.touches[0].touchType === 'stylus') {
                stopDrawing();
            }
        });
    } else {
        // For PC browsers, enable drawing with left mouse click
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Check if left mouse button is clicked
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;
                startDrawing(mouseX, mouseY);
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;
                draw(mouseX, mouseY);
            }
        });


        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
    }
});
