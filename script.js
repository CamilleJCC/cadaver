document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000000';
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
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        // Restrict drawing to current section
        const sectionHeight = canvas.height / 3;
        const currentSectionY = (currentSection - 1) * sectionHeight;
        if (y >= currentSectionY && y <= currentSectionY + sectionHeight) {
            ctx.strokeStyle = currentColor;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
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

    // Color picker functionality
    document.querySelectorAll('.color-btn').forEach(btn => {
        const color = btn.dataset.color;
        btn.style.backgroundColor = color;
        btn.addEventListener('click', () => {
            currentColor = color;
            createSparkles(btn);
        });
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
    // Add this to your existing JavaScript
const colorButtons = document.querySelectorAll('.color-btn');

colorButtons.forEach(btn => {
    const color = btn.dataset.color;
    btn.style.backgroundColor = color;
    
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        colorButtons.forEach(button => button.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Set current color
        currentColor = color;
        createSparkles(btn);
    });
});


    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    // Initialize canvas
    setCanvasSize();
});
