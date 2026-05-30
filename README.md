# Yandex Telemost Hotkeys

Userscript:
1. Adds Kontur Talk-style hotkeys to Yandex Telemost.
2. Highlights active buttons in red.
3. Outlines the button being pressed. This is useful because Telemost itself can react to button presses with a noticeable delay.

## Installation

1. Install the [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension for Chrome ([other browsers](https://www.tampermonkey.net/))
2. Enable `Allow User Scripts` in the [extension settings](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo)
3. Open the [script](https://raw.githubusercontent.com/happyproff/userscript-telemost-hotkeys/main/telemost-hotkeys.user.js) and click `Install`
4. If Telemost is already open, reload the page

## Features

- Hotkeys for the main in-call actions.
- Support for the chat that Telemost opens inside an iframe.
- Visual outline while a hotkey is held.
- Browser console logs when hotkeys are pressed.

The script runs on:
- `https://telemost.yandex.ru/*`
- `https://telemost.360.yandex.ru/*`
- chat iframe `https://yandex.ru/chat*`, only when it is opened inside Telemost

## Hotkeys

| Shortcut               | Action                      |
|------------------------|-----------------------------|
| Alt+**A**              | Toggle microphone           |
| Alt+**V**              | Toggle camera               |
| Alt+**R**              | Raise / lower hand          |
| Alt+**D**              | Start / stop screen sharing |
| Alt+**C**<br>Alt+**H** | Open / close chat           |

## Updates

If you install the script via Tampermonkey, updates will be offered automatically.

## Possible conflicts

Some browser extensions or system settings can intercept keyboard shortcuts
before the page receives them. For example, `Alt+C` may conflict with the
`Xdebug Helper by JetBrains` extension. In that case, use the fallback chat
shortcut `Alt+H`.

---

# Горячие клавиши для сервиса Яндекс Телемост / Yandex Telemost Hotkeys

Юзерскрипт:
1. Добавляет в Яндекс Телемост горячие клавиши в стиле Контур Толка.
2. Подсвечивает «включённые» кнопки красным.
3. Выделяет нажимаемые кнопки. Это полезно, потому что сам Телемост реагирует на нажатия с большой задержкой.

## Установка

1. Установите расширение [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) для Chrome ([для других браузеров](https://www.tampermonkey.net/))
2. В [настройках расширения](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) включите `Allow User Scripts`/`Разрешить пользовательские скрипты`
3. Откройте [скрипт](https://raw.githubusercontent.com/happyproff/userscript-telemost-hotkeys/main/telemost-hotkeys.user.js) и нажмите `Install`
4. Если Телемост уже открыт, обновите страницу

## Возможности

- Горячие клавиши для основных действий во время звонка.
- Поддержка чата, который Телемост открывает внутри iframe.
- Визуальная окантовка кнопки при удержании хоткея.
- Логи в консоли браузера при нажатии горячих клавиш.

Скрипт работает на страницах:
- `https://telemost.yandex.ru/*`
- `https://telemost.360.yandex.ru/*`
- iframe чата `https://yandex.ru/chat*`, только если он открыт внутри Телемоста

## Горячие клавиши

| Сочетание              | Действие                                |
|------------------------|-----------------------------------------|
| Alt+**A**              | Включить / выключить микрофон           |
| Alt+**V**              | Включить / выключить камеру             |
| Alt+**R**              | Поднять / опустить руку                 |
| Alt+**D**              | Начать / остановить демонстрацию экрана |
| Alt+**C**<br>Alt+**H** | Открыть / закрыть чат                   |

## Обновление

Если вы устанавливали скрипт через Tampermonkey, обновления будут предлагаться автоматически.

## Возможные конфликты

Некоторые расширения браузера или системные настройки могут перехватывать
сочетания клавиш раньше страницы. Например, `Alt+C` может конфликтовать с
расширением Xdebug Helper by JetBrains. В таком случае для чата можно
использовать запасное сочетание `Alt+H`.
