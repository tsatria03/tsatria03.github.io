function isMobile() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

function handleOrientationChange() {
  const themeContainer = document.getElementById("themeContainer");
  const searchContainer = document.getElementById("searchContainer");

  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobile()) {
    if (themeContainer) themeContainer.style.display = isLandscape ? "" : "none";
    if (searchContainer) searchContainer.style.display = isLandscape ? "" : "none";
  }
}

let sounds = {};
let theme = "keyboard1";

function loadTheme(themeName) {
  theme = themeName;
  localStorage.setItem("theme", theme);

  sounds = {
    cap: new Audio(`sounds/themes/${theme}/cap.mp3`),
    delete: new Audio(`sounds/themes/${theme}/delete.mp3`),
    return: new Audio(`sounds/themes/${theme}/return.mp3`),
    space: new Audio(`sounds/themes/${theme}/space.mp3`),
    type: []
  };

  for (let i = 1; i <= 20; i++) {
    const sound = new Audio(`sounds/themes/${theme}/type${i}.mp3`);
    sound.addEventListener("canplaythrough", () => {
      sounds.type.push(sound);
    });
    sound.load();
  }

  setTimeout(() => {
    if (sounds.type.length === 0) {
      const fallback = new Audio(`sounds/themes/${theme}/type.mp3`);
      fallback.load();
      sounds.type.push(fallback);
    }
  }, 500);
}

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
  const searchContainer = document.getElementById("searchContainer");

  if (!isMobile()) {
    themeSelect.addEventListener("change", () => {
      loadTheme(themeSelect.value);
    });
    listThemes();
    setupTypingSounds();

    searchBox.addEventListener('input', updateResults);
    searchBtn.addEventListener('click', updateResults);
    clearBtn.addEventListener('click', () => {
      searchBox.value = '';
      updateResults();
      searchBox.focus();
    });
  }

  items.sort((a, b) => a.textContent.localeCompare(b.textContent));
  items.forEach(item => ul.appendChild(item));
  updateResults();

  handleOrientationChange();
});

window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);
