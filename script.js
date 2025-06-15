const siteURLInput = document.getElementById('site-url');
const selectorInput = document.getElementById('link-selector');
const trackBtn = document.getElementById('track-btn');
const manualList = document.getElementById('manual-list');
const manualBtn = document.getElementById('manual-btn');
const trackerArea = document.getElementById('tracker-area');
const progressText = document.getElementById('progress-text');
const chapterTableBody = document.querySelector('#chapter-table tbody');

const resumeDashboard = document.getElementById('resume-dashboard');
const resumeTiles = document.getElementById('resume-tiles');

let progressData = JSON.parse(localStorage.getItem('progressData')) || {};
let currentSite = '';
let chapters = [];
let checked = [];

// Render dashboard tiles
function renderResumeTiles() {
  resumeTiles.innerHTML = '';
  const sites = Object.keys(progressData);
  if (sites.length === 0) {
    resumeDashboard.style.display = 'none';
    return;
  }
  resumeDashboard.style.display = 'block';
  sites.forEach(site => {
    const tile = document.createElement('div');
    tile.className = 'resume-tile';
    tile.textContent = site;
    tile.onclick = () => resumeSite(site);
    resumeTiles.appendChild(tile);
  });
}

// Resume a site
function resumeSite(site) {
  currentSite = site;
  chapters = progressData[site].chapters;
  checked = progressData[site].checked;
  renderChapters();
  updateProgress();
  trackerArea.style.display = 'block';
}

// Fetch chapters from URL
async function loadChapterList(url, selector) {
  const response = await fetch(`/.netlify/functions/fetchPage?url=${encodeURIComponent(url)}`);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const links = doc.querySelectorAll(selector || "a");
  const items = [];
  links.forEach(link => {
    const title = link.textContent.trim();
    const href = link.href;
    if (title && href) items.push({ title, href });
  });
  return items;
}

// Render checklist table
function renderChapters() {
  chapterTableBody.innerHTML = '';
  chapters.forEach((item, i) => {
    const row = document.createElement('tr');

    const tdCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked.includes(i);
    checkbox.onchange = () => {
      if (checkbox.checked) checked.push(i);
      else checked = checked.filter(x => x !== i);
      saveProgress();
      updateProgress();
    };
    tdCheck.appendChild(checkbox);

    const tdTitle = document.createElement('td');
    const link = document.createElement('a');
    link.href = item.href;
    link.target = '_blank';
    link.textContent = item.title;
    tdTitle.appendChild(link);

    row.appendChild(tdCheck);
    row.appendChild(tdTitle);
    chapterTableBody.appendChild(row);
  });
}

// Save progress
function saveProgress() {
  progressData[currentSite] = { chapters, checked };
  localStorage.setItem('progressData', JSON.stringify(progressData));
}

// Update progress text
function updateProgress() {
  const done = checked.length;
  const total = chapters.length;
  const percent = total ? ((done / total) * 100).toFixed(2) : 0;
  progressText.textContent = `Progress: ${done} / ${total} (${percent}%)`;
}

// Click handlers
trackBtn.onclick = async () => {
  const url = siteURLInput.value.trim();
  const selector = selectorInput.value.trim();
  if (!url) {
    alert("Please enter a site URL.");
    return;
  }
  const site = new URL(url).hostname;
  currentSite = site;
  chapters = await loadChapterList(url, selector);
  checked = [];
  saveProgress();
  renderChapters();
  updateProgress();
  trackerArea.style.display = 'block';
  renderResumeTiles();
};

manualBtn.onclick = () => {
  const list = manualList.value.trim().split('\n').filter(Boolean);
  if (list.length === 0) return;
  const site = siteURLInput.value.trim() ? new URL(siteURLInput.value).hostname : 'ManualEntry';
  currentSite = site;
  chapters = list.map(item => ({ title: item, href: '#' }));
  checked = [];
  saveProgress();
  renderChapters();
  updateProgress();
  trackerArea.style.display = 'block';
  renderResumeTiles();
};

// Initial load
renderResumeTiles();
