// ==UserScript==
// @name Telemost Hotkeys (KTalk-like)
// @namespace https://github.com/happyproff/userscript-telemost-hotkeys
// @version 1.1.1
// @description Adds KTalk-style hotkeys to Yandex Telemost: Alt+A, Alt+V, Alt+R, Alt+D, Alt+C/Alt+H
// @author Stanislav Gamaiunov
// @match https://telemost.yandex.ru/*
// @match https://telemost.360.yandex.ru/*
// @icon https://telemost.yastatic.net/s3/telemost/_/5f111e8a180b3d3d27a674f5114a7809ff716168.png
// @homepageURL https://github.com/happyproff/userscript-telemost-hotkeys
// @supportURL https://github.com/happyproff/userscript-telemost-hotkeys/issues
// @updateURL https://raw.githubusercontent.com/happyproff/userscript-telemost-hotkeys/main/telemost-hotkeys.user.js
// @downloadURL https://raw.githubusercontent.com/happyproff/userscript-telemost-hotkeys/main/telemost-hotkeys.user.js
// @grant none
// @run-at document-idle
// ==/UserScript==

(function () {
    'use strict';

    const clickButton = (action, selector) => {
        console.info(`[Telemost Hotkeys] ${action} hotkey pressed.`);
        document.querySelector(selector)?.click();
    };

    window.addEventListener('keydown', (e) => {
        if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }

        // noinspection SpellCheckingInspection
        switch (e.code) {
            case 'KeyA':
                e.preventDefault();
                clickButton('Microphone', '[data-testid="turn-on-mic-button"], [data-testid="turn-off-mic-button"]');
                break;

            case 'KeyV':
                e.preventDefault();
                clickButton('Camera', '[data-testid="turn-on-camera-button"], [data-testid="turn-off-camera-button"]');
                break;

            case 'KeyR':
                e.preventDefault();
                clickButton('Raise hand', '[data-testid="hand-up-button"], [data-testid="hand-down-button"]');
                break;

            case 'KeyD':
                e.preventDefault();
                clickButton('Screen sharing', '[data-testid="start-demonstration-button"], [data-testid="stop-demonstration-button"]');
                break;

            case 'KeyC':
            case 'KeyH':
                e.preventDefault();
                clickButton('Chat', 'button[data-testid="chat-alt-button"]');
                break;
        }
    }, true);

    const style = document.createElement('style');
    style.textContent = `
        [data-testid="turn-off-mic-button"],
        [data-testid="turn-off-camera-button"],
        [data-testid="hand-down-button"],
        [data-testid="stop-demonstration-button"] {
            background: #b91c1c !important;
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(style);
})();
