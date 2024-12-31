document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const selectedColor = document.querySelector('.selected-color');
    
    let isDrawing = false;
    let currentColor = colorPicker.value; // Initialize with color picker's value
    let currentSection = 1;
    const totalSections = 3;
    const sectionImages = new Array(totalSections).fill(null);

    function setCanvasSize() {
        const frame = canvas.parentElement;
        canvas.width = frame.offsetWidth * 2;
        canvas.height = 600 * 2;
        canvas.style.width = `${frame.offsetWidth}px`;
        canvas.style.height = '600px';
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        drawSectionGuides();
    }

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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const sectionHeight = canvas.height / 3;
    const currentSectionY = (currentSection - 1) * sectionHeight;
    
    if (y >= currentSectionY && y <= currentSectionY + sectionHeight) {
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x/2, y/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x/2, y/2);
    }
}


    // Color picker event listener
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        selectedColor.style.backgroundColor = currentColor;
        ctx.strokeStyle = currentColor; // Update stroke style immediately
        createSparkles(selectedColor);
    });

    // [Rest of your existing functions remain the same]

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    // Initialize
    setCanvasSize();
    selectedColor.style.backgroundColor = currentColor; // Set initial color display
});
