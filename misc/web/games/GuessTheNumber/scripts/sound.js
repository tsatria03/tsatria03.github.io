const SOUND_FILES = [
    "assets/audio/start.mp3",
    "assets/audio/stop.mp3",
    "assets/audio/high.mp3",
    "assets/audio/low.mp3"
];
const SoundModule = (function () {
    let audioContext = null;
    let unlocked = false;
    let masterVolume = 1.0;
    const buffers = {};
    const activeLoops = {};
    function init() {
        if (audioContext) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioContext = new AudioContext();
        }
        unlockAudio();
    }
    function unlockAudio() {
        function unlock() {
            if (unlocked) return;
            if (audioContext && audioContext.state === "suspended") {
                audioContext.resume();
            }
            unlocked = true;
        }
        ["click","keydown","touchstart"].forEach(event => {
            document.addEventListener(event, unlock, { once:true });
        });
    }
    async function loadSound(path) {
        if (buffers[path]) return buffers[path];
        if (!audioContext) return null;
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        buffers[path] = buffer;
        return buffer;
    }
async function preloadAll() {
    if (!audioContext) init();
    const promises = [];
    for (const file of SOUND_FILES) {
        promises.push(loadSound(file));
    }
    return Promise.all(promises);
}
    async function play(path, options = {}) {
        if (!audioContext) init();
        const loop = options.loop || false;
        const volume = (options.volume ?? 1) * masterVolume;
        try {
            const buffer = await loadSound(path);
            if (!buffer) {
                fallbackPlay(path, loop, volume);
                return;
            }
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = loop;
            const gain = audioContext.createGain();
            gain.gain.value = volume;
            source.connect(gain);
            gain.connect(audioContext.destination);
            source.start(0);
            if (loop) {
                activeLoops[path] = source;
            }
        } catch (e) {
            fallbackPlay(path, loop, volume);
        }
    }
    function fallbackPlay(path, loop, volume) {
        const audio = new Audio(path);
        audio.volume = volume;
        audio.loop = loop;
        audio.play().catch(()=>{});
        if (loop) {
            activeLoops[path] = audio;
        }
    }
    function stop(path) {
        if (!activeLoops[path]) return;
        const src = activeLoops[path];
        if (src.stop) {
            try { src.stop(); } catch(e){}
        }
        if (src.pause) {
            src.pause();
            src.currentTime = 0;
        }
        delete activeLoops[path];
    }
    function setVolume(v) {
        masterVolume = Math.max(0, Math.min(1, v));
    }
    return {init, play, stop, setVolume, preloadAll};
}
)();
