// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

console.log('begin');
try {
  !(function () {
    const t = window.resourceLoadError || (() => {}),
      e = 'data-sri-fallback',
      r = window.MutationObserver || window.WebKitMutationObserver;
    r &&
      new r(function (t) {
        t.forEach(function (t) {
          t.addedNodes.forEach(i);
        });
      }).observe(document, { childList: !0, subtree: !0 });
    const i = function (r) {
      const i = (r.tagName || '').toLowerCase();
      ('link' !== i && 'script' !== i) ||
        !r.integrity ||
        r.getAttribute('data-sri-fallback-retry') ||
        (r.onerror = function (o) {
          if (r.getAttribute(e)) {
            const o = document.createElement(i),
              n = r.parentNode;
            o.setAttribute('data-sri-fallback-retry', '1'),
              o.setAttribute('integrity', r.integrity),
              r.src && o.setAttribute('src', r.getAttribute(e)),
              r.href && o.setAttribute('href', r.getAttribute(e)),
              (o.onerror = function (e) {
                t(e, !0);
              }),
              n.appendChild(o),
              r.remove();
          } else t(o, !1);
        });
    };
  })();
} catch (t) {
  console.error(t);
}
