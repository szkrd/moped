import { escapeHtml, getCurrentSongName } from './utils.js';

const { dayjs } = window;
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_duration);

const SIO_DEBOUNCE = 1000;
let loadCount = 0;
const statusData = {};

function changeLoadCount(n) {
  loadCount += n;
  $('body').toggleClass('loading', loadCount > 0);
}

function getOrPostJSON(url, data, onSuccess) {
  onSuccess = onSuccess || _.noop;
  changeLoadCount(1);
  const onSucc = (resp) => {
    changeLoadCount(-1);
    onSuccess(resp);
  };
  const onErr = (err) => {
    changeLoadCount(-1);
    console.log('Ajax error:', err);
  };
  if (data === null) return $.getJSON(url, onSucc, onErr);
  return $.ajax({
    type: 'POST',
    url,
    data: JSON.stringify(data),
    success: onSucc,
    error: onErr,
    contentType: 'application/json',
    dataType: 'json',
  });
}

function postJSON(url, data, onSuccess) {
  return getOrPostJSON(url, data, onSuccess);
}

function getJSON(url, onSuccess) {
  return getOrPostJSON(url, null, onSuccess);
}

function updateJsonDataUi(prefix, obj) {
  const deprecated = ['time'];
  const subTypeDate = ['dbUpdate'];
  const subTypeTime = ['playtime', 'uptime', 'elapsed', 'dbPlaytime'];
  const subTypeRelativeDate = ['at'];
  const html = [];
  if (!obj.at) obj.at = Date.now();
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    let className = [typeof val];
    let text = val;
    let formattedText = '';
    let subType = '';
    if (deprecated.includes(key)) return;
    if (subTypeDate.includes(key) && typeof val === 'number') {
      subType = 'date';
      text = window.dayjs(val * 1000).format('YYYY MMM. D. / HH:mm');
    }
    if (subTypeTime.includes(key)) {
      subType = 'time';
      formattedText = dayjs(val * 1000).format('HH:mm:ss'); // from seconds
    }
    if (subTypeRelativeDate.includes(key)) subType = 'relativeDate';
    if (subType) className.push(subType);
    if (val !== false) {
      html.push(`
      <li>
        <label>${escapeHtml(key)}</label>
        <span class="${className.join(' ')}" data-key="${key}" data-value="${escapeHtml(text)}">
          ${escapeHtml(formattedText || text)}
        </span>
      </li>
      `);
    }
  });
  $(`ul.${prefix}`).html(html.join(''));
}

function refreshStats(subsystem = 'all') {
  if (['all', 'current-song'].includes(subsystem)) {
    getJSON('/api/status/current-song', (resp) => {
      const title = getCurrentSongName(resp);
      statusData.currentSong = { ...resp, title };
      document.title = title || 'moped';
      $('.current-song-name').text(title || '-');
      $('.external-search')[title ? 'show' : 'hide']();
      $('.search-provider').each((idx, el) => {
        $(el).attr('href', el.dataset.href.replace('%SEARCH%', encodeURIComponent(title)));
      });
      updateJsonDataUi('current-song', resp);
    });
  }
  if (['all', 'status'].includes(subsystem)) {
    getJSON('/api/status/status', (resp) => {
      statusData.status = resp;
      updateJsonDataUi('status', resp);
      const vol = resp.volume;
      const roundedVol = Math.round(vol / 10);
      $('button.vol-num').removeClass('selected');
      $(`button.vol-num.vol-num-${roundedVol}`).addClass('selected');
    });
  }
  if (['all', 'stats'].includes(subsystem)) {
    getJSON('/api/status/stats', (resp) => {
      statusData.stats = resp;
      updateJsonDataUi('stats', resp);
    });
  }
}

function likeOrDislikeCurrent() {
  postJSON('/api/extra/like', statusData.currentSong);
}

function setupSocketIo() {
  const socket = window.io();
  socket.on(
    'idle',
    _.debounce((data) => {
      updateJsonDataUi('idle', data);
      if (['player', 'playlist'].includes(data.subsystem)) {
        refreshStats('current-song');
      }
      if (['mixer'].includes(data.subsystem)) {
        refreshStats('status');
      }
    }, SIO_DEBOUNCE)
  );
}

function onBodyClick(evt) {
  const target = $(evt.target);
  if (target.is('button.action')) {
    const dataUrl = target.data('api-call');
    const id = target.attr('id');
    if (id === 'controls-refresh') {
      refreshStats();
    }
    if (id === 'controls-volume') {
      refreshStats('status');
    }
    if (id === 'controls-fav') {
      likeOrDislikeCurrent();
    }
    if (dataUrl) {
      getJSON(dataUrl);
    }
  }
}

function refreshRealitveTimes() {
  setInterval(() => {
    $('span[data-key="at"]').each((idx, el) => {
      el = $(el);
      const val = el.data('value');
      if (/^\d+$/.test(val)) el.text(dayjs(val).fromNow() + ` (${val})`);
    });
  }, 1000);
}

export default function main() {
  $('body').on('click', onBodyClick);
  refreshRealitveTimes();
  setupSocketIo();
  refreshStats();
}
