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
