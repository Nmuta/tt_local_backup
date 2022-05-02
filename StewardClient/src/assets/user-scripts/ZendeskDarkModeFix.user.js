// ==UserScript==
// @name Zendesk Dark Mode Extension Fix For Steward
// @match *://forzasupport.zendesk.com/*
// @match *://forzasupport1570048282.zendesk.com/*
// @description Fixes the iframe filter in the Zendesk DarkMode Theme Chrome extension.
// @version 1.0.0
// ==/UserScript==

(function () {
  'use strict';

  var element = document.querySelector('html');
  var filterArray = getComputedStyle(element).filter.split(' ');

  var contrastString = filterArray.filter(element => element.includes('contrast'))[0];
  var brightnessString = filterArray.filter(element => element.includes('brightness'))[0];

  var contrastValue = contrastString.match(/\(([^()]*)\)/)[1];
  var brightnessValue = brightnessString.match(/\(([^()]*)\)/)[1];

  var computedContrastValue = 1 / contrastValue;
  var computedBrightnessValue = 1 / brightnessValue;

  addGlobalStyle(
    '.apps_nav_bar iframe {filter: invert(100%) contrast(' +
      computedContrastValue +
      ') brightness(' +
      computedBrightnessValue +
      ') hue-rotate(-180deg) !important;}',
  );
})();

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.innerHTML = css;
  head.appendChild(style);
}
