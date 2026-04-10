/** * TERMINAL LOGIC 
 */
const config = {
    slowDelay: 150,      
    fastDelay: 5,       
    boostDuration: 3000 
};

let state = {
    renderDelay: config.slowDelay,
    timer: null,
    isBoosted: false
};

const term = new Terminal({
    cursorBlink: true,
    fontSize: 15,
    fontFamily: 'Consolas, monospace',
    theme: { background: '#000000', foreground: '#00ff00' }
});
term.open(document.getElementById('terminal-container'));

const queue = [
    'Initializing environment variables...',
    'Fetching repository data (slow connection simulated)...',
    'Analyzing deep network architecture...',
    'Building node trees...',
    'Reticulating splines...',
    'Extracting semantic meaning from dataset...',
    'Evaluating tensor outputs...',
    'Awaiting further instructions...'
];

function typeWriter(text, i = 0, cb) {
    if (i < text.length) {
        term.write(text[i]);
        setTimeout(() => typeWriter(text, i + 1, cb), state.renderDelay);
    } else {
        term.write('\r\n');
        if (cb) cb();
    }
}

function processLog() {
    if (queue.length > 0) {
        const line = queue.shift();
        typeWriter(line, 0, () => {
            setTimeout(processLog, state.isBoosted ? 50 : 800);
        });
    } else {
        term.write('\x1b[37m[SYSTEM] Processing completed.\r\n');
    }
}

function activateTerminalBoost() {
    if (state.isBoosted) return;
    
    // Interrupt text
    term.write('\r\n\x1b[31m[!] WHIP DETECTED. OVERCLOCKING PROCESSOR...\x1b[32m\r\n');
    
    state.renderDelay = config.fastDelay;
    state.isBoosted = true;

    const win = document.querySelector('.terminal-window');
    win.classList.add('shaking');
    setTimeout(() => win.classList.remove('shaking'), 300);

    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
        state.renderDelay = config.slowDelay;
        state.isBoosted = false;
        term.write('\r\n\x1b[33m[!] Overclock ended. Returning to standard speed.\x1b[32m\r\n');
    }, config.boostDuration);
}

term.write('\x1b[32m[SYSTEM] Boot sequence initiated.\r\n');
setTimeout(processLog, 1000);

/** * REALISTIC WHIP PHYSICS (CANVAS)
 */
const canvas = document.getElementById('whipCanvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// Whip properties
const originX = w * 0.1;
const originY = h * 0.9;
let handleX = originX;
let handleY = originY;

let isDragging = false;
let isSnapping = false;
let snapProgress = 0;

// Mouse/Touch events
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

canvas.addEventListener('mousedown', (e) => { isDragging = true; isSnapping = false; updateHandle(e); });
canvas.addEventListener('mousemove', (e) => { if (isDragging) updateHandle(e); });
canvas.addEventListener('mouseup', releaseWhip);
canvas.addEventListener('mouseleave', releaseWhip);

canvas.addEventListener('touchstart', (e) => { isDragging = true; isSnapping = false; updateHandle(e); }, {passive: true});
canvas.addEventListener('touchmove', (e) => { if (isDragging) updateHandle(e); }, {passive: true});
canvas.addEventListener('touchend', releaseWhip);

function updateHandle(e) {
    const pos = getPos(e);
    handleX = pos.x;
    handleY = pos.y;
}

function releaseWhip() {
    if (!isDragging) return;
    isDragging = false;
    
    // Calculate distance pulled back
    const dx = handleX - originX;
    const dy = handleY - originY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    // If dragged far enough, trigger the snap
    if (dist > 150) {
        isSnapping = true;
        snapProgress = 0;
        activateTerminalBoost(); // Trigger terminal speed
    } else {
        // Return to resting position without snapping
        handleX = originX;
        handleY = originY;
    }
}

function drawWhip() {
    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.moveTo(originX, originY);

    if (isDragging) {
        // Draw taut whip being pulled
        ctx.quadraticCurveTo(originX, handleY, handleX, handleY);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw Handle knot
        ctx.beginPath();
        ctx.arc(handleX, handleY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#5c2e0e';
        ctx.fill();

    } else if (isSnapping) {
        // Animate the crack
        snapProgress += 0.15;
        if (snapProgress > Math.PI) {
            isSnapping = false;
            handleX = originX;
            handleY = originY;
        } else {
            // Wave math for snap effect
            const waveX = originX + (w * 0.8) * Math.sin(snapProgress);
            const waveY = originY - (h * 0.5) * Math.sin(snapProgress * 2);
            
            ctx.quadraticCurveTo(originX + 100, originY - 200, waveX, waveY);
            ctx.strokeStyle = '#ffffff'; // Flash white on crack
            ctx.lineWidth = 2;
            ctx.stroke();

            // Sonic boom effect at the tip
            if (snapProgress > 2.5 && snapProgress < 2.8) {
                ctx.beginPath();
                ctx.arc(waveX, waveY, 30, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fill();
            }
        }
    } else {
        // Resting state
        ctx.quadraticCurveTo(originX + 50, originY + 50, originX + 100, originY + 20);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    requestAnimationFrame(drawWhip);
}

drawWhip();
    
