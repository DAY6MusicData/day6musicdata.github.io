// site.js
// - /partials/header.html, /partials/footer.html을 fetch해서 삽입
// - data-active 값(home/make/chants/about)에 맞춰 탭 활성화

(async function () {
  const headerHost = document.getElementById("site-header");
  const footerHost = document.getElementById("site-footer");

  // GitHub Pages + 커스텀 도메인(day6.kr) 기준: 절대경로 사용
  const headerUrl = "/partials/header.html";
  const footerUrl = "/partials/footer.html";

  async function inject(host, url) {
    if (!host) return;
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(url + " load failed: " + res.status);
    host.innerHTML = await res.text();
  }

  try {
    await inject(headerHost, headerUrl);
    await inject(footerHost, footerUrl);
  } catch (e) {
    // partial이 없거나 로컬(file://)에서 열었을 때도 최대한 깨지지 않게
    console.warn(e);
  }

  // active tab
  const active = headerHost?.getAttribute("data-active") || "";
  const tabs = document.querySelectorAll(".tab[data-nav]");
  tabs.forEach((t) => {
    const key = t.getAttribute("data-nav");
    const isActive = key === active;
    t.classList.toggle("is-active", isActive);
    if (isActive) t.setAttribute("aria-current", "page");
    else t.removeAttribute("aria-current");
  });
})();
