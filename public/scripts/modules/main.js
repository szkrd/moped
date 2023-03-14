import { escapeHtml } from './utils.js';

const { dayjs } = window;
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_duration);

const SIO_DEBOUNCE = 1000;
let loadCount = 0;
const statusData = {};

const htmlTemplates = {
  songList: _.template(`
    <ul class="song-list">
      <% _.forEach(songs, (song) => { %>
        <li>
          <h3>
            <span class="name"><%- song.formattedName %></span>
            <span class="actions">
              <button class="song-action-button" id="song-button-details">details</button>
              <button class="song-action-button" id="song-button-remove" data-id="<%- song.id %>">remove</button>
            </span>
          </h3>
          <table class="details" style="display:none">
            <% _.forEach(_.omit(song, ['liked', 'formattedName', 'id']), (value, key) => { %>
              <tr>
                <td><label class="key"><%- key %>:</label></td>
                <td><span class="value"><%- value %></span></td>
              </tr>
            <% }) %>
          </table>
        </li>
      <% }) %>
    </ul>
  `),
};

function changeLoadCount(n) {
  loadCount += n;
  $('body').toggleClass('loading', loadCount > 0);
}

function getOrPostJSON(url, method = 'POST', data, onSuccess) {
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
  post: (url, data, onSuccess) => getOrPostJSON(url, 'POST', data, onSuccess),
  get: (url, onSuccess) => getOrPostJSON(url, 'GET', null, onSuccess),
  del: (url, data, onSuccess) => getOrPostJSON(url, 'DELETE', data, onSuccess),
};

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
    ajax.get('/api/status/current-song', (resp) => {
      const title = resp.formattedName;
      statusData.currentSong = { ...resp, title };
      document.title = title || 'moped';
      $('#controls-fav').toggleClass('selected', resp.liked);
      $('.current-song-name').text(title || '-');
      $('.external-search')[title ? 'show' : 'hide']();
      $('.search-provider').each((idx, el) => {
        $(el).attr('href', el.dataset.href.replace('%SEARCH%', encodeURIComponent(title)));
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

function likeCurrentSong() {
  ajax.post('/api/extra/like', statusData.currentSong, refreshFavorites);
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

function refreshFavorites() {
  $('#tab-page-favorites').html('...').show();
  ajax.get('/api/extra/likes', (resp) => {
    $('#tab-page-favorites').html(htmlTemplates.songList(resp));
  });
}

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
    refreshFavorites();
    $('#tab-page-favorites').show();
  }
}

function onBodyClick(evt) {
  const target = $(evt.target);
  const id = target.attr('id');
  if (target.is('button.action')) {
    const dataUrl = target.data('api-call');
    if (id === 'controls-volume') {
      refreshStats('status');
    }
    if (id === 'controls-fav') {
      likeCurrentSong();
    }
    if (dataUrl) {
      ajax.get(dataUrl);
    }
  }
  if (target.is('button.tab-button')) {
    if (id === 'tab-button-stats') {
      selectTab('stats');
    }
    if (id === 'tab-button-favorites') {
      selectTab('favorites');
    }
  }
  if (target.is('button.song-action-button')) {
    if (id === 'song-button-details') {
      target.closest('li').find('table').toggle();
    }
    if (id === 'song-button-remove') {
      const id = target.data('id');
      ajax.del('/api/extra/like', { id }, refreshFavorites);
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
