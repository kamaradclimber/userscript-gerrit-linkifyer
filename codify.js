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

    onCommitBoxAvailable(function(element) {
        var codify = function(match, backticked_code, offset, string) { return `<code>${backticked_code}</code>`; }
        element.innerHTML = element.innerHTML.replaceAll(/`([^`]+)`/g, codify);
    })
})();