document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('drawingCanvas');
    const guideCanvas = document.createElement('canvas');
    const ctx = mainCanvas.getContext('2d');
    const guideCtx = guideCanvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const penSizeSlider = document.getElementById('penSize');
    
    let isDrawing = false;
    let currentColor = colorPicker.value;
    let currentSection = 1;
    let penSize = penSizeSlider ? penSizeSlider.value : 5; // Larger default pen size
    const totalSections = 3;
    const sectionImages = new Array(totalSections).fill(null);
    const peekHeight = 30;
    let originalCanvasHeight;

    // Setup guide canvas
    guideCanvas.style.position = 'absolute';
    guideCanvas.style.top = '0';
    guideCanvas.style.left = '0';
    guideCanvas.style.pointerEvents = 'none';
    mainCanvas.parentElement.appendChild(guideCanvas);

    function setCanvasSize() {
        const frame = mainCanvas.parentElement;
        const sectionHeight = frame.offsetWidth * 0.4; // More compact drawing area
        
        // Set size for both canvases
        [mainCanvas, guideCanvas].forEach(canvas => {
            canvas.width = frame.offsetWidth;
            canvas.height = sectionHeight + (peekHeight * 2);
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        });

        originalCanvasHeight = mainCanvas.height;
        
        // Setup main canvas
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = penSize;

        drawSectionGuides();
    }

    function drawSectionGuides() {
        guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
        guideCtx.setLineDash([5, 5]);
        guideCtx.strokeStyle = '#c4e0ff';
        guideCtx.lineWidth = 2;
        
        // Draw guide lines
        [peekHeight, guideCanvas.height - peekHeight].forEach(y => {
            guideCtx.beginPath();
            guideCtx.moveTo(0, y);
            guideCtx.lineTo(guideCanvas.width, y);
            guideCtx.stroke();
        });
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = mainCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (mainCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (mainCanvas.height / rect.height);
        
        if (y >= peekHeight && y <= mainCanvas.height - peekHeight) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    function startDrawing(e) {
        isDrawing = true;
        const rect = mainCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (mainCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (mainCanvas.height / rect.height);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function showFinalCreation() {
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        const sectionHeight = mainCanvas.height - (peekHeight * 2);
        
        finalCanvas.width = mainCanvas.width;
        finalCanvas.height = sectionHeight * totalSections;
        
        let loadedImages = 0;
        sectionImages.forEach((imgData, i) => {
            if (imgData) {
                const img = new Image();
                img.onload = () => {
                    finalCtx.drawImage(
                        img, 
                        0, peekHeight, 
                        mainCanvas.width, mainCanvas.height - (peekHeight * 2),
                        0, i * sectionHeight,
                        mainCanvas.width, sectionHeight
                    );
                    loadedImages++;
                    if (loadedImages === totalSections) {
                        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                        mainCanvas.height = finalCanvas.height;
                        ctx.drawImage(finalCanvas, 0, 0);
                        setTimeout(createMagicalCelebration, 500);
                    }
                };
                img.src = imgData;
            }
        });
    }

    // Keep existing functions but update resetGame
    function resetGame() {
        currentSection = 1;
        sectionImages.fill(null);
        const overlay = document.querySelector('.celebration-overlay');
        if (overlay) overlay.remove();
        mainCanvas.height = originalCanvasHeight;
        setCanvasSize();
        updatePagination();
        document.querySelector('.next-btn').textContent = 'Siguiente ✨';
    }

    // Event Listeners
    if (penSizeSlider) {
        penSizeSlider.addEventListener('input', (e) => {
            penSize = e.target.value;
            ctx.lineWidth = penSize;
        });
    }

    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        ctx.strokeStyle = currentColor;
        createSparkles(colorPicker);
    });

    document.querySelector('.clear-btn').addEventListener('click', () => {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        createSparkles(document.querySelector('.clear-btn'));
    });

    // Keep your existing event listeners but update canvas references to mainCanvas

    mainCanvas.addEventListener('mousedown', startDrawing);
    mainCanvas.addEventListener('mousemove', draw);
    mainCanvas.addEventListener('mouseup', () => isDrawing = false);
    mainCanvas.addEventListener('mouseout', () => isDrawing = false);
    window.addEventListener('resize', setCanvasSize);

    // Initialize
    setCanvasSize();
    updatePagination();
});
