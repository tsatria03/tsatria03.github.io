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
  const clip = type === "type"
    ? sounds.type[Math.floor(Math.random() * sounds.type.length)]
    : sounds[type];
  clip.currentTime = 0;
  clip.play();
}

function setupTypingSounds() {
  const input = document.getElementById("searchBox");
  input.addEventListener("keydown", e => {
    if (e.key === " ") return playSound("space");
    if (e.key === "Enter") return playSound("return");
    if (e.key === "Backspace" || e.key === "Delete") return playSound("delete");
    if (e.key.length === 1) {
      playSound(e.key === e.key.toUpperCase() && /[A-Z]/.test(e.key) ? "cap" : "type");
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
