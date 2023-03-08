import { escapeHtml, cleanupString } from './utils.js';

let currentVolume = 0;

function updateJsonDataUi(prefix, obj) {
  const subTypeDate = ['dbUpdate'];
  const subTypeTime = ['playtime', 'uptime'];
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    let className = [typeof val];
    let text = val;
    const el = $(`#${prefix}-${key}`);
    if (typeof val === 'boolean') {
      text = val ? '✓' : '';
      el.parent().toggleClass('disabled', !val);
    } else if (typeof val === 'string') {
      text = cleanupString(text);
    }
    // handle subtype
    let subType = '';
    if (subTypeDate.includes(key) && typeof val === 'number') {
      subType = 'date';
      text = window.dayjs(val * 1000).format('YYYY MMM. D. / HH:mm');
    }
    if (subTypeTime.includes(key)) subType = 'time';
    if (subType) className.push(subType);
    // render html
    el.html(`<span class="${className.join(' ')}">${escapeHtml(text)}</span>`);
  });
}

function refreshAllStats() {
  $.getJSON('/api/status/status', (resp) => {
    updateJsonDataUi('status', resp);
    const vol = (currentVolume = resp.volume);
    const roundedVol = Math.round(vol / 10);
    $('button.vol-num').removeClass('selected');
    $(`button.vol-num.vol-num-${roundedVol}`).addClass('selected');
  });
  $.getJSON('/api/status/stats', (resp) => updateJsonDataUi('stats', resp));
  $.getJSON('/api/status/current-song', (resp) => updateJsonDataUi('current-song', resp));
}

function setupSocketIo() {
  const socket = window.io();
  socket.on('idle', (data) => {
    updateJsonDataUi('idle', data);
    // refreshAllStats(); // way too trigger happy
  });
}

function onBodyClick(evt) {
  const target = $(evt.target);
  if (target.is('button.action')) {
    const dataUrl = target.data('api-call');
    if (target.attr('id') === 'controls-refresh') {
      refreshAllStats();
    }
    if (dataUrl) {
      $.getJSON(dataUrl);
    }
  }
}

export default function main() {
  $('body').on('click', onBodyClick);
  setupSocketIo();
  refreshAllStats();
}
