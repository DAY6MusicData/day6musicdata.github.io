(() => {
  const root = document.querySelector(".pl");
  if (!root) return;

  const songsUrl = root.dataset.songsUrl;
  const coverBase = root.dataset.coverBase;

  const $field = root.querySelector(".pl-search__field");
  const $q = document.getElementById("plQ");
  const $dd = document.getElementById("plDd");
  const $results = document.getElementById("plResults");
  const $empty = document.getElementById("plEmpty");

  const $pickedCount = document.getElementById("plPickedCount");
  const $pickedList = document.getElementById("plPickedList");
  const $confirm = document.getElementById("plConfirm");

  let songs = [];
  const picked = new Set(); // id들

  const norm = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[·•\[\]().,!?'":\-_/]/g, "");

  const fmtLen = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const coverUrlOf = (song) => {
    const key = song.albumKey || "";
    // albumKey는 보통 안전하지만 혹시 몰라 인코딩
    return `${coverBase}${encodeURIComponent(key)}.jpg`;
  };

  const escapeHtml = (str) =>
    (str || "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m]));

  const open = () => { $dd.hidden = false; };
  const close = () => { $dd.hidden = true; };

  async function loadSongs() {
    const res = await fetch(songsUrl, { cache: "no-store" });
    const data = await res.json();
    songs = (data.songs || []).slice().sort((a, b) => a.id - b.id);

    // 검색 성능용 캐시(200 300곡이면 사실 필요 없지만 체감 깔끔)
    songs.forEach(s => {
      s.__t = norm(s.title);
      s.__a = norm(s.album);
    });
  }

  function filterSongs(query) {
    const key = norm(query);
    if (!key) return songs;
    return songs.filter(s => s.__t.includes(key) || s.__a.includes(key));
  }

  function renderResults(list) {
    const view = list.slice(0, 120); // 너무 길면 컷
    $empty.hidden = view.length !== 0;

    $results.innerHTML = view.map(s => {
      const img = coverUrlOf(s);
      return `
        <button class="pl-row" type="button" data-id="${s.id}">
          <img class="pl-row__cover" src="${img}" alt="" loading="lazy"
               onerror="this.style.display='none'; this.parentElement.classList.add('no-cover');" />
          <div class="pl-row__text">
            <div class="pl-row__title">${escapeHtml(s.title)}</div>
            <div class="pl-row__album">${escapeHtml(s.album)}</div>
          </div>
          <div class="pl-row__len">${fmtLen(s.len)}</div>
          <div class="pl-row__icon" aria-hidden="true">≡</div>
        </button>
      `;
    }).join("");
  }

  function renderPicked() {
    const arr = [...picked].sort((a, b) => a - b)
      .map(id => songs.find(s => s.id === id))
      .filter(Boolean);

    $pickedCount.textContent = `(총 ${arr.length}곡)`;

    $pickedList.innerHTML = arr.map(s => {
      const img = coverUrlOf(s);
      return `
        <div class="pl-pickedRow" data-id="${s.id}">
          <img class="pl-pickedRow__cover" src="${img}" alt="" loading="lazy"
               onerror="this.style.display='none'; this.parentElement.classList.add('no-cover');" />
          <div class="pl-pickedRow__text">
            <div class="pl-pickedRow__title">${escapeHtml(s.title)}</div>
            <div class="pl-pickedRow__album">${escapeHtml(s.album)}</div>
          </div>
          <div class="pl-pickedRow__len">${fmtLen(s.len)}</div>
          <button class="pl-pickedRow__remove" type="button" aria-label="삭제">×</button>
        </div>
      `;
    }).join("");
  }

  function bind() {
    // 클릭하면 포커스 + 열기
    $field.addEventListener("click", () => {
      $q.focus();
      open();
      renderResults(filterSongs($q.value));
    });

    // 키보드로도 열기
    $field.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        $q.focus();
        open();
        renderResults(filterSongs($q.value));
      }
    });

    $q.addEventListener("focus", () => {
      open();
      renderResults(filterSongs($q.value));
    });

    // 글자 단위 실시간 검색
    $q.addEventListener("input", () => {
      open();
      renderResults(filterSongs($q.value));
    });

    // 결과 클릭하면 담기
    $results.addEventListener("click", (e) => {
      const btn = e.target.closest(".pl-row");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      picked.add(id);
      renderPicked();
      $q.focus();
    });

    // 담은 곡 삭제
    $pickedList.addEventListener("click", (e) => {
      const rm = e.target.closest(".pl-pickedRow__remove");
      if (!rm) return;
      const row = e.target.closest(".pl-pickedRow");
      const id = Number(row.dataset.id);
      picked.delete(id);
      renderPicked();
    });

    // 바깥 클릭하면 닫기
    document.addEventListener("click", (e) => {
      const inside = e.target.closest(".pl-search") || e.target.closest(".pl-dd");
      if (!inside) close();
    });

    // ESC 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // 확정 버튼(일단 테스트용: 콘솔로 id 목록)
    $confirm.addEventListener("click", () => {
      const arr = [...picked].sort((a, b) => a - b);
      console.log("picked ids:", arr);
      alert(`담은 곡: ${arr.length}곡`);
    });
  }

  (async function init() {
    await loadSongs();
    bind();
    renderResults(songs);
    renderPicked();
  })();
})();
