export const htmlTemplates = {
  songList: _.template(`
    <ul class="song-list">
      <% _.forEach(songs, (song, idx) => { %>
        <li class="<%= idx % 2 ? 'odd' : 'even' %>">
          <h3>
            <span class="name song-list-song-name">
              <% if ((song.name ?? '').includes('Decennial Gothica')) { %>
                <img src="images/decennial.png" width="32" height="32" alt="Decennial Gothica" />
              <% } else if ((song.location ?? '').includes('SomaFM')) { %>
                <img src="images/soma.png" width="32" height="32" alt="Soma FM" />
              <% } else if ((song.location ?? '').startsWith('online')) { %>
                <img src="images/earth.png" width="32" height="32" alt="online" />
              <% } else if ((song.location ?? '').startsWith('local')) { %>
                <img src="images/hdd.png" width="32" height="32" alt="local" />
              <% } %>
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
  `),
};
