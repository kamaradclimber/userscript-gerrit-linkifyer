// ==UserScript==
// @name         Commit linker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  linkify commits in gerrit commit message
// @author       g.seux
// @match        https://review.crto.in/
// @icon         https://www.google.com/s2/favicons?domain=crto.in
// @grant        none
// @license      Apache-2.0
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

    function linkify(match, commit_hash, offset, string) {
        return `<a href="https://review.crto.in/#/q/${commit_hash}">${commit_hash}</a>`;
    }

    const regex = /\b([a-f0-9]{6,})\b/g;
    const link = /<a href/gi;

    function updateNodes(nodes) {
        for(var i=0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node instanceof Text) {
                if (!node.textContent.match(link)) {
                    console.log(node.constructor.name);

                    var linkedElement = document.createElement();
                    linkedElement.innerHTML = node.textContent.replaceAll(regex, linkify);
                    if (node.textContent != linkedElement.innerHTML) {
                        node.replaceWith(linkedElement)
                    }
                }
            }
        }
    }


    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            updateNodes(mutation.addedNodes);
        })
    });


    onCommitBoxAvailable(function(element) {
        observer.observe(element, {childList: true, subtree: true});
        // to have the observer pattern working, we need to make a fake modification 🤦‍♂️
        element.innerText = element.innerText.replaceAll("a", "a");
    })
})();