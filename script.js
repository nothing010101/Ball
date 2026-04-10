// Konfigurasi Delay (dalam milidetik per karakter)
let config = {
    slowDelay: 150,      // Kecepatan malas
    fastDelay: 10,       // Kecepatan pecut
    whipDuration: 4000,   // Berapa lama mode pecut bertahan
    interruptionText: '\x1b[31m -> INTERRUPTED! \x1b[37mWhat should Clanker do instead?',
    fasterWorkText: '\x1b[32m [Whip Feedback]: BOOM! Starting high-speed processing mode. \x1b[white]\n',
    finalClankerText: 'Faster CLANKER'
};

// State Aplikasi
let state = {
    renderDelay: config.slowDelay, // Mulai dengan delay lambat
    currentWhipTimer: null,
    isWhipping: false
};

// Inisialisasi Terminal Xterm.js
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

// Antrean Teks Simulasi (seperti di video)
const textQueue = [
    'Reading Task.txt file...',
    'Web Search("failed AI hardware products Jibo Kuri analysis why")',
    'Web Search("successful consumer hardware products retention weekly usage AirPods Apple Watch")',
    'Web Search("AI pin Humane failure retail 2024")',
    'Web Search("consumer hardware retention mechanics what keeps people using devices")',
    'Web Search("voice assistant hardware limitations constraints")',
    '------------------------------------------------',
    'Processing knowledge directly from memory...',
    'Blanching database entries...',
    'Executing final output generation...'
];

// Fungsi untuk merender teks karakter demi karakter dengan delay dinamis
function writeAnimated(text, index = 0, callback) {
    if (index < text.length) {
        // Tulis karakter ke terminal
        term.write(text[index]);

        // Rekursif ke karakter berikutnya dengan delay saat ini
        setTimeout(() => {
            writeAnimated(text, index + 1, callback);
        }, state.renderDelay);
    } else {
        // Teks selesai, pindah baris
        term.write('\r\n');
        if (callback) callback();
    }
}

// Logika untuk memproses antrean teks secara berurutan
function processQueue() {
    if (textQueue.length > 0) {
        const nextText = textQueue.shift();
        
        // Sebelum mulai baris baru, cek apakah sedang dipecut
        // Jika iya, teks interupsi akan muncul di log pecut, bukan di sini
        
        writeAnimated(nextText, 0, () => {
            // Beri sedikit jeda antar baris
            setTimeout(processQueue, state.isWhipping ? 100 : 800);
        });
    } else {
        // Selesai semua teks
        term.write('\x1b[32m -> All tasks completed with high-speed (whip) mode active.\x1b[37m\n');
        term.write('Faster CLANKER\n\x1b[31mForming...\x1b[37m\r\n');
    }
}

// Logika Utama untuk "Memicu Pecutan"
function triggerWhip() {
    console.log("Whip triggered!");

    // 1. Interupsi Teks yang Sedang Berjalan
    // Di video, pecutan diselingi teks interupsi.
    term.write('\x1b[31m -> Interrupted \x1b[37m- What should Claude do instead?\n');
    term.write(config.fasterWorkText);

    // 2. Ubah Kecepatan Rendering ke Mode Cepat
    state.renderDelay = config.fastDelay;
    state.isWhipping = true;

    // 3. Efek Visual (Goncangan Terminal)
    const terminalWindow = document.querySelector('.terminal-window');
    terminalWindow.classList.add('whipped');
    setTimeout(() => terminalWindow.classList.remove('whipped'), 500);

    // 4. Atur Timer untuk Mengembalikan Kecepatan Normal
    if (state.currentWhipTimer) {
        clearTimeout(state.currentWhipTimer); // Reset timer jika dipecut lagi sebelum habis
    }
    state.currentWhipTimer = setTimeout(() => {
        state.renderDelay = config.slowDelay;
        state.isWhipping = false;
        term.write('\x1b[33m [System]: Whip effect worn off. Back to slow mode.\x1b[37m\r\n');
    }, config.whipDuration);
}

// Event Listener untuk Tombol Pecut
document.getElementById('whip-button').addEventListener('click', triggerWhip);

// Memulai Simulasi Terminal
term.write('\x1b[37mClanker.world [Version 0.9.1 WHIP_SIMULATOR]\r\n');
term.write('(c) 2077 Clanker.world / Bankr.bot. All rights reserved.\r\n\n');
setTimeout(processQueue, 1500); // Mulai simulasi setelah jeda 1.5 detik
