
// Global variables
let animationId;
let isAnimating = false;
let time = 0;
let frequency = 1000;

// Media properties
const media = {
    air: { speed: 343, density: 1.2, color: '#2196F3', name: 'Air' },
    water: { speed: 1482, density: 1000, color: '#009688', name: 'Water' },
    plastic: { speed: 2300, density: 920, color: '#e91e63', name: 'Plastic' }
};

// Get canvas elements
const canvases = {
    air: document.getElementById('airCanvas'),
    water: document.getElementById('waterCanvas'),
    plastic: document.getElementById('plasticCanvas')
};

// Initialize contexts for each canvas
const contexts = {};
Object.keys(canvases).forEach(key => {
    contexts[key] = canvases[key].getContext('2d');
});

// Update wavelength values
function updateWavelengths() {
    Object.keys(media).forEach(key => {
        const wavelength = media[key].speed / frequency;
        document.getElementById(`${key}Wavelength`).textContent = wavelength.toFixed(2);
    });
}

// Draw wave function
function drawWave(ctx, medium, canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw center line
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate wave properties
    const wavelength = medium.speed / frequency;
    const amplitude = 40;
    const phase = time * 0.1;
    
    // Draw the wave
    ctx.strokeStyle = medium.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < width; x += 2) {
        const relativeSpeed = medium.speed / 343; // Relative to air speed
        const y = centerY + amplitude * Math.sin((2 * Math.PI * x / (wavelength * 0.5)) + phase * relativeSpeed);
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = medium.color;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${medium.name} - ${medium.speed} m/s`, 10, 20);
}

// Animation function
function animate() {
    Object.keys(media).forEach(key => {
        drawWave(contexts[key], media[key], canvases[key]);
    });
    
    time++;
    
    if (isAnimating) {
        animationId = requestAnimationFrame(animate);
    }
}

// Toggle animation
function toggleAnimation() {
    const btn = event.target;
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationId);
        btn.textContent = '▶️ Start Animation';
    } else {
        isAnimating = true;
        btn.textContent = '⏸️ Stop Animation';
        animate();
    }
}

// Reset waves
function resetWaves() {
    time = 0;
    Object.keys(media).forEach(key => {
        drawWave(contexts[key], media[key], canvases[key]);
    });
}

// Frequency slider handler
document.getElementById('frequencySlider').addEventListener('input', function(e) {
    frequency = parseInt(e.target.value);
    document.getElementById('frequencyValue').textContent = frequency;
    updateWavelengths();
    resetWaves();
});

// Initial setup
updateWavelengths();
resetWaves();