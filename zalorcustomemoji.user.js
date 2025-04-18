// ==UserScript==
// @name         Zalo Custom Reactions with Color Picker
// @version      1.9
// @description  Zalo web custom reaction with colored text
// @author       Anhwaivo
// @maintainer   Kennex666 (UI/UX), Meohunter (TextBox), dacsang97 (Emoji Picker), Assistant
// @match        https://*.zalo.me/*
// @match        https://chat.zalo.me/*
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/anhwaivo/zalo-custom-reaction-userscript/raw/refs/heads/main/zalorcustomemoji.user.js
// ==/UserScript==

(function() {
    "use strict";

    const settings = {
        isRecently: false
    }

    const reactions = [
        { type: 100, icon: "👏", name: "clap", class: "emoji-sizer emoji-outer", bgPos: "80% 12.5%" },
        { type: 101, icon: "🎉", name: "huh", class: "emoji-sizer emoji-outer", bgPos: "74% 62.5%" },
        { type: 102, icon: "🎨", name: "send_custom", class: "emoji-sizer emoji-outer", bgPos: "84% 82.5%" },
        // Thêm emoji tuỳ ý...
    ];

    const RecentlyReaction = {
        add: function (reaction) {
            const emojiCustom = { type: simpleHash(reaction), icon: reaction, name: reaction, class: "emoji-sizer emoji-outer", bgPos: "0% 0%" };
            if (settings.isRecently) {
                reactions[reactions.length - 1] = emojiCustom;
            } else {
                reactions.push(emojiCustom);
            }
            settings.isRecently = true;
            localStorage.setItem("recentlyCustomReaction", JSON.stringify(emojiCustom));
        },
        get: function () {
            const reaction = localStorage.getItem("recentlyCustomReaction");
            return reaction ? JSON.parse(reaction) : null;
        },
        load: function () {
            const reaction = this.get();
            if (reaction) {
                settings.isRecently = true;
                reactions.push(reaction);
            }
        }
    }

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    const emojiCategories = { /* ... your existing categories ... */ };

    const createEmojiPicker = () => {
        // ... existing emoji picker code ...
    };

    const createTextInputPopup = () => {
        const popup = document.createElement("div");
        popup.id = "custom-text-reaction-popup";
        popup.style.cssText = `
            position: fixed;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            padding: 20px; z-index: 9999; display: none;
            flex-direction: column; gap: 15px; min-width: 300px;
            font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
            animation: fadeIn 0.2s ease-out;
        `;

        const title = document.createElement("div");
        title.textContent = "Tùy chỉnh reaction";
        title.style.cssText = "font-weight: bold; font-size: 16px; color: #333; margin-bottom: 5px;";
        popup.appendChild(title);

        // ─── Color Picker ─────────────────────────────────────────────────────────
        const colorLabel = document.createElement("label");
        colorLabel.textContent = "Chọn màu chữ:";
        colorLabel.style.cssText = "font-size:14px; margin-bottom:4px; color:#333;";
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.id   = "custom-text-reaction-color";
        colorInput.value = "#1976d2";
        colorInput.style.cssText = "width:100%; height:32px; border:none; padding:0; margin-bottom:12px;";
        popup.appendChild(colorLabel);
        popup.appendChild(colorInput);
        // ────────────────────────────────────────────────────────────────────────

        const inputContainer = document.createElement("div");
        inputContainer.style.cssText = "position: relative;";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "custom-text-reaction-input";
        input.placeholder = "Nhập nội dung reaction...";
        input.maxLength = 15;
        input.style.cssText = `padding: 10px 12px; padding-right: 40px; border: 2px solid #e0e0e0; border-radius: 8px; width: 100%; box-sizing: border-box; font-size: 14px; transition: border-color 0.2s; outline: none;`;
        input.addEventListener("focus", () => input.style.borderColor = "#2196F3");
        input.addEventListener("blur", () => input.style.borderColor = "#e0e0e0");

        const emojiButton = document.createElement("button");
        emojiButton.id = "emoji-button";
        emojiButton.textContent = "😊";
        emojiButton.style.cssText = `position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; opacity: 0.7; transition: opacity 0.2s, transform 0.2s;`;
        // ... emoji picker toggling & events ...

        inputContainer.appendChild(input);
        inputContainer.appendChild(emojiButton);
        // ... charCounter, picker ...
        popup.appendChild(inputContainer);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = "display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;";

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Hủy";
        cancelButton.style.cssText = `padding: 8px 16px; border: none; border-radius: 6px; background-color: #f5f5f5; color: #333; font-weight: 500; cursor: pointer; transition: background-color 0.2s;`;
        cancelButton.onmouseover = () => cancelButton.style.backgroundColor = "#e0e0e0";
        cancelButton.onmouseout  = () => cancelButton.style.backgroundColor = "#f5f5f5";
        cancelButton.onclick      = () => hidePopup();

        const confirmButton = document.createElement("button");
        confirmButton.textContent = "Gửi";
        confirmButton.style.cssText = `padding: 8px 16px; border: none; border-radius: 6px; background-color: #2196F3; color: white; font-weight: 500; cursor: pointer; transition: background-color 0.2s;`;
        confirmButton.onmouseover = () => confirmButton.style.backgroundColor = "#1976D2";
        confirmButton.onmouseout  = () => confirmButton.style.backgroundColor = "#2196F3";

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        popup.appendChild(buttonContainer);

        // hidePopup & overlay setup …

        confirmButton.addEventListener("click", () => {
            const customText = input.value.trim();
            const customColor = colorInput.value;
            if (customText) {
                const customReaction = { icon: customText, type: simpleHash(customText), name: customText, color: customColor };
                RecentlyReaction.add(customText);
                sendReaction(window.currentReactionContext.wrapper, window.currentReactionContext.id, customReaction);
                hidePopup();
            }
        });

        return { popup, input, confirmButton, show: showPopup, hide: hidePopup, overlay };
    };

    function updateBtn(id, react) {
        const span = document.querySelector(`#reaction-btn-${id} span`);
        if (!span) return;
        span.innerHTML = "";
        if (react.name === "text" || (typeof react.icon === "string" && react.icon.length > 2)) {
            const textContainer = document.createElement("div");
            textContainer.className = "text-reaction";
            if (react.color) textContainer.style.color = react.color;
            textContainer.textContent = react.icon;
            span.appendChild(textContainer);
        } else {
            // … existing emoji branch …
        }
    }

    // Inject CSS, removing hardcoded color on .text-reaction
    const style = document.createElement("style");
    style.textContent = `
        .text-reaction {
            background-color: #e3f2fd;
            border-radius: 12px;
            padding: 3px 10px;
            font-size: 12px;
            font-weight: 600;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            /* color set via inline style */
        }
        /* … your other styles … */
    `;
    document.head.appendChild(style);

    // … rest of observer, initReactions, init() …
    init();
})();
