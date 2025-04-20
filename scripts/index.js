//Audio Format Fallback Logic
function getSupportedAudioPath(basePath) {
  const audio = document.createElement("audio");
  if (audio.canPlayType("audio/ogg")) {
    return basePath + ".ogg";
  } else {
    return basePath + ".mp3";
  }
}

//Keyboard Sound Theme Loader
let sounds = {};
let theme = "keyboard1";

function loadTheme(themeName) {
  theme = themeName;
  localStorage.setItem("theme", theme);

  sounds = {
    cap: new Audio(getSupportedAudioPath(`sounds/themes/${theme}/cap`)),
    delete: new Audio(getSupportedAudioPath(`sounds/themes/${theme}/delete`)),
    return: new Audio(getSupportedAudioPath(`sounds/themes/${theme}/return`)),
    space: new Audio(getSupportedAudioPath(`sounds/themes/${theme}/space`)),
    type: []
  };

  // Load multiple type sounds (type1–type10)
  let typeCount = 0;
  for (let i = 1; i <= 10; i++) {
    const typePath = getSupportedAudioPath(`sounds/themes/${theme}/type${i}`);
    const sound = new Audio(typePath);
    sound.addEventListener("canplaythrough", () => {
      sounds.type.push(sound);
    });
    sound.load();
    typeCount++;
  }

  // Fallback: type.ogg/.mp3 if no variants load
  setTimeout(() => {
    if (sounds.type.length === 0) {
      const fallback = new Audio(getSupportedAudioPath(`sounds/themes/${theme}/type`));
      fallback.load();
      sounds.type.push(fallback);
    }
  }, 500);
}

//Typing Sound Playback
function playSound(type) {
  if (!sounds || !sounds[type]) return;

  if (type === "type") {
    const clip = sounds.type[Math.floor(Math.random() * sounds.type.length)];
    clip.currentTime = 0;
    clip.play();
  } else {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
}

function setupTypingSounds() {
  const input = document.getElementById("searchBox");
  input.addEventListener("keydown", e => {
    if (e.key === " ") return playSound("space");
    if (e.key === "Enter") return playSound("return");
    if (e.key === "Backspace" || e.key === "Delete") return playSound("delete");
    if (e.key.length === 1) {
      if (e.key === e.key.toUpperCase() && e.key.match(/[A-Z]/)) {
        playSound("cap");
      } else {
        playSound("type");
      }
    }
  });
}

//Load Theme List (keyboard1–20)
function listThemes() {
  const select = document.getElementById("themeSelect");
  for (let i = 1; i <= 20; i++) {
    const name = "keyboard" + i;
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }

  const savedTheme = localStorage.getItem("theme") || "keyboard1";
  select.value = savedTheme;
  loadTheme(savedTheme);
}

//Project List Filtering
function updateResults() {
  const query = searchBox.value.trim().toLowerCase();
  let matchCount = 0;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = text.includes(query);
    item.style.display = match ? '' : 'none';
    if (match) matchCount++;
  });

  resultCount.textContent =
    query === ''
      ? 'Showing all projects.'
      : matchCount === 0
      ? `No results found for “${query}”.`
      : `${matchCount} result${matchCount !== 1 ? 's' : ''} found for “${query}”.`;
}

//Page Initialization
let items = [];

window.addEventListener('DOMContentLoaded', () => {
  const ul = document.querySelector('ul');
  items = Array.from(ul.querySelectorAll('li'));
  const searchBox = document.getElementById('searchBox');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultCount = document.getElementById('resultCount');
  const themeSelect = document.getElementById("themeSelect");

  themeSelect.addEventListener("change", () => {
    loadTheme(themeSelect.value);
  });

  // Sort projects alphabetically
  items.sort((a, b) => a.textContent.localeCompare(b.textContent));
  items.forEach(item => ul.appendChild(item));

  searchBox.addEventListener('input', updateResults);
  searchBtn.addEventListener('click', updateResults);
  clearBtn.addEventListener('click', () => {
    searchBox.value = '';
    updateResults();
    searchBox.focus();
  });

  listThemes();
  setupTypingSounds();
  updateResults();
});
