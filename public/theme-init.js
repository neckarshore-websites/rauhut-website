(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch {
    /* no-op: localStorage unavailable (e.g. private browsing, disabled) */
  }
})();
