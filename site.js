// EN/JA and light/dark switching, shared by all pages.
// Loaded in <head> so the saved choice is applied before the page is drawn (no flash).
(function () {
  var root = document.documentElement;

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { }
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    // "︎" = show as a plain text symbol (otherwise phones turn ☀ into a color emoji)
    if (btn) btn.textContent = theme === 'dark' ? '☀︎' : '☾︎';
  }
  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
  }

  // First visit: follow the OS dark-mode setting. Language defaults to English.
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(load('theme') || (prefersDark ? 'dark' : 'light'));
  setLang(load('lang') || 'en');

  document.addEventListener('DOMContentLoaded', function () {
    setTheme(root.getAttribute('data-theme'));

    document.getElementById('theme-toggle').addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      save('theme', next);
    });

    document.getElementById('lang-toggle').addEventListener('click', function () {
      var next = root.getAttribute('data-lang') === 'ja' ? 'en' : 'ja';
      setLang(next);
      save('lang', next);
    });

    // Email icon: build the mailto link here so the address isn't plain text in the HTML.
    document.querySelectorAll('.js-email').forEach(function (a) {
      a.href = 'mailto:' + a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    });

    // Footer "Last Updated": the date this page was last modified (from the server), e.g. "Nov 25, 2026".
    var updated = new Date(document.lastModified);
    document.querySelectorAll('.last-updated').forEach(function (el) {
      el.textContent = updated.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    });

    // TL;DR buttons: open/close the .tldr box in the same paper entry.
    document.querySelectorAll('.tldr-toggle').forEach(function (btn) {
      var box = btn.closest('td').querySelector('.tldr');
      btn.addEventListener('click', function () {
        box.hidden = !box.hidden;
        btn.setAttribute('aria-expanded', String(!box.hidden));
      });
    });
  });
})();
