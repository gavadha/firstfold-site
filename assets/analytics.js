// Navaark analytics — one file, included on every page.
// ---------------------------------------------------------------------------
// Fill in the two IDs below when the Google Analytics and Microsoft Clarity
// accounts are created. Leave them empty until then: with empty IDs nothing
// is loaded, nothing is sent, and events are only logged to the console.
// Do NOT invent IDs here — use the real ones from the GA4 and Clarity
// accounts when they exist.
// ---------------------------------------------------------------------------
var GA_MEASUREMENT_ID = "G-THFLDCGV8W";
var CLARITY_PROJECT_ID = "zeaj3wi6a3";

(function () {
  "use strict";

  function loadScript(src, onLoad) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    if (onLoad) { s.onload = onLoad; }
    document.head.appendChild(s);
  }

  // Google Analytics 4 — only when a real measurement ID is set.
  if (GA_MEASUREMENT_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID), function () {
      window.gtag("config", GA_MEASUREMENT_ID);
    });
  }

  // Microsoft Clarity — only when a real project ID is set.
  if (CLARITY_PROJECT_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
  }

  // Annual-cost bands for the ROI calculator. Bands only — never a raw
  // dollar figure, and never anything personal.
  function costBand(annualCost) {
    if (!(annualCost > 0)) { return "none"; }
    if (annualCost < 50000) { return "under_50k"; }
    if (annualCost < 250000) { return "50k_250k"; }
    if (annualCost < 1000000) { return "250k_1m"; }
    return "over_1m";
  }

  // Single event API for the whole site. Callers must only pass aggregate,
  // non-personal values (a score, a tier, a cost band). Never pass a name,
  // email, company, or anything typed into a form.
  function track(name, params) {
    var safe = params || {};
    // Dev visibility: always log, even when no analytics ID is set.
    if (window.console && console.log) {
      console.log("[analytics]", name, safe);
    }
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, safe);
      }
    } catch (e) { /* analytics must never break the page */ }
    try {
      if (typeof window.clarity === "function") {
        window.clarity("event", name);
      }
    } catch (e) { /* analytics must never break the page */ }
  }

  window.NavaarkAnalytics = {
    track: track,
    costBand: costBand,
    gaMeasurementId: GA_MEASUREMENT_ID,
    clarityProjectId: CLARITY_PROJECT_ID
  };

  function bindClicks() {
    // Book a call — every calendar link on the site.
    var bookLinks = document.querySelectorAll('a[href*="calendar.app.google"]');
    Array.prototype.forEach.call(bookLinks, function (a) {
      a.addEventListener("click", function () {
        track("book_a_call_click", {});
      });
    });

    // Live demo — every link out to the Vantage demo.
    var demoLinks = document.querySelectorAll('a[href*="gavadha.github.io/Navaark-vantage"]');
    Array.prototype.forEach.call(demoLinks, function (a) {
      a.addEventListener("click", function () {
        track("demo_view", {});
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindClicks);
  } else {
    bindClicks();
  }
})();
