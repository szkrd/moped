const fn = {
  getRadioIcon: (song) => {
    const name = song.name ?? '';
    if (name.includes('J-Pop Sakura') || name.includes('Asia DREAM')) {
      return { src: 'images/asiadream.png', alt: 'Asia Dream Radio' };
    } else if (name.includes('Radio Nachtflug')) {
      return { src: 'images/nachtflug.png', alt: 'Radio Nachtflug' };
    } else if (name.includes('Decennial Gothica')) {
      return { src: 'images/decennial.png', alt: 'Decennial Gothica' };
    } else if ((song.location ?? '').includes('SomaFM')) {
      return { src: 'images/soma.png', alt: 'Soma FM' };
    } else if ((song.location ?? '').startsWith('online')) {
      return { src: 'images/earth.png', alt: 'online' };
    } else if ((song.location ?? '').startsWith('local')) {
      return { src: 'images/hdd.png', alt: 'local' };
    } else {
      return { src: 'images/missing.png', alt: '?' };
    }
  },
};

const songListTpl = _.template(`
<ul class="song-list">
  <% _.forEach(songs, (song, idx) => { icon = fn.getRadioIcon(song); %>
    <li class="<%= idx % 2 ? 'odd' : 'even' %>">
      <h3>
        <span class="name song-list-song-name">
          <img src="<%- icon.src %>" width="32" height="32" alt="<%- icon.alt %>" />
          <%- song.formattedName %>
        </span>
        <span class="actions">
          <button class="song-action-button song-button-details">details</button>
          <button class="song-action-button song-button-like-from-history" data-id="<%- song.id %>">like</button>
          <button class="song-action-button song-button-remove" data-id="<%- song.id %>">remove</button>
        </span>
      </h3>
      <table class="details" style="display:none">
        <% _.forEach(_.omit(song, ['liked', 'formattedName', 'id']), (value, key) => { %>
          <tr>
            <td><label class="key"><%- key %>:</label></td>
            <td>
              <% if (key === 'at' && value) { %>
                <span data-key="at" data-value="<%- value %>"></span>
              <% } else { %>
                <span class="value"><%- value %></span>
              <% } %>
            </td>
          </tr>
        <% }) %>
        <tr>
          <td><label>search:</label></td>
          <td>
            <a href="https://www.google.com/search?q=<%-encodeURIComponent(song.formattedName)%>" target="_blank" class="search-provider">
              google
            </a>,
            <a href="https://www.youtube.com/results?search_query=<%-encodeURIComponent(song.formattedName)%>" target="_blank" class="search-provider">
              youtube
            </a>,
            <a href="https://open.spotify.com/search/<%-encodeURIComponent(song.formattedName)%>" target="_blank" class="search-provider">
              spotify
            </a>
          </td>
        </tr>
      </table>
    </li>
  <% }) %>
</ul>
`);

export const htmlTemplates = {
  songList: (data) => songListTpl({ ...data, fn }),
};
