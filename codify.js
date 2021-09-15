// ==UserScript==
// @name         Code detection
// @namespace    http://tampermonkey.net/
// @copyright    2021, Grégoire Seux
// @version      0.1
// @homepage     https://github.com/kamaradclimber/userscript-gerrit-linkifyer
// @description  detect inline code block in gerrit commit message
// @author       g.seux
// @supportURL   https://github.com/kamaradclimber/userscript-gerrit-linkifyer
// @contributionURL   https://github.com/kamaradclimber/userscript-gerrit-linkifyer
// @match        https://review.crto.in/
// @icon         https://www.google.com/s2/favicons?domain=crto.in
// @grant        none
// @license      Apache-2.0
// @updateURL https://openuserjs.org/meta/kamaradclimber/My_Script.meta.js
// @noframes
// ==/UserScript==

(function() {
    'use strict';

  var onCommitBoxAvailable = function (resolve) {
    var commit_box_class = ".com-google-gerrit-client-change-CommitBox_BinderImpl_GenCss_style-text";
    var e = document.querySelector(commit_box_class);
    if (e && 0 < e.innerText.length) {
      resolve(e);
    } else {
      window.setTimeout(function () {
        console.log("Commit message box not visible, relaunching timer");
        onCommitBoxAvailable(resolve);

      }, 100);
    }
  }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }


  onCommitBoxAvailable(function(element) {
    addGlobalStyle(`code {
      padding: .2em .4em;
      margin: 0;
      color: bisque;
      font-size: 120%;
      background-color: green;
      border-radius: 6px;
      }`);
    var codify = function(match, backticked_code, offset, string) { return `<code>${backticked_code}</code>`; }
    element.innerHTML = element.innerHTML.replaceAll(/`([^`]+)`/g, codify);
  })
})();
