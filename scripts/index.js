document.addEventListener('DOMContentLoaded', () => {
  const ul = document.querySelector('ul');
  items = Array.from(ul.querySelectorAll('li'));

  const searchBox = document.getElementById('searchBox');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultCount = document.getElementById('resultCount');
  const themeSelect = document.getElementById("themeSelect");
  const themeContainer = document.getElementById("themeContainer");
  const searchContainer = document.getElementById("searchContainer");
  const toggleSettings = document.getElementById("toggleSettings");

  if (toggleSettings) {
    toggleSettings.addEventListener("click", () => {
      const isHidden = themeContainer.style.display === "none";
      themeContainer.style.display = isHidden ? "" : "none";
      toggleSettings.textContent = isHidden ? "Hide Keyboard Settings" : "Show Keyboard Settings";
    });

    // Set initial label based on visibility
    const isHidden = themeContainer.style.display === "none";
    toggleSettings.textContent = isHidden ? "Show Keyboard Settings" : "Hide Keyboard Settings";
  }

  if (!isMobile()) {
    themeSelect.addEventListener("change", () => loadTheme(themeSelect.value));
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
  setupProjectLinks();
  updateProjectList();
});

window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);
