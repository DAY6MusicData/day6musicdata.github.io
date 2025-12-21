(function () {
  const cards = document.querySelectorAll(".card[data-bg]");
  cards.forEach((card) => {
    const bg = card.getAttribute("data-bg");
    if (!bg) return;
    card.style.backgroundImage =
      'linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.30)), url("' + bg + '")';
  });
})();
