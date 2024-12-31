document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    
    let isDrawing = false;
    let currentColor = colorPicker.value;
    let currentSection = 1;
    const totalSections = 3;
    const sectionImages = new Array(totalSections).fill(null);

  function setCanvasSize() {
    const frame = canvas.parentElement;
    canvas.width = frame.offsetWidth * 1.5; // Smaller width
    canvas.height = 800 * 2; // Taller height
    canvas.style.width = `${frame.offsetWidth * 0.75}px`;
    canvas.style.height = '800px';
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

    function drawSectionGuides() {
        const sectionHeight = canvas.height / 6;
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#c4e0ff';
        
        if (currentSection === 1) {
            ctx.beginPath();
            ctx.moveTo(0, sectionHeight);
            ctx.lineTo(canvas.width, sectionHeight);
            ctx.stroke();
        } else if (currentSection === 2) {
            ctx.beginPath();
            ctx.moveTo(0, sectionHeight * 3);
            ctx.lineTo(canvas.width, sectionHeight * 3);
            ctx.stroke();
        }
        ctx.restore();
    }

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

    function showFinalCreation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sectionImages.forEach((imgData, index) => {
            if (imgData) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, index * (canvas.height/3), canvas.width, canvas.height/3);
                };
                img.src = imgData;
            }
        });
        createMagicalCelebration();
    }

    function createMagicalCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-overlay';
        celebration.innerHTML = `
            <div class="celebration-message">
                ¡Tu cadáver exquisito está completo! ✨
                <button class="restart-btn">Crear otro</button>
            </div>
        `;
        document.body.appendChild(celebration);
        
        celebration.querySelector('.restart-btn').addEventListener('click', () => {
            celebration.remove();
            resetGame();
        });
    }

    function resetGame() {
        currentSection = 1;
        sectionImages.fill(null);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSectionGuides();
        document.querySelector('.next-btn').textContent = 'Siguiente ✨';
    }

    // Color picker event listener
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        ctx.strokeStyle = currentColor;
        createSparkles(colorPicker);
    });

    // Clear canvas button
    document.querySelector('.clear-btn').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSectionGuides();
        createSparkles(document.querySelector('.clear-btn'));
    });

    // Next section button
    document.querySelector('.next-btn').addEventListener('click', () => {
        if (currentSection < totalSections) {
            sectionImages[currentSection - 1] = canvas.toDataURL();
            currentSection++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSectionGuides();
            
            if (currentSection === totalSections) {
                document.querySelector('.next-btn').textContent = 'Finalizar ✨';
            }
        } else {
            showFinalCreation();
        }
        createSparkles(document.querySelector('.next-btn'));
    });
    // Add these functions to your existing JavaScript
function updatePagination() {
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentSection);
    });
}

function showPreviousSections() {
    // Draw previous sections in lighter color
    sectionImages.forEach((imgData, index) => {
        if (imgData && index < currentSection - 1) {
            const img = new Image();
            img.onload = () => {
                ctx.globalAlpha = 0.3;
                ctx.drawImage(img, 0, index * (canvas.height/3), canvas.width, canvas.height/3);
                ctx.globalAlpha = 1.0;
            };
            img.src = imgData;
        }
    });
}

// Modify your existing functions
function setCanvasSize() {
    const frame = canvas.parentElement;
    canvas.width = frame.offsetWidth * 1.5;
    canvas.height = 800 * 2;
    canvas.style.width = `${frame.offsetWidth * 0.75}px`;
    canvas.style.height = '800px';
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    drawSectionGuides();
    showPreviousSections();
}

// Update the next button click handler
document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentSection < totalSections) {
        sectionImages[currentSection - 1] = canvas.toDataURL();
        currentSection++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSectionGuides();
        showPreviousSections();
        updatePagination();
        
        if (currentSection === totalSections) {
            document.querySelector('.next-btn').textContent = 'Finalizar ✨';
        }
    } else {
        showFinalCreation();
    }
    createSparkles(document.querySelector('.next-btn'));
});


    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    // Initialize
    setCanvasSize();
});
