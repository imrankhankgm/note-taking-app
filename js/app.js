document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('noteCanvas');
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getTouchPos(touchEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    function startDrawing(x, y) {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    }

    function draw(x, y) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

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
});
