// Audio format support helper
function getSupportedAudioPath(basePath) {
  const audio = document.createElement("audio");
  return audio.canPlayType("audio/ogg") ? basePath + ".ogg" : basePath + ".mp3";
}

// Detect if the user is on a mobile device
function isMobile() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

// Typing sound loader
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

  // Load multiple type sounds (type1–type20)
  for (let i = 1; i <= 20; i++) {
    const sound = new Audio(getSupportedAudioPath(`sounds/themes/${theme}/type${i}`));
    sound.addEventListener("canplaythrough", () => {
      sounds.type.push(sound);
    });
    sound.load();
  }

  // Fallback if no type sounds work
  setTimeout(() => {
    if (sounds.type.length === 0) {
      const fallback = new Audio(getSupportedAudioPath(`sounds/themes/${theme}/type`));
      fallback.load();
      sounds.type.push(fallback);
    }
  }, 500);
}

// Play typing sounds
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

// Setup sound playback on typing
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

// Populate theme selector with keyboard1–keyboard20
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

// Update filtered results
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

// Initialization
let items = [];

window.addEventListener('DOMContentLoaded', () => {
  const ul = document.querySelector('ul');
  items = Array.from(ul.querySelectorAll('li'));
  const searchBox = document.getElementById('searchBox');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultCount = document.getElementById('resultCount');
  const themeSelect = document.getElementById("themeSelect");
  const themeContainer = document.getElementById("themeContainer");

  // Hide typing sound controls on mobile
  if (isMobile()) {
    if (themeContainer) themeContainer.style.display = "none";
  } else {
    themeSelect.addEventListener("change", () => {
      loadTheme(themeSelect.value);
    });
    listThemes();
    setupTypingSounds();
  }

  items.sort((a, b) => a.textContent.localeCompare(b.textContent));
  items.forEach(item => ul.appendChild(item));

  searchBox.addEventListener('input', updateResults);
  searchBtn.addEventListener('click', updateResults);
  clearBtn.addEventListener('click', () => {
    searchBox.value = '';
    updateResults();
    searchBox.focus();
  });

  updateResults();
});
