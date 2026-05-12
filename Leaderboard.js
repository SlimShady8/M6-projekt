const defaultScores = [
  { name: 'OrmeMester',   score: 520, date: '10/05/2026' },
  { name: 'SnakeKing',    score: 450, date: '09/05/2026' },
  { name: 'GrønOrm',      score: 390, date: '08/05/2026' },
  { name: 'PixelOrm',     score: 350, date: '07/05/2026' },
  { name: 'SpillerX',     score: 280, date: '06/05/2026' },
  { name: 'NinjaSnake',   score: 240, date: '05/05/2026' },
  { name: 'OrmeKomet',    score: 190, date: '04/05/2026' },
];

function loadLeaderboard() {
  const localRaw = JSON.parse(localStorage.getItem('snakeScores') || '[]');
  const localScores = localRaw.map(s => ({ name: 'Du', score: s.score, date: s.date }));

  const allScores = [...defaultScores, ...localScores];
  allScores.sort((a, b) => b.score - a.score);

  const top = allScores.slice(0, 10);
  const tbody = document.getElementById('leaderboard-body');
  tbody.innerHTML = '';

  top.forEach((entry, i) => {
    const tr = document.createElement('tr');

    let rankHtml;
    if (i === 0)      rankHtml = `<span class="rank-gold">🥇</span>`;
    else if (i === 1) rankHtml = `<span class="rank-silver">🥈</span>`;
    else if (i === 2) rankHtml = `<span class="rank-bronze">🥉</span>`;
    else              rankHtml = `<span style="color:#94a3b8; font-weight:bold;">${i + 1}</span>`;

    const isLocal = entry.name === 'Du';
    tr.innerHTML = `
      <td style="text-align:center; width:60px;">${rankHtml}</td>
      <td style="${isLocal ? 'color:#00c853; font-weight:bold;' : ''}">${entry.name}${isLocal ? ' 👤' : ''}</td>
      <td style="font-weight:bold; color:#1a1a2e;">${entry.score}</td>
      <td style="color:#94a3b8;">${entry.date || '–'}</td>
    `;
    tbody.appendChild(tr);
  });

  const personalBest = localStorage.getItem('snakeHighScore');
  if (personalBest) {
    document.getElementById('personal-best').textContent = personalBest;
    document.getElementById('personal-best-section').style.display = 'block';
  }
}

loadLeaderboard();
