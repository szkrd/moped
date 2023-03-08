var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export function escapeHtml(text) {
  return String(text).replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
}

export function cleanupString(text) {
  return String(text).trim().replace(/\s+/g, ' ');
}

export function normalizeName(text) {
  return String(text).trim().replace(/\s+/g, ' ');
}

export function getCurrentSongName(obj) {
  let artist = '';
  let title = '';
  if (obj.title) {
    title = normalizeName(obj.title);
  } else if (obj.name) {
    title = normalizeName(obj.name);
    if (title === 'Klubr?di?') title = 'Klubrádió';
  } else {
    title = (_.last((obj.file || '').split('/')) || '')
      .replace(/^\d+/, '')
      .replace(/^\s+-\s+/, '')
      .replace(/\.\w+$/, '')
      .trim();
  }
  if (obj.artist) {
    artist = normalizeName(obj.artist);
  }
  const text = [artist, title].filter((x) => x.trim()).join(' - ');
  return text;
}
