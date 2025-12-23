(() => {
  const root = document.querySelector(".pl");
  if (!root) return;

  const songsUrl = root.dataset.songsUrl;
  const coverBase = root.dataset.coverBase || ""; // 예: /assets/covers/

  const $field = root.querySelector(".pl-search__field");
  const $q = document.getElementById("plQ");
  const $dd = document.getElementById("plDd");
  const $results = document.getElementById("plResults");
  const $empty = document.getElementById("plEmpty");

  const $pickedCount = document.getElementById("plPickedCount");
  const $pickedList = document.getElementById("plPickedList");
  const $confirm = document.getElementById("plConfirm");
  const $searchIcon = root.querySelector(".pl-search__icon");

  if (!$q || !$dd || !$results || !$pickedList) return;

  // 실제 스크롤되는 컨테이너
  const $ddList = $dd.querySelector(".pl-dd__list") || $dd;

  let songs = [];
  let songsById = new Map();
  let sortable = null;

  // ✅ 중복 허용 + 순서 보존: (key, id)로 관리
  let pickedSeq = 0;
  /** @type {{key:string, id:number}[]} */
  let pickedItems = [];

  // ✅ 검색 결과 무한 로딩
  const PAGE_SIZE = 60;
  let activeList = [];
  let rendered = 0;

  // FontAwesome 아이콘 세팅(검색)
  if ($searchIcon) {
    $searchIcon.innerHTML = `<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>`;
  }

  // 확정 버튼 문구(HTML에서 안 바꿨으면 여기서라도)
  if ($confirm) {
    $confirm.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> 플레이리스트 생성';
  }

  const norm = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[·•\[\]().!?'":\-_/]/g, "");

  const fmtLen = (sec) => {
    const m = Math.floor((sec || 0) / 60);
    const s = (sec || 0) % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const fmtTotalTime = (totalSec) => {
    const totalMin = Math.floor((totalSec || 0) / 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return `${h}시간 ${String(m).padStart(2, "0")}분`;
    return `${String(totalMin).padStart(2, "0")}분`;
  };

  const coverUrlOf = (song) => {
    // albumKey 기준 jpg
    const key = (song.albumKey || "").trim();
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

  // ---------------------------
  // Toast (담기/삭제)
  // ---------------------------
  let $toast = null;
  let toastTimer = null;

  function ensureToast() {
    if ($toast) return;
    $toast = document.createElement("div");
    $toast.className = "pl-toast";
    document.body.appendChild($toast);
  }

  function toast(type, msg) {
    ensureToast();
    $toast.classList.remove("is-show", "is-green", "is-red");
    if (type === "green") $toast.classList.add("is-green");
    if (type === "red") $toast.classList.add("is-red");
    $toast.textContent = msg;

    // reflow for animation
    void $toast.offsetWidth;
    $toast.classList.add("is-show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      $toast.classList.remove("is-show");
    }, 1200);
  }

  // ---------------------------
  // Duplicate confirm modal
  // ---------------------------
  let $modal = null;

  function ensureModal() {
    if ($modal) return;

    $modal = document.createElement("div");
    $modal.className = "pl-modal";
    $modal.innerHTML = `
      <div class="pl-modal__backdrop"></div>
      <div class="pl-modal__card" role="dialog" aria-modal="true">
        <div class="pl-modal__song">
          <img class="pl-modal__cover" alt="" />
          <div class="pl-modal__meta">
            <div class="pl-modal__title"></div>
            <div class="pl-modal__album"></div>
          </div>
        </div>

        <div class="pl-modal__msg">
          이 곡은 이미 들어가있는 곡이에요.
        </div>

        <div class="pl-modal__actions">
          <button type="button" class="pl-modal__btn pl-modal__btn--ghost" data-act="cancel">안 담기</button>
          <button type="button" class="pl-modal__btn pl-modal__btn--ok" data-act="ok">그래도 담기</button>
        </div>
      </div>
    `;
    document.body.appendChild($modal);
  }

  function showDuplicateConfirm(song) {
    ensureModal();

    const $cover = $modal.querySelector(".pl-modal__cover");
    const $title = $modal.querySelector(".pl-modal__title");
    const $album = $modal.querySelector(".pl-modal__album");

    $cover.src = coverUrlOf(song);
    $cover.onerror = () => { $cover.style.display = "none"; };
    $cover.style.display = "";

    $title.textContent = song.title || "";
    $album.textContent = song.album || "";

    return new Promise((resolve) => {
      const onClick = (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const act = btn.getAttribute("data-act");
        hide();
        resolve(act === "ok");
      };

      const onKey = (e) => {
        if (e.key === "Escape") {
          hide();
          resolve(false);
        }
      };

      function hide() {
        $modal.classList.remove("is-open");
        document.removeEventListener("keydown", onKey);
        $modal.removeEventListener("click", onClick);
      }

      $modal.addEventListener("click", onClick);
      document.addEventListener("keydown", onKey);

      $modal.classList.add("is-open");
      // 초점은 “그래도 담기”로
      const okBtn = $modal.querySelector('.pl-modal__btn--ok');
      if (okBtn) setTimeout(() => okBtn.focus(), 0);
    });
  }

  async function loadSongs() {
    const res = await fetch(songsUrl, { cache: "no-store" });
    const data = await res.json();

    songs = (data.songs || []).slice().sort((a, b) => a.id - b.id);

    songs.forEach(s => {
      s.__t = norm(s.title);
      s.__a = norm(s.album);
    });

    songsById = new Map(songs.map(s => [Number(s.id), s]));
  }

  function filterSongs(query) {
    const key = norm(query);
    if (!key) return songs;
    return songs.filter(s => s.__t.includes(key) || s.__a.includes(key));
  }

  function updatePickedCount() {
    const totalSec = pickedItems.reduce((acc, it) => {
      const s = songsById.get(it.id);
      return acc + (s?.len || 0);
    }, 0);

    const n = pickedItems.length;
    $pickedCount.textContent = `${n}곡(${fmtTotalTime(totalSec)})`;
  }

  // ---------------------------
  // Search rendering (infinite)
  // ---------------------------
  function rowHtml(s) {
    return `
      <button class="pl-row" type="button" data-id="${s.id}">
        <img class="pl-row__cover" src="${coverUrlOf(s)}" alt="" loading="lazy"
             onerror="this.style.display='none'; this.parentElement.classList.add('no-cover');" />
        <div class="pl-row__text">
          <div class="pl-row__title">${escapeHtml(s.title)}</div>
          <div class="pl-row__album">${escapeHtml(s.album)}</div>
        </div>
        <div class="pl-row__len">${fmtLen(s.len)}</div>
      </button>
    `;
  }

  function renderResults(list, reset = true) {
    if (reset) {
      activeList = list || [];
      rendered = 0;
      $results.innerHTML = "";
      if ($ddList) $ddList.scrollTop = 0;
    }

    // empty state
    $empty.hidden = activeList.length !== 0;

    appendMore();
  }

  function appendMore() {
    if (rendered >= activeList.length) return;
    const next = activeList.slice(rendered, rendered + PAGE_SIZE);
    rendered += next.length;
    $results.insertAdjacentHTML("beforeend", next.map(rowHtml).join(""));
  }

  // ---------------------------
  // Picked rows (duplicate allowed)
  // ---------------------------
  function makePickedRow(item, song) {
    return `
      <div class="pl-pickedRow" data-key="${item.key}" data-id="${song.id}">
        <img class="pl-pickedRow__cover" src="${coverUrlOf(song)}" alt="" loading="lazy"
             onerror="this.style.display='none'; this.parentElement.classList.add('no-cover');" />
        <div class="pl-pickedRow__text">
          <div class="pl-pickedRow__title">${escapeHtml(song.title)}</div>
          <div class="pl-pickedRow__album">${escapeHtml(song.album)}</div>
        </div>
        <div class="pl-pickedRow__len">${fmtLen(song.len)}</div>

        <button class="pl-pickedRow__handle" type="button" aria-label="순서 변경">
          <i class="fa-solid fa-grip-lines" aria-hidden="true"></i>
        </button>

        <button class="pl-pickedRow__remove" type="button" aria-label="삭제">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  function isDuplicateId(id) {
    return pickedItems.some(it => it.id === id);
  }

  async function addPicked(id) {
    const song = songsById.get(id);
    if (!song) return;

    // ✅ 중복이면 큰 팝업
    if (isDuplicateId(id)) {
      const ok = await showDuplicateConfirm(song);
      if (!ok) return;
    }

    const item = { key: `p${pickedSeq++}`, id };
    pickedItems.push(item);

    $pickedList.insertAdjacentHTML("beforeend", makePickedRow(item, song));
    updatePickedCount();
    initSortable(); // 새 항목 추가 후 보정

    toast("green", `"${song.title}" 곡을 담았어요`);
  }

  function removePickedByKey(key) {
    const idx = pickedItems.findIndex(it => it.key === key);
    if (idx < 0) return;

    const removed = pickedItems[idx];
    pickedItems.splice(idx, 1);

    const row = $pickedList.querySelector(`.pl-pickedRow[data-key="${key}"]`);
    if (row) row.remove();

    updatePickedCount();

    const song = songsById.get(removed.id);
    toast("red", `"${song?.title || "해당 곡"}" 곡을 삭제했어요`);
  }

  // 드래그 후 실제 순서 동기화(DOM 기준)
  function syncOrderFromDOM() {
    const keys = [...$pickedList.querySelectorAll(".pl-pickedRow")].map(el => String(el.dataset.key || ""));
    const byKey = new Map(pickedItems.map(it => [it.key, it]));
    pickedItems = keys.map(k => byKey.get(k)).filter(Boolean);
    updatePickedCount();
  }

  // Sortable 초기화
  function initSortable() {
    if (sortable) sortable.destroy();

    const isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    const isiOS = /iP(ad|hone|od)/.test(navigator.platform)
      || (navigator.userAgent.includes("Mac") && isTouch);

    sortable = new Sortable($pickedList, {
      animation: 180,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      handle: ".pl-pickedRow__handle",
      draggable: ".pl-pickedRow",
      ghostClass: "is-ghost",
      chosenClass: "is-chosen",
      dragClass: "is-drag",

      forceFallback: isiOS,
      fallbackOnBody: true,
      fallbackTolerance: 0,

      onEnd: () => syncOrderFromDOM(),
    });
  }

  function bind() {
    const rerender = () => {
      open();
      renderResults(filterSongs($q.value), true);
    };

    $field.addEventListener("click", () => {
      $q.focus();
      rerender();
    });

    $q.addEventListener("focus", rerender);
    $q.addEventListener("input", rerender);

    // ✅ 드롭다운 무한 스크롤
    $ddList.addEventListener("scroll", () => {
      if (rendered >= activeList.length) return;
      const nearBottom = $ddList.scrollTop + $ddList.clientHeight >= $ddList.scrollHeight - 160;
      if (nearBottom) appendMore();
    });

    $results.addEventListener("click", (e) => {
      const btn = e.target.closest(".pl-row");
      if (!btn) return;
      addPicked(Number(btn.dataset.id));
      $q.focus();
    });

    $pickedList.addEventListener("click", (e) => {
      const rm = e.target.closest(".pl-pickedRow__remove");
      if (!rm) return;
      const row = e.target.closest(".pl-pickedRow");
      if (!row) return;
      removePickedByKey(String(row.dataset.key || ""));
    });

    document.addEventListener("click", (e) => {
      const inside = e.target.closest(".pl-search") || e.target.closest(".pl-dd") || e.target.closest(".pl-modal__card");
      if (!inside) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    $confirm.addEventListener("click", () => {
      // TODO: 여기서 pickedItems.map(x=>x.id)로 토큰 생성/공유 링크 만들기
      const ids = pickedItems.map(x => x.id);
      alert(`담은 곡: ${ids.length}곡`);
      console.log("pickedIds:", ids);
    });
  }

  (async function init() {
    await loadSongs();
    bind();
    renderResults(songs, true);
    updatePickedCount();
    initSortable();
  })();
})();
