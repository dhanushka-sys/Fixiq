'use client';

import React from 'react';

/**
 * HydrationFix
 *
 * Prevents Next.js / React 19 hydration mismatch errors caused by third-party
 * browser extensions (e.g., ColorZilla, Bitdefender, VPN plugins, password managers)
 * that inject attributes like `bis_skin_checked="1"` or `bis_register` into HTML
 * elements before or during React hydration.
 *
 * Runs synchronously in the document <head> and observes DOM mutations.
 */
export function HydrationFix() {
  return (
    <script
      id="fixiq-hydration-sanitizer"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var attrs = ['bis_skin_checked', 'bis_register', 'data-colorzilla', 'data-lastpass-root'];
            function clean() {
              for (var i = 0; i < attrs.length; i++) {
                var els = document.querySelectorAll('[' + attrs[i] + ']');
                for (var j = 0; j < els.length; j++) {
                  els[j].removeAttribute(attrs[i]);
                }
              }
            }
            if (typeof document !== 'undefined') {
              clean();
              if (window.MutationObserver) {
                var observer = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'attributes' && attrs.indexOf(m.attributeName) !== -1) {
                      m.target.removeAttribute(m.attributeName);
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true,
                  attributeFilter: attrs
                });
              }
            }
          })();
        `,
      }}
    />
  );
}
