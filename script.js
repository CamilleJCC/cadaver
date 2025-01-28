document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const penSizeSlider = document.getElementById('penSize');
    const brushSelector = document.getElementById('brushStyle');
    
    let isDrawing = false;
    let currentColor = colorPicker.value;
    let currentSection = 1;
    let penSize = penSizeSlider ? penSizeSlider.value : 5;
    let currentBrushStyle = 'pencil';
    const totalSections = 3;
    const sectionImages = new Array(totalSections).fill(null);
    let originalCanvasHeight;
    let isViewingFinal = false;
    let hasFinalized = false;

    const brushStyles = {
        pencil: {
            setup(ctx) {
                ctx.globalAlpha = 1;
                ctx.lineWidth = penSize;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            },
            draw(ctx, x, y) {
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        },
        marker: {
            setup(ctx) {
                ctx.globalAlpha = 1;
                ctx.lineWidth = penSize * 2;
                ctx.lineCap = 'square';
                ctx.lineJoin = 'miter';
            },
            draw(ctx, x, y) {
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        },
        crayon: {
            setup(ctx) {
                ctx.lineWidth = penSize * 1.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalAlpha = 0.8;
            },
            draw(ctx, x, y) {
                for(let i = 0; i < 3; i++) {
                    ctx.lineTo(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1);
                    ctx.stroke();
                }
            }
        },
        spray: {
            setup(ctx) {
                ctx.fillStyle = currentColor;
                ctx.globalAlpha = 1;
            },
            draw(ctx, x, y) {
                for(let i = 0; i < 20; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * penSize * 2;
                    ctx.fillRect(
                        x + radius * Math.cos(angle),
                        y + radius * Math.sin(angle),
                        1, 1
                    );
                }
            }
        }
    };
    function setCanvasSize() {
        const frame = canvas.parentElement;
        const sectionHeight = frame.offsetWidth * 0.5;
        canvas.width = frame.offsetWidth;
        canvas.height = sectionHeight;
        originalCanvasHeight = canvas.height;
        drawSectionGuides();
    }

    function drawSectionGuides() {
        ctx.save();
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
        
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(20, 20);
        ctx.moveTo(canvas.width - 20, 0);
        ctx.lineTo(canvas.width - 20, 20);
        ctx.moveTo(20, canvas.height - 20);
        ctx.lineTo(20, canvas.height);
        ctx.moveTo(canvas.width - 20, canvas.height - 20);
        ctx.lineTo(canvas.width - 20, canvas.height);
        ctx.stroke();
        
        ctx.restore();
    }

   function startDrawing(e) {
    if (isViewingFinal) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    brushStyles[currentBrushStyle].setup(ctx);
}

function draw(e) {
    if (!isDrawing || isViewingFinal) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    
    const isOnGuide = y < 10 || y > canvas.height - 10;
    
    if (!isOnGuide) {
        ctx.strokeStyle = currentColor;
        brushStyles[currentBrushStyle].draw(ctx, x, y);
    }
}


    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    

    function showFinalCreation() {
        isViewingFinal = true;
        canvas.classList.add('final-view');
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
        if (hasFinalized) return;
        hasFinalized = true;
        
        const drawingTools = document.querySelector('.drawing-tools');
        drawingTools.innerHTML = `
            <div class="celebration-message">
                <h2>¡Tu cadáver exquisito está completo! ✨</h2>
                <p>¡Has creado una obra de arte única!</p>
            </div>
            <div class="celebration-buttons">
                <button class="download-btn tool-button">Descargar</button>
                <button class="restart-btn tool-button">Crear otro</button>
            </div>
        `;

        document.querySelector('.download-btn').addEventListener('click', async () => {
            const imageData = canvas.toDataURL('image/jpg');
            
            // Local download
            const link = document.createElement('a');
            link.download = `cadaver_exquisito_${new Date().getTime()}.jpg`;
            link.href = imageData;
            link.click();
            
        });

        document.querySelector('.restart-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }

    async function saveToGitHub(imageData) {
        const timestamp = new Date().getTime();
        const filename = `cadaver_exquisito_${timestamp}.jpg`;
        
        const owner = 'camillejcc';
        const repo = 'cadaver';
        const path = `saved-images/${filename}`;
        
        const base64Data = imageData.split(',')[1];
        
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Add new cadaver exquisito: ${filename}`,
                    content: base64Data,
                    branch: 'main'
                })
            });
            return response.ok;
        } catch (error) {
            console.log('Error saving to GitHub:', error);
            return false;
        }
    }

    function updatePagination() {
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentSection);
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

    function initializeEventListeners() {
        const newColorPicker = document.getElementById('colorPicker');
        const newPenSizeSlider = document.getElementById('penSize');
        const newBrushSelector = document.getElementById('brushStyle');
        
        newColorPicker.addEventListener('input', (e) => {
            currentColor = e.target.value;
            ctx.strokeStyle = currentColor;
            createSparkles(newColorPicker);
        });

        if (newPenSizeSlider) {
            newPenSizeSlider.addEventListener('input', (e) => {
                penSize = e.target.value;
                ctx.lineWidth = penSize;
            });
        }

        if (newBrushSelector) {
            newBrushSelector.addEventListener('change', (e) => {
                currentBrushStyle = e.target.value;
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
            if (currentSection <= totalSections && !hasFinalized) {
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
    }

    // Initial event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', setCanvasSize);

    canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(touch);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    draw(touch);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

    // Initialize
    initializeEventListeners();
    setCanvasSize();
    updatePagination();
});
