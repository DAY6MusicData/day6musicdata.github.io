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

  let songs = [];
  let sortable = null;

  // 순서 보존용
  const pickedSet = new Set();
  let pickedOrder = [];

  // FontAwesome 아이콘 세팅(검색)
  if ($searchIcon) {
    $searchIcon.innerHTML = `<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>`;
  }

  // 확정 버튼 문구 바꾸기(HTML에서 안 바꿨으면 여기서라도)
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

  async function loadSongs() {
    const res = await fetch(songsUrl, { cache: "no-store" });
    const data = await res.json();

    songs = (data.songs || []).slice().sort((a, b) => a.id - b.id);

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

  function fmtTotalTime(totalSec){
    const totalMin = Math.floor(totalSec / 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
  
    if (h > 0) return `${h}시간 ${String(m).padStart(2,"0")}분`;
    return `${String(m).padStart(2,"0")}분`;
  }
  
  function updatePickedCount(){
    const totalSec = pickedOrder.reduce((acc, id) => {
      const s = songs.find(x => x.id === id);
      return acc + (s?.len || 0);
    }, 0);
  
    const n = pickedOrder.length;
    $pickedCount.textContent = `${n}곡(${fmtTotalTime(totalSec)})`;
  }
  

  // 검색 결과 렌더(핸들/삭제 없음)
  function renderResults(list) {
    const view = list.slice(0, 120);
    $empty.hidden = view.length !== 0;

    $results.innerHTML = view.map(s => `
      <button class="pl-row" type="button" data-id="${s.id}">
        <img class="pl-row__cover" src="${coverUrlOf(s)}" alt="" loading="lazy"
             onerror="this.style.display='none'; this.parentElement.classList.add('no-cover');" />
        <div class="pl-row__text">
          <div class="pl-row__title">${escapeHtml(s.title)}</div>
          <div class="pl-row__album">${escapeHtml(s.album)}</div>
        </div>
        <div class="pl-row__len">${fmtLen(s.len)}</div>
      </button>
    `).join("");
  }

  function makePickedRow(song) {
    return `
      <div class="pl-pickedRow" data-id="${song.id}">
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

  // 드래그 후 실제 순서 동기화(DOM 기준)
  function syncOrderFromDOM() {
    pickedOrder = [...$pickedList.querySelectorAll(".pl-pickedRow")]
      .map(el => Number(el.dataset.id));
    updatePickedCount();
  }

  // Sortable 초기화
  function initSortable() {
    if (sortable) sortable.destroy();

    // iOS/터치 환경은 fallback 강제(사파리 HTML5 DnD가 개같음 ㅠ)
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

      // ✅ 핵심: 드래그 중 “손/커서 따라오기”는 CSS에서 transition 끈 게 메인 해결책.
      // + iOS에서만 fallback 강제
      forceFallback: isiOS,
      fallbackOnBody: true,
      fallbackTolerance: 0,

      // 드래그 시작/끝에 클래스 확실히(혹시 꼬이면 정리)
      onStart: () => {},
      onEnd: () => syncOrderFromDOM(),
    });
  }

  function addPicked(id) {
    if (pickedSet.has(id)) return;

    const song = songs.find(s => s.id === id);
    if (!song) return;

    pickedSet.add(id);
    pickedOrder.push(id);

    $pickedList.insertAdjacentHTML("beforeend", makePickedRow(song));
    updatePickedCount();
    initSortable(); // 새 항목 추가 후 보정
  }

  function removePicked(id) {
    if (!pickedSet.has(id)) return;

    pickedSet.delete(id);
    pickedOrder = pickedOrder.filter(x => x !== id);

    const row = $pickedList.querySelector(`.pl-pickedRow[data-id="${id}"]`);
    if (row) row.remove();

    updatePickedCount();
  }

  function bind() {
    $field.addEventListener("click", () => {
      $q.focus();
      open();
      renderResults(filterSongs($q.value));
    });

    $q.addEventListener("focus", () => {
      open();
      renderResults(filterSongs($q.value));
    });

    $q.addEventListener("input", () => {
      open();
      renderResults(filterSongs($q.value));
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
      removePicked(Number(row.dataset.id));
    });

    document.addEventListener("click", (e) => {
      const inside = e.target.closest(".pl-search") || e.target.closest(".pl-dd");
      if (!inside) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    $confirm.addEventListener("click", () => {
      // TODO: 여기서 pickedOrder로 토큰 생성/공유 링크 만들기
      alert(`담은 곡: ${pickedOrder.length}곡`);
      console.log("pickedOrder:", pickedOrder);
    });
  }

  (async function init() {
    await loadSongs();
    bind();
    renderResults(songs);
    updatePickedCount();
    initSortable();
  })();
})();
