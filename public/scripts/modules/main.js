import { escapeHtml } from './utils.js';
import { htmlTemplates } from './htmlTemplates.js';

const { dayjs } = window;
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_duration);

const SIO_DEBOUNCE = 1000;
let loadCount = 0;
const statusData = {};
let currentHistory = [];

/**
 * Increase or decrease the global in progress counter,
 * show loading message in top corner if an ajax call is in progress.
 */
function changeLoadCount(n) {
  loadCount += n;
  $('body').toggleClass('loading', loadCount > 0);
}

/**
 * Thin wrapper around $.ajax: handles load count
 * and logs errors to the console.
 */
function _getOrPostJSON(url, method = 'POST', data, onSuccess) {
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
    type: method,
    url,
    data: JSON.stringify(data),
    success: onSucc,
    error: onErr,
    contentType: 'application/json',
    dataType: 'json',
  });
}

const ajax = {
  post: (url, data, onSuccess) => _getOrPostJSON(url, 'POST', data, onSuccess),
  get: (url, onSuccess) => _getOrPostJSON(url, 'GET', null, onSuccess),
  del: (url, data, onSuccess) => _getOrPostJSON(url, 'DELETE', data, onSuccess),
};

/**
 * Renders the stats tab.
 */
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

/**
 * Downloads all stats (stats, status and current-song info)
 * and updates the UI (stats section, button states).
 */
function refreshStats(subsystem = 'all') {
  if (['all', 'current-song'].includes(subsystem)) {
    ajax.get('/api/status/current-song', (resp) => {
      const title = resp.formattedName;
      statusData.currentSong = { ...resp, title };
      document.title = title || 'moped';
      $('#controls-fav').toggleClass('selected', resp.liked);
      $('.current-song-name').text(title || '-');
      $('.external-search')[title ? 'show' : 'hide']();
      $('.search-provider').each((idx, el) => {
        if (el.dataset.href) {
          $(el).attr('href', el.dataset.href.replace('%SEARCH%', encodeURIComponent(title)));
        }
      });
      updateJsonDataUi('current-song', resp);
    });
  }
  if (['all', 'status'].includes(subsystem)) {
    ajax.get('/api/status/status', (resp) => {
      statusData.status = resp;
      updateJsonDataUi('status', resp);
      const vol = resp.volume;
      const roundedVol = Math.round(vol / 10);
      $('button.vol-num').removeClass('selected');
      $(`button.vol-num.vol-num-${roundedVol}`).addClass('selected');
    });
  }
  if (['all', 'stats'].includes(subsystem)) {
    ajax.get('/api/status/stats', (resp) => {
      statusData.stats = resp;
      updateJsonDataUi('stats', resp);
    });
  }
}

/**
 * Initializes SocketIO and subscribes to MPD
 * idle messages (which are rather trigger happy).
 */
function setupSocketIo() {
  const socket = window.io();
  socket.on(
    'idle',
    _.debounce((data) => {
      updateJsonDataUi('idle', data);
      if (['player', 'playlist'].includes(data.subsystem)) {
        refreshStats('current-song');
        refreshHistory();
      }
      if (['mixer'].includes(data.subsystem)) {
        refreshStats('status');
      }
    }, SIO_DEBOUNCE)
  );
}

/**
 * Downloads favorites, updates the  favorites tab.
 */
function refreshFavorites(show = false) {
  const el = $('#tab-page-favorites').html('...');
  if (show === true) el.show();
  ajax.get('/api/extra/likes', (resp) => el.html(htmlTemplates.songList(resp)));
}

/**
 * Downloads history, updates the  history tab.
 */
function refreshHistory(show = false) {
  const el = $('#tab-page-history').html('...');
  if (show === true) el.show();
  ajax.get('/api/extra/history', (resp) => {
    currentHistory = resp.songs;
    el.html(htmlTemplates.songList(resp));
  });
}

/**
 * Unselect all tab switcher buttons, mark selected,
 * toggle visible page div.
 */
function selectTab(name = 'stats') {
  $('button.tab-button').removeClass('selected');
  $('.tab-page').hide();
  if (name === 'stats') {
    $('#tab-button-stats').addClass('selected');
    refreshStats();
    $('#tab-page-stats').show();
  }
  if (name === 'favorites') {
    $('#tab-button-favorites').addClass('selected');
    refreshFavorites(true);
  }
  if (name === 'history') {
    $('#tab-button-history').addClass('selected');
    refreshHistory(true);
  }
}

/**
 * Sets up all common clickhandlers (mostly the buttons).
 */
function onBodyClick(evt) {
  const target = $(evt.target);
  const id = target.attr('id');
  // topmost control buttons
  if (target.is('button.action')) {
    const dataUrl = target.data('api-call');
    if (id === 'controls-volume') {
      refreshStats('status');
    }
    if (id === 'controls-fav') {
      ajax.post('/api/extra/like', statusData.currentSong, refreshFavorites);
    }
    if (dataUrl) {
      ajax.get(dataUrl);
    }
  }
  // tab switcher buttons (stats, favs, history)
  if (target.is('button.tab-button')) {
    if (id === 'tab-button-stats') {
      selectTab('stats');
    }
    if (id === 'tab-button-favorites') {
      selectTab('favorites');
    }
    if (id === 'tab-button-history') {
      selectTab('history');
    }
  }
  // buttons in the song list
  if (target.is('button.song-action-button')) {
    if (target.hasClass('song-button-details')) {
      target.closest('li').find('table').toggle();
    }
    if (target.hasClass('song-button-remove')) {
      const id = target.data('id');
      ajax.del('/api/extra/like', { id }, refreshFavorites);
    }
    if (target.hasClass('song-button-like-from-history')) {
      const id = parseInt(target.data('id'), 10);
      const match = currentHistory.find((item) => item.id === id);
      if (match) {
        ajax.post('/api/extra/like', match, refreshFavorites);
      }
    }
  }
  // the song list list item text
  if (target.is('.song-list-song-name') || target.closest('.song-list-song-name').length > 0) {
    target.closest('li').find('table').toggle();
  }
}

/**
 * Hunts the dom for "at" values and translates them to relative time.
 */
function refreshRelativeTimes() {
  setInterval(() => {
    $('span[data-key="at"]').each((idx, el) => {
      el = $(el);
      const val = el.data('value');
      el.text(dayjs(val).fromNow() + ` (${val})`);
    });
  }, 1000);
}

// ---

export default function main() {
  $('body').on('click', onBodyClick);
  refreshRelativeTimes();
  setupSocketIo();
  refreshStats();
}
