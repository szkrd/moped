import { escapeHtml, getCurrentSongName } from './utils.js';

const { dayjs } = window;
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_duration);

const SIO_DEBOUNCE = 1000;
let loadCount = 0;

function changeLoadCount(n) {
  loadCount += n;
  $('body').toggleClass('loading', loadCount > 0);
}

function getJSON(url, onSuccess) {
  onSuccess = onSuccess || _.noop;
  changeLoadCount(1);
  $.getJSON(
    url,
    (resp) => {
      changeLoadCount(-1);
      onSuccess(resp);
    },
    (err) => {
      changeLoadCount(-1);
      console.log('Ajax error:', err);
    }
  );
}

function updateJsonDataUi(prefix, obj) {
  const deprecated = ['time'];
  const subTypeDate = ['dbUpdate'];
  const subTypeTime = ['playtime', 'uptime', 'elapsed', 'dbPlaytime'];
  const subTypeRelativeDate = ['at'];
  const html = [];
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
      updateJsonDataUi('status', resp);
      const vol = resp.volume;
      const roundedVol = Math.round(vol / 10);
      $('button.vol-num').removeClass('selected');
      $(`button.vol-num.vol-num-${roundedVol}`).addClass('selected');
    });
  }
  if (['all', 'stats'].includes(subsystem)) {
    getJSON('/api/status/stats', (resp) => updateJsonDataUi('stats', resp));
  }
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
    if (target.attr('id') === 'controls-refresh') {
      refreshStats();
    }
    if (target.attr('id') === 'controls-volume') {
      refreshStats('status');
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
