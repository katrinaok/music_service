document.addEventListener("DOMContentLoaded", () => {
  // menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("side-menu");

  menuToggle.addEventListener("click", () => sideMenu.classList.toggle("hidden"));
  document.addEventListener("click", (e) => {
    if (!sideMenu.classList.contains("hidden") &&
        !sideMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      sideMenu.classList.add("hidden");
    }
  });

  // tabs
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  function activateTab(tabName) {
    closePlaylistPage();
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(tc => tc.classList.remove("active"));
    const tabEl = document.querySelector(`.tab[data-tab="${tabName}"]`);
    const contentEl = document.getElementById(tabName);
    if(tabEl) tabEl.classList.add("active");
    if(contentEl) contentEl.classList.add("active");
    sideMenu.classList.add("hidden");

    if(tabName === "albums") loadArtists();
    if(tabName === "tracks") { 
      loadAlbums(); 
      loadTrackArtists(); 
      loadTrackGenres(); 
    }
    if(tabName === "profile") {
      const backup = localStorage.getItem("currentUserBackup");
      if(backup) currentUser = JSON.parse(backup);
      ensureUsersLoaded().then(() => {
        updateProfileUI();
        const profileSection = document.getElementById("profile");
        if(profileSection.style.display === "none") {
          profileSection.style.display = "";
        }
      });
    }
  }

  tabs.forEach(tab => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));

  let currentUser = null;
  let allUsersCache = [];

  // messages
  function showMessage(text, timeout = 3000) {
    const m = document.getElementById("messages");
    m.textContent = text;
    m.style.display = "block";
    setTimeout(() => m.style.display = "none", timeout);
  }

  function showProfileMessage(text) {
    const el = document.getElementById("profile-message");
    el.innerHTML = `<div style="background:#fff3cd;padding:10px;border-radius:6px;border:1px solid #ffeeba;color:#856404;">${text}</div>`;
  }

  function clearProfileMessage() {
    document.getElementById("profile-message").innerHTML = "";
  }

  // users
  async function loadUsers() {
    try {
      const res = await fetch("/users");
      if (!res.ok) throw new Error("Не вдалося завантажити користувачів");

      const data = await res.json();
      allUsersCache = data;

      const savedUserId = parseInt(localStorage.getItem("currentUserId"), 10);

      if (savedUserId) {
        currentUser = data.find(u => u.id === savedUserId) || null;
      } else {
        currentUser = null;
      }

      updateProfileUI();
      return data;
    } catch (e) {
      console.error(e);
      allUsersCache = [];
      currentUser = null;
      updateProfileUI();
      return [];
    }
  }
  
  async function ensureUsersLoaded() {
    if (!allUsersCache.length) {
      await loadUsers();
    }
  }

  function updateProfileUI() {
    const nameSpan = document.getElementById("current-user-name");
    const profileFormSection = document.getElementById("profile-user-form");
    const contentSection = document.getElementById("user-content");
    const userListDiv = document.getElementById("profile-user-list");

    userListDiv.innerHTML = "";

    if (!currentUser) {
      nameSpan.textContent = "—";
      profileFormSection.style.display = "block";
      contentSection.style.display = "none";
    } else {
      nameSpan.textContent = currentUser.username || currentUser.name || currentUser.email;
      profileFormSection.style.display = "none";
      contentSection.style.display = "block";

      userListDiv.innerHTML = "";
      loadUserPlaylists();
      loadUserFavorites();
    }
  }

  const profileForm = document.getElementById("profile-create-form");
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("profile-username").value.trim();
    const email = document.getElementById("profile-email").value.trim();
    const password = document.getElementById("profile-password").value;
    const role = document.getElementById("profile-role").value;

    if (!username || !email || !password) {
      return showMessage("Заповніть всі поля");
    }

    try {
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Не вдалося створити акаунт");
        return;
      }
      
      currentUser = data;
      localStorage.setItem("currentUserId", currentUser.id);
      allUsersCache.push(currentUser);
      showMessage(`Акаунт "${currentUser.username}" створено`);
      clearProfileMessage();
      updateProfileUI();
      profileForm.reset();

    } catch (err) {
      console.error(err);
      showMessage("Помилка при створенні акаунту");
    }
  });

  const showLoginBtn = document.getElementById("show-login-btn");
  const loginForm = document.getElementById("profile-login-form");

  if(showLoginBtn && loginForm){
    showLoginBtn.addEventListener("click", () => {
      loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
    });

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginName = document.getElementById("login-username").value.trim();
      const loginPass = document.getElementById("login-password").value;

      if (!loginName || !loginPass) return showMessage("Заповніть всі поля");
      
      try {
        const res = await fetch("/users/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ username: loginName, password: loginPass })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          showMessage(data.error || "Невірний логін або пароль");
          return;
        }
        
        currentUser = data;
        localStorage.setItem("currentUserId", currentUser.id);
        updateProfileUI();
        loginForm.style.display = "none";
        showMessage(`Ви увійшли як ${currentUser.username || currentUser.email}`);
        clearProfileMessage();
      } catch (err) {
        console.error(err);
        showMessage("Помилка при вході");
      }
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  const logoutModal = document.getElementById("logout-modal");
  const logoutConfirm = document.getElementById("logout-confirm");
  const logoutSwitch = document.getElementById("logout-switch");
  const logoutCancel = document.getElementById("logout-cancel");
  const switchUserList = document.getElementById("switch-user-list");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (!allUsersCache.length) {
        showMessage("Немає користувачів. Створіть акаунт.");
        return;
      }
      logoutModal.style.display = "flex";
    });
  }

  logoutCancel.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  logoutConfirm.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("currentUserId");
    updateProfileUI();
    showMessage("Ви вийшли з акаунту");
    logoutModal.style.display = "none";
  });

  logoutSwitch.addEventListener("click", () => {
    switchUserList.style.display = "block";
    switchUserList.innerHTML = allUsersCache.map((u, i) => 
      `<button class="btn switch-user-btn" data-index="${i}">${u.username || u.email}</button>`
    ).join("");
  });

  switchUserList.addEventListener("click", (e) => {
    if (e.target.classList.contains("switch-user-btn")) {
      const idx = parseInt(e.target.dataset.index);
      currentUser = allUsersCache[idx];
      updateProfileUI();
      showMessage(`Ви увійшли як ${currentUser.username || currentUser.email}`);
      logoutModal.style.display = "none";
      switchUserList.style.display = "none";
    }
  });

  const goProfileBtn = document.getElementById("go-profile");
  if (goProfileBtn) {
    goProfileBtn.addEventListener("click", async () => {
      await ensureUsersLoaded();

      if (!currentUser) {
        showProfileMessage("У вас ще немає акаунту. Створіть його нижче або увійдіть.");
      } else {
        clearProfileMessage();
      }

      activateTab("profile");
    });
  }

  // artists
  const artistForm = document.getElementById("artist-form");

  if (artistForm) {
    artistForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("artist-name").value.trim();
      const bio = document.getElementById("artist-bio").value.trim();
      const fileInput = document.getElementById("artist-image");
      const file = fileInput.files[0];
      
      if (!name) {
        showMessage("Введіть ім'я виконавця");
        return;
      }
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (file) formData.append("image", file);
      
      try {
        const res = await fetch("/artists", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (!res.ok) {
          showMessage(data.error || "Помилка при додаванні виконавця");
          return;
        }

        showMessage(`Виконавець "${name}" доданий!`);
        artistForm.reset();

      } catch (err) {
        console.error(err);
        showMessage("Помилка при додаванні виконавця");
      }
    });
  }

  function setupArtistSelect() {
    const artistSelect = document.getElementById("album-artist");

    artistSelect.innerHTML = '<option value="">Виберіть виконавця</option>';

    artistSelect.addEventListener("focus", async () => {
      if (artistSelect.dataset.loaded === "true") return;

      try {
        const res = await fetch("/artists");
        if (!res.ok) throw new Error("Не вдалося завантажити виконавців");
        const artists = await res.json();

        artists.forEach(artist => {
          const option = document.createElement("option");
          option.value = artist.id;
          option.textContent = artist.name;
          artistSelect.appendChild(option);
        });

        artistSelect.dataset.loaded = "true";
      } catch (err) {
        console.error(err);
      }
    });
  }

  // albums
  const albumForm = document.getElementById("album-form");
  if (albumForm) {
    albumForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const title = document.getElementById("album-title").value.trim();
      const year = document.getElementById("album-year").value.trim();
      const artistId = document.getElementById("album-artist").value;
      const imageFile = document.getElementById("album-image").files[0];
      
      if (!title || !year || !artistId) {
        return showMessage("Заповніть всі поля альбому");
      }
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("year", year);
      formData.append("artist_id", artistId);
      if (imageFile) formData.append("image", imageFile);
      
      try {
        const res = await fetch("/albums", { method: "POST", body: formData });
        const data = await res.json();
        
        if (!res.ok) {
          return showMessage(data.error || "Помилка при додаванні альбому");
        }
        
        showMessage(`Альбом "${title}" додано`);
        albumForm.reset();
        await loadAlbums();
      } catch (err) {
        console.error(err);
        showMessage("Помилка при додаванні альбому");
      }
    });
  }

  async function loadAlbums() {
    try {
      const res = await fetch("/albums");
      if (!res.ok) throw new Error("Не вдалося завантажити альбоми");
      const albums = await res.json();

      const select = document.getElementById("track-album");
      select.innerHTML = '<option value="">Оберіть альбом</option>';
      albums.forEach(album => {
        const option = document.createElement("option");
        option.value = album.id;
        option.textContent = `${album.title} (${album.release_year || "Рік не вказано"})`;
        select.appendChild(option);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // ganres
  const genreForm = document.getElementById("genre-form");

  if (genreForm) {
    genreForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("genre-name").value.trim();
      const description = document.getElementById("genre-description").value.trim();
      if (!name) return showMessage("Введіть назву жанру");

      try {
        const res = await fetch("/genres", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Не вдалося додати жанр");

        showMessage(`Жанр "${data.name}" додано`);
        genreForm.reset();

        await loadGenres();
      } catch (err) {
        console.error(err);
        showMessage("Помилка додавання жанру");
      }
    });
  }

  async function loadGenres() {
    try {
      const res = await fetch("/genres");
      if (!res.ok) throw new Error("Не вдалося завантажити жанри");
      const genres = await res.json();
      allGenres = genres;

      const select = document.getElementById("track-genre");
      select.innerHTML = '<option value="">Оберіть жанр</option>';
      genres.forEach(g => {
        const option = document.createElement("option");
        option.value = g.id;
        option.textContent = g.name;
        select.appendChild(option);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // tracks
  const trackForm = document.getElementById("track-form");
  const addTrackModal = document.getElementById("add-track-modal");
  const addToPlaylistSelect = document.getElementById("add-to-playlist-select");

  let tempAddToPlaylistId = null;

  trackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return showMessage("Спершу увійдіть");

    const title = document.getElementById("track-title").value.trim();
    const genreId = document.getElementById("track-genre").value;
    const artistId = document.getElementById("track-artist").value;
    const albumId = document.getElementById("track-album").value;
    const file = document.getElementById("track-file").files[0];

    if (!title || !genreId || !artistId || !file) {
      return showMessage("Заповніть всі обов'язкові поля");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre_id", genreId);
      formData.append("artist_id", artistId);
      if (albumId) formData.append("album_id", albumId);
      formData.append("track", file);
      formData.append("user_id", currentUser.id);

      const res = await fetch("/tracks", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Не вдалося додати трек");

      const newTrack = await res.json();
      showMessage(`Трек "${title}" додано`);

      if (tempAddToPlaylistId) {
        await fetch(`/playlist_tracks/${tempAddToPlaylistId}/tracks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ track_id: newTrack.id })
        });
        showMessage("Трек додано до плейліста");
        tempAddToPlaylistId = null;
      } else {
        addTrackModal.style.display = "block";
        const playlistsRes = await fetch(`/playlists/user/${currentUser.id}`);
        const playlists = await playlistsRes.json();
        addToPlaylistSelect.innerHTML = '<option value="">Оберіть плейліст</option>';
        playlists.forEach(pl => {
          const opt = document.createElement("option");
          opt.value = pl.id;
          opt.textContent = pl.name;
          addToPlaylistSelect.appendChild(opt);
        });
        addTrackModal.dataset.trackId = newTrack.id;
      }

      trackForm.reset();
    } catch (err) {
      console.error(err);
      showMessage("Помилка додавання треку");
    }
  });

  document.getElementById("add-to-favorites-btn").addEventListener("click", async () => {
    const trackId = addTrackModal.dataset.trackId;
    try {
      const res = await fetch("/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, track_id: trackId })
      });
      if (!res.ok) throw new Error("Не вдалося додати улюблене");

      addTrackModal.style.display = "none";
      showMessage("Трек додано до улюбленого");
      
      await loadUserFavorites();
    } catch (err) {
      console.error(err);
      showMessage("Помилка додавання до улюбленого");
    }
  });

  document.getElementById("add-to-playlist-btn").addEventListener("click", async () => {
    const trackId = addTrackModal.dataset.trackId;
    const playlistId = addToPlaylistSelect.value;
    if (!playlistId) return showMessage("Оберіть плейліст");

    await fetch(`/playlist_tracks/${playlistId}/tracks`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ track_id: trackId })
    });
    addTrackModal.style.display = "none";
    showMessage("Трек додано до плейліста");
  });

  document.getElementById("add-modal-close-btn").addEventListener("click", () => {
    addTrackModal.style.display = "none";
  });

  async function loadTrackArtists() {
    const select = document.getElementById("track-artist");
    select.innerHTML = '<option value="">Оберіть виконавця</option>';
    try {
      const res = await fetch("/artists");
      if (!res.ok) throw new Error("Не вдалося завантажити виконавців");
      const artists = await res.json();
      artists.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = a.name;
        select.appendChild(opt);
      });
    } catch(err) {
      console.error(err);
    }
  }

  async function loadTrackGenres() {
    const select = document.getElementById("track-genre");
    select.innerHTML = '<option value="">Оберіть жанр</option>';
    try {
      const res = await fetch("/genres");
      if (!res.ok) throw new Error("Не вдалося завантажити жанри");
      const genres = await res.json();
      genres.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = g.name;
        select.appendChild(opt);
      });
    } catch(err) {
      console.error(err);
    }
  }

  // playlists
  const playlistForm = document.getElementById("playlist-form");
  const playlistName = document.getElementById("playlist-name");
  const playlistDescription = document.getElementById("playlist-description");
  const playlistList = document.getElementById("playlist-list");
  const userPlaylistList = document.getElementById("user-playlist-list");
  const deleteSelectedPlaylistsBtn = document.getElementById("delete-selected-playlists");

  playlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return showMessage("Створіть спершу акаунт");

    const name = document.getElementById("playlist-name").value.trim();
    const description = document.getElementById("playlist-description").value.trim();
    const imageFile = document.getElementById("playlist-image")?.files?.[0];

    if (!name) return showMessage("Введіть назву плейліста");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("user_id", currentUser.id);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/playlists", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Плейліст не створився");

      const data = await res.json();
      addPlaylistToProfile(data);

      document.getElementById("playlist-name").value = "";
      document.getElementById("playlist-description").value = "";
      if (document.getElementById("playlist-image")) {
        document.getElementById("playlist-image").value = "";
      }

      showMessage("Плейліст додано");
      activateTab("profile");

    } catch (err) {
      console.error(err);
      showMessage("Помилка створення плейліста");
    }
  });

  function addPlaylistToProfile(pl, number) {
    const li = document.createElement("li");
    li.className = "playlist-item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.playlistId = pl.id;
    cb.addEventListener("change", () => {
      const anyChecked = !!userPlaylistList.querySelectorAll("input[type=checkbox]:checked").length;
      deleteSelectedPlaylistsBtn.style.display = anyChecked ? "inline-block" : "none";
    });

    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${pl.name} — ${pl.description || "Опис відсутній"}`;
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      openPlaylistPage(pl.id, pl.name, pl.cover_url);
    });

    li.appendChild(cb);
    li.appendChild(a);
    userPlaylistList.appendChild(li);

    deleteSelectedPlaylistsBtn.style.display = "none";
  }

  function renderTracks(tracks) {
    const playlistBody = document.getElementById("playlist-body");
    playlistBody.innerHTML = "";

    if (!tracks || tracks.length === 0) {
      playlistBody.innerHTML = "<p>У плейлісті немає треків</p>";
      return;
    }

    tracks.forEach(track => {
      const div = document.createElement("div");
      div.className = "audio-player";

      const title = document.createElement("p");
      title.textContent = `${track.title} — ${track.artist_name || "Невідомий виконавець"}`;
      title.style.flex = "1";
      
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = track.file_path;
      audio.classList.add("styled-audio");

      div.appendChild(title);
      div.appendChild(audio);
      playlistBody.appendChild(div);
    });
  }

  let currentPlaylistId = null;

  async function openPlaylistPage(playlistId, playlistName = null, coverUrl = null) {
    currentPlaylistId = playlistId;
    const profileSection = document.getElementById("profile");
    const playlistPage = document.getElementById("playlist-page");
    const playlistTitle = document.getElementById("playlist-title");
    const playlistCover = document.getElementById("playlist-cover");
    const playlistBody = document.getElementById("playlist-body");

    profileSection.style.display = "none";
    playlistPage.style.display = "block";
    
    playlistTitle.textContent = playlistName || "Завантаження...";
    playlistCover.src = coverUrl;
    playlistBody.innerHTML = "Завантаження треків...";

    try {
      const res = await fetch(`/playlists/${playlistId}`);
      if (!res.ok) throw new Error("Не вдалося завантажити плейліст");
      const data = await res.json();
      
      if (!playlistName) playlistTitle.textContent = data.name || "Без назви";
      if (!coverUrl) playlistCover.src = data.cover_url;

      renderTracks(data.tracks);

    } catch (err) {
      console.error(err);
      playlistBody.innerHTML = "<p>Помилка завантаження треків</p>";
      playlistCover.src = "/uploads/default_cover.png";
      playlistTitle.textContent = "Плейліст недоступний";
    }
  }

  document.getElementById("add-track-btn").addEventListener("click", () => {
    localStorage.setItem("addToPlaylistId", currentPlaylistId);
    localStorage.setItem("currentUserBackup", JSON.stringify(currentUser));
    document.getElementById("playlist-page").style.display = "none";
    activateTab("tracks");
  });
  
  document.getElementById("close-playlist-btn").addEventListener("click", async () => {
    document.getElementById("playlist-page").style.display = "none";
    activateTab("profile");
  });

  function closePlaylistPage() {
    const playlistPage = document.getElementById("playlist-page");
    const profileSection = document.getElementById("profile");

    if (playlistPage && playlistPage.style.display === "block") {
      playlistPage.style.display = "none";
      profileSection.style.display = "";
      currentPlaylistId = null;
    }
  }
  
  deleteSelectedPlaylistsBtn.addEventListener("click", async () => {
    const selected = Array.from(userPlaylistList.querySelectorAll("input[type=checkbox]:checked"));
    if(!selected.length) return;

    if(!confirm("Видалити вибрані плейлісти?")) return;

    try {
      for(const cb of selected){
        const id = cb.dataset.playlistId;
        const res = await fetch(`/playlists/${id}`, { method: "DELETE" });
        if(!res.ok) throw new Error("Не вдалося видалити плейліст");
        cb.parentElement.remove();
      }
      deleteSelectedPlaylistsBtn.style.display = "none";
      showMessage("Видалено вибрані плейлісти");
      
      if(!userPlaylistList.querySelector("li")) {
        const li = document.createElement("li");
        const createBtn = document.createElement("button");
        createBtn.textContent = "Створити";
        createBtn.className = "btn";
        createBtn.addEventListener("click", () => activateTab("playlists"));
        li.appendChild(createBtn);
        userPlaylistList.appendChild(li);
      }
    
    } catch(err){
      console.error(err);
      showMessage("Помилка видалення плейлістів");
    }
  });

  async function loadUserPlaylists() {
    userPlaylistList.innerHTML = "";
    deleteSelectedPlaylistsBtn.style.display = "none";
    if (!currentUser) return;

    try {
      const res = await fetch(`/playlists/user/${currentUser.id}`);
      if (!res.ok) throw new Error("Не вдалося завантажити плейлісти");
      const data = await res.json();
      
      if (!data.length) {
        const li = document.createElement("li");
        const createBtn = document.createElement("button");
        createBtn.textContent = "Створити";
        createBtn.className = "btn";
        createBtn.addEventListener("click", () => activateTab("playlists"));
        li.appendChild(createBtn);
        userPlaylistList.appendChild(li);
        return;
      }

      data.forEach(pl => addPlaylistToProfile(pl));

    } catch (err) {
      console.error(err);
      userPlaylistList.innerHTML = "<li>Не вдалося завантажити плейлісти</li>";
    }
  }

  // favorites
  async function loadUserFavorites() {
    const favList = document.getElementById("favorite-list");
    favList.innerHTML = "";
    if (!currentUser) {
      favList.innerHTML = "<p>Увійдіть, щоб переглянути улюблені треки</p>";
      return;
    }

    try {
      const res = await fetch(`/favorites/user/${currentUser.id}`);
      if (!res.ok) throw new Error("Не вдалося завантажити улюблене");
      const favorites = await res.json();

      if (!favorites.length) {
        favList.innerHTML = "<p>У вас ще немає улюблених треків</p>";
        return;
      }

      favorites.forEach(track => {
        const div = document.createElement("div");
        div.className = "audio-player";

        const title = document.createElement("p");
        title.textContent = `${track.title} — ${track.artist_name || "Невідомий виконавець"}`;
        title.style.flex = "1";

        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = track.file_path;
        audio.classList.add("styled-audio");

        div.appendChild(title);
        div.appendChild(audio);
        favList.appendChild(div);
      });
    } catch (err) {
      console.error(err);
      favList.innerHTML = "<p>Помилка завантаження</p>";
    }
  }
  
  async function initialLoad() {
    await loadUsers();
    setupArtistSelect();
  }
  
  initialLoad();
});