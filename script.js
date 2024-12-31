document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000000';
    
    // Set canvas size with good resolution
    function setCanvasSize() {
        const frame = canvas.parentElement;
        canvas.width = frame.offsetWidth * 2;
        canvas.height = 600 * 2;
        canvas.style.width = `${frame.offsetWidth}px`;
        canvas.style.height = '600px';
        ctx.scale(2, 2); // Improve resolution
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
    }

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Color picker functionality
    document.querySelectorAll('.color-btn').forEach(btn => {
        const color = btn.dataset.color;
        btn.style.backgroundColor = color;
        btn.addEventListener('click', () => {
            currentColor = color;
            createSparkles(btn);
        });
    });

    // Clear canvas
    document.querySelector('.clear-btn').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createSparkles(document.querySelector('.clear-btn'));
    });

    // Sparkle effect
    function createSparkles(element) {
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            element.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
        }
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    // Initialize canvas
    setCanvasSize();
});
