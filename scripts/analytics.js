function trackProjectClick(projectName) {
  if (window.plausible) {
    window.plausible('Project Click', {
      props: { project: projectName }
    });
  }
}

async function fetchClickCounts() {
  const projectNames = [
    'CookyCraze',
    'DiceRoler',
    'InstrumentSimulator',
    'MusicPlayerRemake',
    'SimpleFighter',
    'SixthSenceRemake',
    'TileSimulator',
    'ToyMania',
    'WeaponSimulator',
    'WheelSpinner'
  ];

  const counts = {};

  for (const name of projectNames) {
    try {
      const response = await fetch('https://plausible.io/api/v1/stats/breakdown', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_id: 'tsatria03.github.io',
          period: '30d',
          property: 'event:project',
          metrics: ['events'],
          filters: `event:name==Project Click;event:project==${name}`
        })
      });

      const data = await response.json();
      counts[name] = data.results[0]?.events || 0;
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
      counts[name] = 0;
    }
  }

  return counts;
}

async function updateProjectList() {
  const counts = await fetchClickCounts();

  const projectList = document.querySelectorAll('#projectList li');
  projectList.forEach((li) => {
    const link = li.querySelector('a');
    const projectName = link.textContent.split(':')[0];
    const count = counts[projectName] || 0;
    li.textContent = `${projectName}: made in NVGT. Clicked ${count} times.`;
    li.prepend(link);
  });
}

function setupProjectLinks() {
  const projectList = document.querySelectorAll('#projectList li a');
  projectList.forEach((link) => {
    const projectName = link.textContent.split(':')[0];
    link.addEventListener('click', () => trackProjectClick(projectName));
  });
}
