// ==UserScript==
// @name Telemost Hotkeys (KTalk-like)
// @namespace https://github.com/happyproff/userscript-telemost-hotkeys
// @version 1.4.1
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
    const BUTTON_ACTIVE_CLASS = 'telemost-hotkeys-button-active';
    const HOTKEYS = new Map([
        ['KeyA', {
            action: 'Microphone',
            selector: '[data-testid="turn-on-mic-button"], [data-testid="turn-off-mic-button"]',
        }],
        ['KeyV', {
            action: 'Camera',
            selector: '[data-testid="turn-on-camera-button"], [data-testid="turn-off-camera-button"]',
        }],
        ['KeyR', {
            action: 'Raise hand',
            selector: '[data-testid="hand-up-button"], [data-testid="hand-down-button"]',
        }],
        ['KeyD', {
            action: 'Screen sharing',
            selector: '[data-testid="start-demonstration-button"], [data-testid="stop-demonstration-button"]',
        }],
        ['KeyC', {
            action: 'Chat',
            selector: 'button[data-testid="chat-alt-button"]',
        }],
        ['KeyH', {
            action: 'Chat',
            selector: 'button[data-testid="chat-alt-button"]',
        }],
    ]);
    const isTopWindow = () => {
        try {
            return window.top === window;
        } catch {
            return false;
        }
    };
    let activeHighlightSelector = '';
    let highlightIntervalId;

    const clickPageButton = (selector) => {
        if (!ALLOWED_SELECTORS.has(selector)) {
            return false;
        }

        const button = document.querySelector(selector);
        button?.click();

        return Boolean(button);
    };

    const setPageButtonHighlight = (selector, isActive) => {
        activeHighlightSelector = isActive ? selector : '';
        clearInterval(highlightIntervalId);

        document.querySelectorAll(`.${BUTTON_ACTIVE_CLASS}`).forEach((button) => {
            button.classList.remove(BUTTON_ACTIVE_CLASS);
        });

        if (!isActive || !ALLOWED_SELECTORS.has(selector)) {
            return;
        }

        const applyHighlight = () => {
            if (activeHighlightSelector !== selector) {
                return;
            }

            document.querySelectorAll(`.${BUTTON_ACTIVE_CLASS}`).forEach((button) => {
                button.classList.remove(BUTTON_ACTIVE_CLASS);
            });
            document.querySelector(selector)?.classList.add(BUTTON_ACTIVE_CLASS);
        };

        applyHighlight();
        highlightIntervalId = setInterval(applyHighlight, 50);
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

    const sendButtonEvent = (eventName, action, selector) => {
        if (isTopWindow()) {
            if (eventName === 'press') {
                console.info(`[Telemost Hotkeys] ${action} hotkey pressed.`);
                setPageButtonHighlight(selector, true);
                clickPageButton(selector);
            }

            setPageButtonHighlight(selector, eventName === 'press');
            return;
        }

        window.top?.postMessage({
            type: CLICK_MESSAGE_TYPE,
            eventName,
            action,
            selector,
        }, getParentOrigin());
    };

    const pressButton = (action, selector) => {
        sendButtonEvent('press', action, selector);
    };

    const releaseButton = (selector) => {
        sendButtonEvent('release', '', selector);
    };

    const handleHotkey = (e) => {
        const hotkey = HOTKEYS.get(e.code);
        const isAltRelease = e.type === 'keyup' && (e.code === 'AltLeft' || e.code === 'AltRight');

        if (e.type === 'keyup') {
            if (hotkey) {
                e.preventDefault();
                releaseButton(hotkey.selector);
            } else if (isAltRelease) {
                releaseButton('');
            }

            return;
        }

        if (e.repeat || !hotkey) {
            return;
        }

        if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }

        e.preventDefault();
        pressButton(hotkey.action, hotkey.selector);
    };

    window.addEventListener('keydown', handleHotkey, true);
    window.addEventListener('keyup', handleHotkey, true);
    window.addEventListener('blur', () => releaseButton(''));

    window.addEventListener('message', (e) => {
        if (
            !isTopWindow() ||
            e.origin !== 'https://yandex.ru' ||
            e.data?.type !== CLICK_MESSAGE_TYPE
        ) {
            return;
        }

        if (e.data.eventName !== 'release' && !ALLOWED_SELECTORS.has(e.data.selector)) {
            return;
        }

        if (e.data.eventName === 'press') {
            console.info(`[Telemost Hotkeys] ${e.data.action} hotkey pressed.`);
            setPageButtonHighlight(e.data.selector, true);
            clickPageButton(e.data.selector);
            setPageButtonHighlight(e.data.selector, true);
        } else if (e.data.eventName === 'release') {
            setPageButtonHighlight(e.data.selector, false);
        }
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

            .${BUTTON_ACTIVE_CLASS} {
                outline: 2px solid #3b82f6 !important;
                outline-offset: 2px !important;
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
