let items = [];

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
