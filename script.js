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
        canvas.width = frame.offsetWidth;
        canvas.height = frame.offsetWidth * 1.5;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
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
        
        const sectionHeight = canvas.height / 3;
        const sectionTop = (currentSection - 1) * sectionHeight;
        const sectionBottom = currentSection * sectionHeight;
        
        if (y >= sectionTop && y <= sectionBottom) {
            ctx.strokeStyle = currentColor;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }

    function drawSectionGuides() {
        const sectionHeight = canvas.height / 3;
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#c4e0ff';
        
        for (let i = 1; i < totalSections; i++) {
            const y = sectionHeight * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    function updatePagination() {
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentSection);
        });
    }

    function showFinalCreation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const sectionHeight = canvas.height / 3;
        
        let loadedImages = 0;
        sectionImages.forEach((imgData, i) => {
            if (imgData) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, i * sectionHeight, canvas.width, sectionHeight);
                    loadedImages++;
                    if (loadedImages === totalSections) {
                        setTimeout(createMagicalCelebration, 500);
                    }
                };
                img.src = imgData;
            }
        });
    }

    function createMagicalCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-overlay';
        celebration.innerHTML = `
            <div class="celebration-message">
                ¡Tu cadáver exquisito está completo! ✨
                <div class="celebration-buttons">
                    <button class="restart-btn">Crear otro</button>
                    <button class="save-btn">Guardar creación</button>
                </div>
            </div>
        `;
        document.body.appendChild(celebration);
        
        celebration.querySelector('.restart-btn').addEventListener('click', () => {
            celebration.remove();
            resetGame();
        });
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

    function resetGame() {
        currentSection = 1;
        sectionImages.fill(null);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSectionGuides();
        updatePagination();
        document.querySelector('.next-btn').textContent = 'Siguiente ✨';
    }

    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        ctx.strokeStyle = currentColor;
        createSparkles(colorPicker);
    });

    document.querySelector('.clear-btn').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSectionGuides();
        createSparkles(document.querySelector('.clear-btn'));
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        if (currentSection <= totalSections) {
            sectionImages[currentSection - 1] = canvas.toDataURL();
            
            if (currentSection === totalSections) {
                showFinalCreation();
            } else {
                currentSection++;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawSectionGuides();
                updatePagination();
                
                if (currentSection === totalSections) {
                    document.querySelector('.next-btn').textContent = 'Finalizar ✨';
                }
            }
        }
        createSparkles(document.querySelector('.next-btn'));
    });

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    setCanvasSize();
    updatePagination();
});
