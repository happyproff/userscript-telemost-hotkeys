// ==UserScript==
// @name Telemost Hotkeys (KTalk-like)
// @namespace https://github.com/happyproff/userscript-telemost-hotkeys
// @version 1.2.0
// @description Adds KTalk-style hotkeys to Yandex Telemost: Alt+A, Alt+V, Alt+R, Alt+D, Alt+C/Alt+H
// @author Stanislav Gamaiunov
// @match https://telemost.yandex.ru/*
// @match https://telemost.360.yandex.ru/*
// @match https://yandex.ru/chat*
// @icon https://telemost.yastatic.net/s3/telemost/_/5f111e8a180b3d3d27a674f5114a7809ff716168.png
// @homepageURL https://github.com/happyproff/userscript-telemost-hotkeys
// @supportURL https://github.com/happyproff/userscript-telemost-hotkeys/issues
// @updateURL https://raw.githubusercontent.com/happyproff/userscript-telemost-hotkeys/main/telemost-hotkeys.user.js
// @downloadURL https://raw.githubusercontent.com/happyproff/userscript-telemost-hotkeys/main/telemost-hotkeys.user.js
// @grant none
// @run-at document-start
// @all-frames true
// ==/UserScript==

(function () {
    'use strict';

    const CLICK_MESSAGE_TYPE = 'telemost-hotkeys-click';
    const TELEMOST_ORIGINS = new Set([
        'https://telemost.yandex.ru',
        'https://telemost.360.yandex.ru',
    ]);
    const ALLOWED_SELECTORS = new Set([
        '[data-testid="turn-on-mic-button"], [data-testid="turn-off-mic-button"]',
        '[data-testid="turn-on-camera-button"], [data-testid="turn-off-camera-button"]',
        '[data-testid="hand-up-button"], [data-testid="hand-down-button"]',
        '[data-testid="start-demonstration-button"], [data-testid="stop-demonstration-button"]',
        'button[data-testid="chat-alt-button"]',
    ]);
    const isTopWindow = () => {
        try {
            return window.top === window;
        } catch {
            return false;
        }
    };

    const clickPageButton = (selector) => {
        if (!ALLOWED_SELECTORS.has(selector)) {
            return false;
        }

        const button = document.querySelector(selector);
        button?.click();

        return Boolean(button);
    };

    const getParentOrigin = () => {
        return new URLSearchParams(window.location.search).get('parentOrigin') || 'https://telemost.360.yandex.ru';
    };

    const isTelemostPage = () => {
        return TELEMOST_ORIGINS.has(window.location.origin);
    };

    const isTelemostChatFrame = () => {
        return window.location.origin === 'https://yandex.ru' && !isTopWindow() && TELEMOST_ORIGINS.has(getParentOrigin());
    };

    if (!isTelemostPage() && !isTelemostChatFrame()) {
        return;
    }

    const clickButton = (action, selector) => {
        console.info(`[Telemost Hotkeys] ${action} hotkey pressed.`);

        if (isTopWindow()) {
            clickPageButton(selector);
            return;
        }

        window.top?.postMessage({
            type: CLICK_MESSAGE_TYPE,
            action,
            selector,
        }, getParentOrigin());
    };

    const handleHotkey = (e) => {
        if (e.repeat) {
            return;
        }

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
    };

    window.addEventListener('keydown', handleHotkey, true);

    window.addEventListener('message', (e) => {
        if (
            !isTopWindow() ||
            e.origin !== 'https://yandex.ru' ||
            e.data?.type !== CLICK_MESSAGE_TYPE
        ) {
            return;
        }

        if (!ALLOWED_SELECTORS.has(e.data.selector)) {
            return;
        }

        console.info(`[Telemost Hotkeys] ${e.data.action} hotkey pressed.`);
        clickPageButton(e.data.selector);
    });

    const addStyles = () => {
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
    };

    if (document.head) {
        addStyles();
    } else {
        document.addEventListener('DOMContentLoaded', addStyles, { once: true });
    }
})();
