document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const penSizeSlider = document.getElementById('penSize');
    
    let isDrawing = false;
    let currentColor = colorPicker.value;
    let currentSection = 1;
    let penSize = penSizeSlider ? penSizeSlider.value : 5;
    const totalSections = 3;
    const sectionImages = new Array(totalSections).fill(null);
    const peekHeight = 30;
    let originalCanvasHeight;
    let isViewingFinal = false;

    function setCanvasSize() {
        const frame = canvas.parentElement;
        const sectionHeight = frame.offsetWidth * 0.4;
        canvas.width = frame.offsetWidth;
        canvas.height = sectionHeight;
        originalCanvasHeight = canvas.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = penSize;
        drawSectionGuides();
    }

    function startDrawing(e) {
        if (isViewingFinal) return;
        isDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing || isViewingFinal) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        const isOnGuide = y < 10 || y > canvas.height - 10;
        
        if (!isOnGuide) {
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = penSize;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }

    function drawSectionGuides() {
        ctx.save();
        
        // Horizontal dashed guides
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#c4e0ff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
        
        // Vertical solid guides at top
        ctx.setLineDash([]); // Remove dash pattern
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(20, 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(canvas.width - 20, 0);
        ctx.lineTo(canvas.width - 20, 20);
        ctx.stroke();
        
        // Vertical solid guides at bottom
        ctx.beginPath();
        ctx.moveTo(20, canvas.height - 20);
        ctx.lineTo(20, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(canvas.width - 20, canvas.height - 20);
        ctx.lineTo(canvas.width - 20, canvas.height);
        ctx.stroke();
        
        ctx.restore();
        ctx.lineWidth = penSize;
    }

    async function saveToFirebase(imageData) {
        const drawingRef = storage.ref().child(`drawings/${Date.now()}.png`);
        try {
            const snapshot = await drawingRef.putString(imageData, 'data_url');
            const downloadURL = await snapshot.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error("Error saving drawing:", error);
            return null;
        }
    }

    function updatePagination() {
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentSection);
        });
    }

    function showFinalCreation() {
        isViewingFinal = true;
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        const sectionHeight = canvas.height;
        
        finalCanvas.width = canvas.width;
        finalCanvas.height = sectionHeight * totalSections;
        
        let loadedImages = 0;
        sectionImages.forEach((imgData, i) => {
            if (imgData) {
                const img = new Image();
                img.onload = () => {
                    finalCtx.drawImage(
                        img, 
                        0, 0, 
                        canvas.width, canvas.height,
                        0, i * sectionHeight,
                        canvas.width, sectionHeight
                    );
                    loadedImages++;
                    if (loadedImages === totalSections) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.height = finalCanvas.height;
                        ctx.drawImage(finalCanvas, 0, 0);
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
                    <button class="save-btn">Guardar creación</button>
                    <button class="restart-btn">Crear otro</button>
                    <button class="gallery-btn">Ver galería</button>
                </div>
            </div>
        `;
        document.body.appendChild(celebration);
        
        celebration.querySelector('.save-btn').addEventListener('click', async () => {
            const imageData = canvas.toDataURL();
            const downloadURL = await saveToFirebase(imageData);
            if (downloadURL) {
                const link = document.createElement('a');
                link.href = downloadURL;
                link.download = `cadaver-exquisito-${Date.now()}.png`;
                link.click();
                createSparkles(celebration.querySelector('.save-btn'));
            }
        });

        celebration.querySelector('.restart-btn').addEventListener('click', resetGame);
        
        celebration.querySelector('.gallery-btn').addEventListener('click', showGallery);
    }

    async function showGallery() {
        const galleryRef = storage.ref().child('drawings');
        try {
            const result = await galleryRef.listAll();
            // Implement gallery view here
        } catch (error) {
            console.error("Error loading gallery:", error);
        }
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
        isViewingFinal = false;
        currentSection = 1;
        sectionImages.fill(null);
        const overlay = document.querySelector('.celebration-overlay');
        if (overlay) overlay.remove();
        canvas.height = originalCanvasHeight;
        setCanvasSize();
        updatePagination();
        document.querySelector('.next-btn').textContent = 'Siguiente ✨';
    }

    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        ctx.strokeStyle = currentColor;
        createSparkles(colorPicker);
    });

    if (penSizeSlider) {
        penSizeSlider.addEventListener('input', (e) => {
            penSize = e.target.value;
            ctx.lineWidth = penSize;
        });
    }

    document.querySelector('.clear-btn').addEventListener('click', () => {
        if (!isViewingFinal) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSectionGuides();
            createSparkles(document.querySelector('.clear-btn'));
        }
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
            createSparkles(document.querySelector('.next-btn'));
        }
    });

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    setCanvasSize();
    updatePagination();
});
