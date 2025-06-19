function isMobile() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

function handleOrientationChange() {
  const searchContainer = document.getElementById("searchContainer");
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobile()) {
    searchContainer.style.display = isLandscape ? "" : "none";
  }
}
