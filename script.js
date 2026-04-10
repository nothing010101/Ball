const config = {
    slowDelay: 150,      
    fastDelay: 10,       
    boostDuration: 4000, 
    interruptionText: '\x1b[31m -> INTERRUPTED! \x1b[37mWhat should Claude do instead?',
    fasterWorkText: '\x1b[32m FASTERFASTERFASTERFASTER CLANKER \x1b[white]\n',
};

let state = {
    renderDelay: config.slowDelay,
    currentTimer: null,
    isAccelerated: false
};

const term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Consolas, Courier New, monospace',
    theme: {
        background: '#000000',
        foreground: '#ffffff',
    }
});
term.open(document.getElementById('terminal-container'));

const textQueue = [
    'Reading Task.txt file...',
    'Web Search("failed AI hardware products Jibo Kuri analysis why")',
    'Web Search("successful consumer hardware products retention weekly usage AirPods Apple Watch")',
    'Web Search("AI pin Humane failure retail 2024")',
    'Web Search("consumer hardware retention mechanics what keeps people using devices")',
    'Web Search("voice assistant hardware limitations constraints")',
    '------------------------------------------------',
    'I\'ll write the research document directly from my knowledge:',
    'Ruminating... (thinking)',
    'Executing final output generation...'
];

function writeAnimated(text, index = 0, callback) {
    if (index < text.length) {
        term.write(text[index]);
        setTimeout(() => {
            writeAnimated(text, index + 1, callback);
        }, state.renderDelay);
    } else {
        term.write('\r\n');
        if (callback) callback();
    }
}

function processQueue() {
    if (textQueue.length > 0) {
        const nextText = textQueue.shift();
        
        writeAnimated(nextText, 0, () => {
            setTimeout(processQueue, state.isAccelerated ? 100 : 800);
        });
    } else {
        term.write('\x1b[32m -> Process finished.\x1b[37m\n');
    }
}

function triggerAcceleration() {
    // 1. UI Animation for the Whip
    const whipElement = document.getElementById('whip-action');
    whipElement.classList.add('cracking');
    setTimeout(() => {
        whipElement.classList.remove('cracking');
    }, 200); // Matches CSS animation duration

    // 2. Terminal output interruption (mimicking the video)
    term.write('\r\n\x1b[31m B Interrupted \x1b[37m- What should Claude do instead?\n');
    term.write(config.fasterWorkText);

    // 3. Accelerate rendering speed
    state.renderDelay = config.fastDelay;
    state.isAccelerated = true;

    // 4. Terminal shake effect
    const terminalWindow = document.querySelector('.terminal-window');
    terminalWindow.classList.add('shaking');
    setTimeout(() => terminalWindow.classList.remove('shaking'), 400);

    // 5. Reset speed after duration
    if (state.currentTimer) {
        clearTimeout(state.currentTimer);
    }
    state.currentTimer = setTimeout(() => {
        state.renderDelay = config.slowDelay;
        state.isAccelerated = false;
    }, config.boostDuration);
}

document.getElementById('whip-action').addEventListener('click', triggerAcceleration);

term.write('\x1b[37mSystem Initialized.\r\n');
setTimeout(processQueue, 1500);
