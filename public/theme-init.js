(function () {
  // Runs before first paint (anti-flash). Order of precedence:
  //   1. the visitor's own choice via the switch (localStorage "theme"),
  //   2. otherwise the device setting (prefers-color-scheme),
  //   3. otherwise dark, the site's default.
  // Privacy: the device setting is read in the browser only. Nothing is
  // sent anywhere, and nothing is stored unless the visitor uses the switch.
  var root = document.documentElement;
  var mq = null;
  try {
    mq = window.matchMedia("(prefers-color-scheme: light)");
  } catch (e) {
    /* matchMedia unavailable: dark default applies */
  }
  function stored() {
    try {
      var t = localStorage.getItem("theme");
      return t === "dark" || t === "light" ? t : null;
    } catch (e) {
      return null; /* storage unavailable (private mode, disabled) */
    }
  }
  function apply() {
    root.setAttribute("data-theme", stored() || (mq && mq.matches ? "light" : "dark"));
  }
  apply();
  // Follow a device switch while the page is open, unless the visitor chose.
  if (mq) {
    var onChange = function () {
      if (!stored()) apply();
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
