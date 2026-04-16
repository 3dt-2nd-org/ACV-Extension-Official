console.log("[EXT-CONTENT] Bridge Loaded");

const API_BASE_URL = "https://acv-project.koreacentral.cloudapp.azure.com";

const UI_IDS = {
    badge: "acv-badge",
    overlay: "acv-warning-overlay",
    panelLabel: "acv-panel-label",
    modalTitle: "acv-modal-title",
    modalSubtitle: "acv-modal-subtitle",
    homeButton: "acv-go-home",
    continueButton: "acv-continue-watch",
    reasonButton: "acv-open-reason",
    panel: "acv-safe-panel",
    panelTitle: "acv-panel-title",
    panelMeta: "acv-panel-meta",
    panelVideoTitle: "acv-panel-video-title",
    panelChannelName: "acv-panel-channel-name",
    panelReport: "acv-panel-report",
    panelRaw: "acv-panel-raw",
    closePanelButton: "acv-close-panel",
};

const TEXT = {
    pendingBadge: "\uBD84\uC11D \uC911",
    safeBadge: "\uC548\uC2EC",
    cautionBadge: "\uC8FC\uC758",
    dangerBadge: "\uC758\uC2EC",
    reviewBadge: "\uC7AC\uAC80\uD1A0",
    errorBadge: "\uC624\uB958",
    points: "\uC810",
    panelLabel: "ACV",
    panelTitle: "\uC2E0\uB8B0\uB3C4 \uD310\uB2E8 \uC774\uC720",
    panelWaiting: "\uBD84\uC11D \uC644\uB8CC \uD6C4 \uC2E0\uB8B0\uB3C4 \uD310\uB2E8 \uADFC\uAC70\uB97C \uC5EC\uAE30\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    panelClose: "\uD328\uB110 \uB2EB\uAE30",
    reportEmpty: "\uD45C\uC2DC\uD560 \uC138\uBD80 \uC774\uC720\uAC00 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4.",
    rawToggle: "\uC6D0\uBCF8 \uB370\uC774\uD130 \uBCF4\uAE30",
    rawPending: "\uACB0\uACFC \uB300\uAE30 \uC911",
    buttonHome: "\uC720\uD29C\uBE0C \uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30",
    buttonContinue: "\uACC4\uC18D \uC2DC\uCCAD\uD558\uAE30",
    buttonContinueCaution: "\uACC4\uC18D \uC2DC\uCCAD\uD558\uAE30 (\uC8FC\uC758)",
    buttonReason: "\uC2E0\uB8B0\uB3C4 \uC810\uC218 \uC774\uC720 \uD655\uC778\uD558\uAE30",
    modalDangerTitle: "\uC2E0\uB8B0\uB3C4\uAC00 \uB0AE\uC740 \uC601\uC0C1\uC785\uB2C8\uB2E4",
    modalCautionTitle: "\uC2E0\uB8B0\uB3C4\uC5D0 \uC8FC\uC758\uAC00 \uD544\uC694\uD55C \uC601\uC0C1\uC785\uB2C8\uB2E4",
    modalSafeTitle: "\uC2E0\uB8B0\uB3C4\uAC00 \uC591\uD638\uD55C \uC601\uC0C1\uC785\uB2C8\uB2E4",
    modalReviewTitle: "\uC7AC\uBD84\uC11D\uC774 \uD544\uC694\uD55C \uC601\uC0C1\uC785\uB2C8\uB2E4",
    modalNeutralTitle: "ACV \uBD84\uC11D \uACB0\uACFC\uC785\uB2C8\uB2E4",
    modalSummaryFallback: "\uBD84\uC11D \uACB0\uACFC\uAC00 \uB3C4\uCC29\uD588\uC2B5\uB2C8\uB2E4.",
    invalidResultFallback: "\uBD84\uC11D \uACB0\uACFC\uAC00 \uBD88\uC644\uC804\uD569\uB2C8\uB2E4. \uC11C\uBC84 \uC7AC\uC694\uCCAD\uC774 \uD544\uC694\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    modalScorePrefix: "\uAC80\uC99D \uACB0\uACFC \uC2E0\uB8B0\uB3C4 \uC810\uC218\uAC00 ",
    modalScoreSuffix: "\uC785\uB2C8\uB2E4.",
    waitingTitle: "ACV \uBD84\uC11D \uC900\uBE44 \uC911",
    waitingMeta: "\uC11C\uBC84\uC5D0\uC11C \uBD84\uC11D \uC138\uC158\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    waitingFollower: "\uD604\uC7AC \uB300\uAE30 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uBD84\uC11D \uC21C\uC11C\uAC00 \uC624\uBA74 \uC0C1\uD0DC\uAC00 \uAC31\uC2E0\uB429\uB2C8\uB2E4.",
    waitingSubtitles: "\uC790\uB9C9 \uB370\uC774\uD130\uB97C \uD655\uBCF4 \uD558\uB294 \uC911\uC785\uB2C8\uB2E4.",
    waitingAd: "\uAD11\uACE0\uAC00 \uB05D\uB098\uBA74 \uBCF8\uD3B8 \uC790\uB9C9\uC744 \uB2E4\uC2DC \uAC00\uC838\uC635\uB2C8\uB2E4.",
    waitingSubtitleButton: "\uC720\uD29C\uBE0C \uC790\uB9C9 \uBC84\uD2BC\uC744 \uCC3E\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    uploadError: "\uC790\uB9C9 \uB370\uC774\uD130 \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
    streamError: "\uBD84\uC11D \uC2A4\uD2B8\uB9BC \uC5F0\uACB0\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
    reasonSummary: "\uBD84\uC11D \uC694\uC57D",
    reasonTrustLevel: "ACV \uB4F1\uAE09",
    reasonClaims: "\uAC80\uC99D \uD3EC\uC778\uD2B8 ",
    reasonTitle: "\uC601\uC0C1 \uC81C\uBAA9",
    reasonChannel: "\uCC44\uB110 \uBA85",
    reasonPublished: "\uAC8C\uC2DC \uC77C\uC2DC",
    reasonAnalyzed: "\uBD84\uC11D \uC2DC\uAC01",
    reasonFallbackPrefix: "\uD3EC\uC778\uD2B8 ",
    subtitleCached: "\uC790\uB9C9 \uB370\uC774\uD130\uAC00 \uD655\uBCF4\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
};

function getToneUiCopy(tone) {
    switch (tone) {
        case "danger":
            return {
                badgeLabel: TEXT.dangerBadge,
                panelLabel: "ACV \uC704\uD5D8",
                panelTitle: "\uC624\uD574\uB97C \uBD80\uB97C \uC218 \uC788\uB294 \uB0B4\uC6A9\uC774 \uBCF4\uC5EC\uC694",
                panelMeta: "\uACFC\uC7A5\uB418\uAC70\uB098 \uC0AC\uC2E4 \uD655\uC778\uC774 \uD544\uC694\uD55C \uD45C\uD604\uC774 \uD3EC\uD568\uB410\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uADFC\uAC70\uB97C \uBA3C\uC800 \uD655\uC778\uD574 \uBCF4\uC138\uC694.",
                overlayTitle: '\uC2E0\uB8B0\uB3C4\uAC00 <span class="acv-tone-word">\uB0AE\uC740</span> \uC601\uC0C1\uC785\uB2C8\uB2E4',
                scoreDescription: (scoreText) => `\uAC80\uC99D \uACB0\uACFC \uC2E0\uB8B0\uB3C4 \uC810\uC218\uAC00 <strong class="acv-score-strong">${scoreText}</strong>\uB85C,<br> \uADF8\uB300\uB85C \uBBFF\uAE30\uBCF4\uB2E4 \uADFC\uAC70\uB97C \uAF2D \uD655\uC778\uD574 \uBCF4\uC138\uC694.`,
            };
        case "caution":
            return {
                badgeLabel: TEXT.cautionBadge,
                panelLabel: "ACV \uC8FC\uC758",
                panelTitle: "\uD655\uC778\uD558\uACE0 \uC2DC\uCCAD\uD558\uB294 \uAC8C \uC88B\uC544\uC694",
                panelMeta: "\uC77C\uBD80 \uC8FC\uC7A5\uC774\uB098 \uD45C\uD604\uC740 \uD55C \uBC88 \uB354 \uAC80\uD1A0\uD560 \uD544\uC694\uAC00 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uADFC\uAC70\uB97C \uD568\uAED8 \uD655\uC778\uD574 \uBCF4\uC138\uC694.",
                overlayTitle: '\uC2E0\uB8B0\uB3C4\uC5D0 <span class="acv-tone-word">\uC8FC\uC758</span>\uAC00 \uD544\uC694\uD55C \uC601\uC0C1\uC785\uB2C8\uB2E4',
                scoreDescription: (scoreText) => `\uAC80\uC99D \uACB0\uACFC \uC2E0\uB8B0\uB3C4 \uC810\uC218\uAC00 <strong class="acv-score-strong">${scoreText}</strong>\uB85C,<br> \uC77C\uBD80 \uB0B4\uC6A9\uC740 \uD55C \uBC88 \uB354 \uD655\uC778\uD558\uB294 \uAC83\uC774 \uC88B\uC2B5\uB2C8\uB2E4.`,
            };
        case "safe":
            return {
                badgeLabel: TEXT.safeBadge,
                panelLabel: "ACV \uC548\uC2EC",
                panelTitle: "\uBE44\uAD50\uC801 \uC548\uC2EC\uD558\uACE0 \uBCFC \uC218 \uC788\uC5B4\uC694",
                panelMeta: "\uD604\uC7AC \uBD84\uC11D \uAE30\uC900\uC5D0\uC11C\uB294 \uC2E0\uB8B0\uB3C4\uAC00 \uB192\uC740 \uD3B8\uC785\uB2C8\uB2E4. \uADF8\uB798\uB3C4 \uC544\uB798 \uADFC\uAC70\uB294 \uD568\uAED8 \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694.",
                overlayTitle: '\uC2E0\uB8B0\uB3C4\uAC00 <span class="acv-tone-word">\uC591\uD638\uD55C</span> \uC601\uC0C1\uC785\uB2C8\uB2E4',
                scoreDescription: (scoreText) => `\uAC80\uC99D \uACB0\uACFC \uC2E0\uB8B0\uB3C4 \uC810\uC218\uAC00 <strong class="acv-score-strong">${scoreText}</strong>\uB85C,<br> \uBE44\uAD50\uC801 \uC548\uC2EC\uD558\uACE0 \uC2DC\uCCAD\uD560 \uC218 \uC788\uB294 \uC218\uC900\uC785\uB2C8\uB2E4.`,
            };
        case "review":
            return {
                badgeLabel: TEXT.reviewBadge,
                panelLabel: "ACV \uC7AC\uAC80\uD1A0",
                panelTitle: "\uACB0\uACFC\uB97C \uB2E4\uC2DC \uD655\uC778\uD574\uC57C \uD574\uC694",
                panelMeta: "\uBD84\uC11D \uACB0\uACFC\uAC00 \uCDA9\uBD84\uD558\uC9C0 \uC54A\uAC70\uB098 \uB204\uB77D\uB418\uC5B4 \uB2E4\uC2DC \uD655\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
                overlayTitle: '\uACB0\uACFC\uB97C <span class="acv-tone-word">\uC7AC\uAC80\uD1A0</span>\uD574\uC57C \uD558\uB294 \uC601\uC0C1\uC785\uB2C8\uB2E4',
                scoreDescription: () => TEXT.invalidResultFallback,
            };
        default:
            return {
                badgeLabel: TEXT.pendingBadge,
                panelLabel: TEXT.panelLabel,
                panelTitle: TEXT.panelTitle,
                panelMeta: TEXT.panelWaiting,
                overlayTitle: TEXT.modalNeutralTitle,
                scoreDescription: () => TEXT.modalSummaryFallback,
            };
    }
}

let cachedSubtitleData = null;
let cachedMetadata = null;
let isLeader = false;
let subtitleUploaded = false;
let eventSource = null;
let currentVideoId = null;
let latestResult = null;
let overlayDismissed = false;
let overlayPauseInterval = null;
let overlayShouldResume = false;
let subtitleRetryTimer = null;
let subtitleUploadInFlight = false;
let subtitleFetchLoopActive = false;
let subtitleFetchRunId = 0;

function getVideoId() {
    return new URLSearchParams(window.location.search).get("v");
}

function isWatchPage() {
    return window.location.pathname === "/watch" && Boolean(getVideoId());
}

function getPlayerHost() {
    return (
        document.querySelector("#movie_player") ||
        document.querySelector(".html5-video-player") ||
        document.querySelector("ytd-player") ||
        document.body
    );
}

function inject() {
    if (document.getElementById("yt-sub-interceptor")) {
        return;
    }

    const script = document.createElement("script");
    script.id = "yt-sub-interceptor";
    script.src = chrome.runtime.getURL("inject.js");
    (document.head || document.documentElement).appendChild(script);
}

function ensureBadge(root) {
    let badge = document.getElementById(UI_IDS.badge);
    if (badge) {
        return badge;
    }

    badge = document.createElement("button");
    badge.id = UI_IDS.badge;
    badge.type = "button";
    badge.className = "badge-pending";
    badge.innerHTML = [
        '<span class="acv-badge-dot"></span>',
        '<span class="acv-badge-label"></span>',
        '<span class="acv-badge-divider" hidden></span>',
        '<span class="acv-badge-score" hidden></span>',
    ].join("");
    badge.addEventListener("click", handleBadgeClick);
    root.appendChild(badge);
    return badge;
}

function ensurePanel(root) {
    let panel = document.getElementById(UI_IDS.panel);
    if (panel) {
        return panel;
    }

    panel = document.createElement("aside");
    panel.id = UI_IDS.panel;
    panel.dataset.tone = "pending";
    panel.innerHTML = [
        `<button class="acv-panel-close" type="button" id="${UI_IDS.closePanelButton}" aria-label="${TEXT.panelClose}">&times;</button>`,
        `<div class="acv-panel-label" id="${UI_IDS.panelLabel}">`,
        TEXT.panelLabel,
        "</div>",
        `<div class="acv-safe-title" id="${UI_IDS.panelTitle}">${TEXT.panelTitle}</div>`,
        `<div class="acv-meta-blocks">`,
        `  <div class="acv-meta-block acv-meta-summary">`,
        `    <div class="acv-meta-block-label">리포트 요약</div>`,
        `    <p class="acv-meta" id="${UI_IDS.panelMeta}">${TEXT.panelWaiting}</p>`,
        "  </div>",
        `  <div class="acv-meta-block">`,
        `    <div class="acv-meta-block-label">제목</div>`,
        `    <p class="acv-meta acv-meta-title" id="${UI_IDS.panelVideoTitle}"></p>`,
        "  </div>",
        `  <div class="acv-meta-block">`,
        `    <div class="acv-meta-block-label">채널명</div>`,
        `    <p class="acv-meta" id="${UI_IDS.panelChannelName}"></p>`,
        "  </div>",
        "</div>",
        `<div class="acv-report-area" id="${UI_IDS.panelReport}"><p class="acv-report-empty">${TEXT.reportEmpty}</p></div>`,
        `<details class="acv-raw-details"><summary>${TEXT.rawToggle}</summary><pre class="acv-raw-pre" id="${UI_IDS.panelRaw}">${TEXT.rawPending}</pre></details>`,
    ].join("");

    root.appendChild(panel);

    const closeButton = panel.querySelector(`#${UI_IDS.closePanelButton}`);
    closeButton?.addEventListener("click", togglePanel);
    return panel;
}

function ensureOverlay() {
    const host = getPlayerHost();
    if (!host) {
        return null;
    }

    host.classList.add("acv-player-host");

    let overlay = document.getElementById(UI_IDS.overlay);
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = UI_IDS.overlay;
        overlay.dataset.tone = "pending";
        overlay.innerHTML = [
            '<div class="acv-card" role="dialog" aria-modal="true" aria-live="polite">',
            '  <div class="acv-card-header">',
            '    <div class="acv-card-alert">',
            '      <span class="acv-card-icon">!</span>',
            `      <h2 class="acv-card-title" id="${UI_IDS.modalTitle}">${TEXT.modalNeutralTitle}</h2>`,
            "    </div>",
            `    <p class="acv-card-subtitle" id="${UI_IDS.modalSubtitle}">${TEXT.modalSummaryFallback}</p>`,
            "  </div>",
            '  <div class="acv-btn-row">',
            `    <button class="acv-btn-primary" type="button" id="${UI_IDS.homeButton}">${TEXT.buttonHome}</button>`,
            `    <button class="acv-btn-secondary" type="button" id="${UI_IDS.continueButton}">${TEXT.buttonContinue}</button>`,
            "  </div>",
            `  <button class="acv-btn-report" type="button" id="${UI_IDS.reasonButton}">${TEXT.buttonReason}</button>`,
            "</div>",
        ].join("");
    }

    if (overlay.parentElement !== host) {
        host.appendChild(overlay);
    }

    const homeButton = overlay.querySelector(`#${UI_IDS.homeButton}`);
    const continueButton = overlay.querySelector(`#${UI_IDS.continueButton}`);
    const reasonButton = overlay.querySelector(`#${UI_IDS.reasonButton}`);

    if (homeButton) {
        homeButton.onclick = goToYoutubeHome;
    }

    if (continueButton) {
        continueButton.onclick = hideOverlay;
    }

    if (reasonButton) {
        reasonButton.onclick = togglePanel;
    }

    return overlay;
}

function ensureUi() {
    const root = document.body || document.documentElement;
    if (!root) {
        setTimeout(ensureUi, 50);
        return null;
    }

    ensureBadge(root);
    ensurePanel(root);
    ensureOverlay();

    return {
        badge: document.getElementById(UI_IDS.badge),
        panel: document.getElementById(UI_IDS.panel),
        panelLabel: document.getElementById(UI_IDS.panelLabel),
        overlay: document.getElementById(UI_IDS.overlay),
        panelTitle: document.getElementById(UI_IDS.panelTitle),
        panelMeta: document.getElementById(UI_IDS.panelMeta),
        panelVideoTitle: document.getElementById(UI_IDS.panelVideoTitle),
        panelChannelName: document.getElementById(UI_IDS.panelChannelName),
        panelReport: document.getElementById(UI_IDS.panelReport),
        panelRaw: document.getElementById(UI_IDS.panelRaw),
        modalTitle: document.getElementById(UI_IDS.modalTitle),
        modalSubtitle: document.getElementById(UI_IDS.modalSubtitle),
        continueButton: document.getElementById(UI_IDS.continueButton),
    };
}

function setPanelVisibility(visible) {
    const panel = document.getElementById(UI_IDS.panel);
    if (!panel) {
        return;
    }

    panel.classList.toggle("is-visible", visible);
}

function togglePanel() {
    const panel = document.getElementById(UI_IDS.panel);
    if (!panel) {
        ensureUi();
        setPanelVisibility(true);
        return;
    }

    setPanelVisibility(!panel.classList.contains("is-visible"));
}

function handleBadgeClick() {
    if (!latestResult) {
        togglePanel();
        return;
    }

    const tone = inferTone(latestResult);

    if (["danger", "caution", "review"].includes(tone)) {
        overlayDismissed = false;
        setPanelVisibility(false);
        setOverlayVisibility(true);
        return;
    }

    if (tone === "safe") {
        overlayDismissed = true;
        setOverlayVisibility(false);
        setPanelVisibility(true);
        return;
    }

    togglePanel();
}

function setOverlayVisibility(visible) {
    const overlay = visible ? ensureOverlay() : document.getElementById(UI_IDS.overlay);
    if (!overlay) {
        if (!visible) {
            stopOverlayPauseLock();
        }
        return;
    }

    overlay.classList.toggle("is-visible", visible);

    if (visible) {
        startOverlayPauseLock();
    } else {
        stopOverlayPauseLock();
    }
}

function getPlayerApi() {
    return document.querySelector("#movie_player");
}

function isAdShowing() {
    const playerApi = getPlayerApi();
    const adUi = playerApi?.querySelector(".ytp-ad-player-overlay, .ytp-ad-preview-container, .ytp-ad-skip-button-container");
    const isVisibleAdUi = Boolean(
        adUi &&
            window.getComputedStyle(adUi).display !== "none" &&
            window.getComputedStyle(adUi).visibility !== "hidden"
    );

    return Boolean(
        playerApi?.classList?.contains("ad-showing") ||
            playerApi?.classList?.contains("ad-interrupting") ||
            isVisibleAdUi
    );
}

function getActiveVideoId() {
    return currentVideoId || getVideoId();
}

function getSubtitleMessageContext(message) {
    const metadata = message && typeof message === "object" ? message.metadata : {};

    return {
        activeVideoId: getActiveVideoId(),
        pageVideoId: firstString([message?.pageVideoId, getVideoId()]),
        subtitleVideoId: firstString([
            message?.resolvedVideoId,
            message?.requestVideoId,
            metadata?.video_id,
            metadata?.videoId,
        ]),
        playerVideoId: firstString([message?.playerVideoId, metadata?.video_id, metadata?.videoId]),
        isAd: Boolean(message?.isAd),
    };
}

function shouldIgnoreSubtitleMessage(message) {
    const context = getSubtitleMessageContext(message);
    const isExplicitMainVideoPayload = Boolean(
        context.activeVideoId && context.subtitleVideoId && context.subtitleVideoId === context.activeVideoId
    );

    if (!context.activeVideoId) {
        return { ignore: true, reason: "no-active-video", context };
    }

    if (context.isAd && !isExplicitMainVideoPayload) {
        return { ignore: true, reason: "ad-playing", context };
    }

    if (context.subtitleVideoId && context.subtitleVideoId !== context.activeVideoId) {
        return { ignore: true, reason: "subtitle-video-mismatch", context };
    }

    if (isAdShowing() && !isExplicitMainVideoPayload) {
        return { ignore: true, reason: "ad-playing", context };
    }

    if (context.playerVideoId && context.playerVideoId !== context.activeVideoId && !isExplicitMainVideoPayload) {
        return { ignore: true, reason: "player-video-mismatch", context };
    }

    if (context.pageVideoId && context.pageVideoId !== context.activeVideoId && !isExplicitMainVideoPayload) {
        return { ignore: true, reason: "page-video-mismatch", context };
    }

    return { ignore: false, reason: "", context };
}

function pauseActiveMedia(captureIntent = false) {
    let foundPlayingMedia = false;

    for (const media of document.querySelectorAll("video")) {
        if (!media.paused && !media.ended) {
            foundPlayingMedia = true;
        }

        try {
            media.pause();
        } catch (error) {}
    }

    const playerApi = getPlayerApi();
    try {
        const playerState = typeof playerApi?.getPlayerState === "function" ? playerApi.getPlayerState() : null;
        if (playerState === 1 || playerState === 3) {
            foundPlayingMedia = true;
        }
    } catch (error) {}

    try {
        if (typeof playerApi?.pauseVideo === "function") {
            playerApi.pauseVideo();
        }
    } catch (error) {}

    if (captureIntent && foundPlayingMedia) {
        overlayShouldResume = true;
    }
}

function resumeActiveMedia() {
    const playerApi = getPlayerApi();

    try {
        if (typeof playerApi?.playVideo === "function") {
            playerApi.playVideo();
            return;
        }
    } catch (error) {}

    const media = document.querySelector("video");
    if (!media) {
        return;
    }

    try {
        void media.play();
    } catch (error) {}
}

function startOverlayPauseLock() {
    if (overlayPauseInterval) {
        pauseActiveMedia();
        return;
    }

    overlayShouldResume = false;
    pauseActiveMedia(true);
    overlayPauseInterval = window.setInterval(() => {
        pauseActiveMedia();
    }, 250);
}

function stopOverlayPauseLock() {
    if (overlayPauseInterval) {
        window.clearInterval(overlayPauseInterval);
        overlayPauseInterval = null;
    }
}

function clearSubtitleRetryTimer() {
    if (subtitleRetryTimer) {
        window.clearTimeout(subtitleRetryTimer);
        subtitleRetryTimer = null;
    }
}

function cancelSubtitleFetchLoop() {
    subtitleFetchRunId += 1;
    subtitleFetchLoopActive = false;
}

function closeEventStream() {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
}

function destroyUi() {
    stopOverlayPauseLock();
    clearSubtitleRetryTimer();
    overlayShouldResume = false;

    for (const id of [UI_IDS.badge, UI_IDS.panel, UI_IDS.overlay]) {
        document.getElementById(id)?.remove();
    }

    document.querySelectorAll(".acv-player-host").forEach((element) => {
        element.classList.remove("acv-player-host");
    });
}

function goToYoutubeHome() {
    clearVideoSession({ removeUi: true });
    window.location.href = "https://www.youtube.com/";
}

function hideOverlay() {
    overlayDismissed = true;
    setOverlayVisibility(false);
    if (overlayShouldResume) {
        resumeActiveMedia();
    }
    overlayShouldResume = false;
}

function updateBadge({ tone, label, scoreText }) {
    const ui = ensureUi();
    if (!ui?.badge) {
        return;
    }

    ui.badge.classList.remove("badge-pending", "badge-safe", "badge-caution", "badge-danger", "badge-review", "badge-error");
    ui.badge.classList.add(`badge-${tone}`);

    const labelNode = ui.badge.querySelector(".acv-badge-label");
    const dividerNode = ui.badge.querySelector(".acv-badge-divider");
    const scoreNode = ui.badge.querySelector(".acv-badge-score");

    if (labelNode) {
        labelNode.textContent = label;
    }

    if (dividerNode) {
        dividerNode.hidden = !scoreText;
    }

    if (scoreNode) {
        scoreNode.hidden = !scoreText;
        scoreNode.textContent = scoreText || "";
    }
}

function updatePanelShell(shell) {
    const ui = ensureUi();
    if (!ui?.panel || !ui.panelLabel || !ui.panelTitle || !ui.panelMeta) {
        return;
    }

    if (typeof shell === "string") {
        ui.panel.dataset.tone = "pending";
        ui.panelLabel.textContent = TEXT.panelLabel;
        ui.panelTitle.textContent = TEXT.panelTitle;
        ui.panelMeta.textContent = shell;
        if (ui.panelVideoTitle) {
            ui.panelVideoTitle.textContent = ui.panelVideoTitle.textContent || "";
        }
        if (ui.panelChannelName) {
            ui.panelChannelName.textContent = ui.panelChannelName.textContent || "";
        }
        return;
    }

    ui.panel.dataset.tone = shell?.tone || "pending";
    ui.panelLabel.textContent = shell?.label || TEXT.panelLabel;
    ui.panelTitle.textContent = shell?.title || TEXT.panelTitle;
    ui.panelMeta.textContent = shell?.meta || TEXT.panelWaiting;

    if (ui.panelVideoTitle) {
        ui.panelVideoTitle.innerHTML = shell?.videoTitle ? formatVideoTitle(shell.videoTitle) : "";
    }

    if (ui.panelChannelName) {
        ui.panelChannelName.textContent = shell?.channelName || "";
    }
}

function resetPanelContent() {
    const ui = ensureUi();
    if (!ui?.panelReport || !ui.panelRaw) {
        return;
    }

    ui.panelReport.innerHTML = `<p class="acv-report-empty">${TEXT.reportEmpty}</p>`;
    ui.panelRaw.textContent = TEXT.rawPending;
    updatePanelShell({
        tone: "pending",
        label: TEXT.panelLabel,
        title: TEXT.panelTitle,
        meta: TEXT.panelWaiting,
    });
}

function toNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return null;
}

function firstString(values) {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }

    return "";
}

function decodeHtmlEntities(value) {
    if (typeof value !== "string") {
        return "";
    }

    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.textContent || textarea.innerText || "";
}

function cleanPanelText(value) {
    return firstString([decodeHtmlEntities(value)])
        .replace(/\r\n|\r|\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function formatVideoTitle(value) {
    const text = cleanPanelText(value);
    if (!text) {
        return "";
    }

    const hashMatch = text.match(/^(.*?)(\s*#.+)$/);
    if (hashMatch) {
        return `${hashMatch[1].trim()}<br><br>${hashMatch[2].trim()}`;
    }

    return text;
}

function formatLabel(value) {
    return `${value}`
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^./, (char) => char.toUpperCase());
}

function isScoreKey(key) {
    return /(score|confidence|risk)/i.test(`${key}`);
}

function getAnalysisData(payload) {
    if (
        payload &&
        typeof payload === "object" &&
        payload.data &&
        typeof payload.data === "object" &&
        !Array.isArray(payload.data)
    ) {
        return payload.data;
    }

    return payload && typeof payload === "object" ? payload : {};
}

function getEnvelopeValue(payload, key) {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }

    return payload[key];
}

function getDisplayMetadata(payload) {
    const analysisData = getAnalysisData(payload);

    return {
        title: firstString([analysisData.title, cachedMetadata?.title]),
        channelName: firstString([
            analysisData.channel_name,
            analysisData.channel_title,
            cachedMetadata?.channel_title,
            cachedMetadata?.channelName,
        ]),
        publishedAt: firstString([analysisData.published_at, cachedMetadata?.published_at, cachedMetadata?.publishDate]),
        analyzedAt: firstString([analysisData.analyzed_at]),
        videoId: firstString([
            getEnvelopeValue(payload, "video_id"),
            analysisData.video_id,
            cachedMetadata?.video_id,
            cachedMetadata?.videoId,
        ]),
    };
}

function pickPresentEntries(metadata) {
    return Object.fromEntries(
        Object.entries(metadata).filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value)))
    );
}

function normalizeTags(value) {
    if (Array.isArray(value)) {
        return value
            .filter((tag) => typeof tag === "string" && tag.trim())
            .map((tag) => tag.trim());
    }

    if (typeof value !== "string" || !value.trim()) {
        return [];
    }

    return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function normalizeMetadata(metadata, fallbackVideoId) {
    const source = metadata && typeof metadata === "object" ? metadata : {};
    const videoId = firstString([source.video_id, source.videoId, fallbackVideoId, getVideoId()]);

    return {
        video_id: videoId,
        videoId,
        title: firstString([source.title, source.video_title]),
        description: firstString([source.description, source.shortDescription]),
        channel_id: firstString([source.channel_id, source.channelId]),
        channel_title: firstString([source.channel_title, source.channelName, source.author]),
        published_at: firstString([source.published_at, source.publishDate]),
        tags: normalizeTags(source.tags),
    };
}

function extractChannelIdFromHref(href) {
    if (typeof href !== "string" || !href.trim()) {
        return "";
    }

    try {
        const url = new URL(href, window.location.origin);
        const segments = url.pathname.split("/").filter(Boolean);
        return segments[0] === "channel" ? firstString([segments[1]]) : "";
    } catch (error) {
        return "";
    }
}

function getDomMetadata(fallbackVideoId) {
    const channelLink =
        document.querySelector("ytd-watch-metadata #owner a[href]") ||
        document.querySelector("#owner-name a[href]") ||
        document.querySelector("ytd-channel-name a[href]");
    const channelId = extractChannelIdFromHref(channelLink?.getAttribute("href"));

    return normalizeMetadata(
        {
            video_id: fallbackVideoId,
            title: firstString([
                document.querySelector('meta[name="title"]')?.getAttribute("content"),
                document.querySelector("ytd-watch-metadata h1 yt-formatted-string")?.textContent,
                document.querySelector("h1.title yt-formatted-string")?.textContent,
                document.title.replace(/\s*-\s*YouTube$/, ""),
            ]),
            description: firstString([document.querySelector('meta[name="description"]')?.getAttribute("content")]),
            channel_id: channelId,
            channel_title: firstString([channelLink?.textContent]),
            published_at: firstString([
                document.querySelector('meta[itemprop="datePublished"]')?.getAttribute("content"),
                document.querySelector('meta[itemprop="uploadDate"]')?.getAttribute("content"),
            ]),
            tags: normalizeTags(document.querySelector('meta[name="keywords"]')?.getAttribute("content")),
        },
        fallbackVideoId
    );
}

function mergeMetadata(metadata, fallbackVideoId) {
    return {
        ...pickPresentEntries(normalizeMetadata(cachedMetadata, fallbackVideoId)),
        ...pickPresentEntries(getDomMetadata(fallbackVideoId)),
        ...pickPresentEntries(normalizeMetadata(metadata, fallbackVideoId)),
    };
}

function buildUploadMetadata(metadata, fallbackVideoId) {
    const merged = normalizeMetadata(mergeMetadata(metadata, fallbackVideoId), fallbackVideoId);

    return {
        video_id: firstString([merged.video_id, fallbackVideoId, getVideoId()]),
        title: merged.title || "",
        description: merged.description || "",
        channel_id: merged.channel_id || "",
        channel_title: merged.channel_title || "",
        published_at: merged.published_at || "",
        tags: normalizeTags(merged.tags),
    };
}

function getServerStatusText(data) {
    const analysisData = getAnalysisData(data);

    return firstString([
        analysisData?.trust_level,
        analysisData?.trustLevel,
        analysisData?.status,
        getEnvelopeValue(data, "trust_level"),
        getEnvelopeValue(data, "status"),
    ]);
}

function getTrustLevelLabel(data) {
    const analysisData = getAnalysisData(data);
    const rawTrustLevel = firstString([
        analysisData?.trust_level,
        analysisData?.trustLevel,
        getEnvelopeValue(data, "trust_level"),
    ]);

    if (rawTrustLevel) {
        return rawTrustLevel;
    }

    const rawStatus = getServerStatusText(data);
    const bracketMatch = rawStatus.match(/\(([^)]+)\)/);
    if (bracketMatch?.[1]) {
        return bracketMatch[1].trim();
    }

    const normalized = `${rawStatus || ""}`.toLowerCase();
    if (!normalized) {
        return "";
    }

    if (normalized.includes("\uC548\uC804") || normalized.includes("\uC548\uC2EC") || normalized.includes("safe")) {
        return "\uC548\uC804";
    }

    if (normalized.includes("\uC8FC\uC758") || normalized.includes("caution") || normalized.includes("warn")) {
        return "\uC8FC\uC758";
    }

    if (
        normalized.includes("\uC704\uD5D8") ||
        normalized.includes("\uC758\uC2EC") ||
        normalized.includes("danger") ||
        normalized.includes("unsafe")
    ) {
        return "\uC704\uD5D8";
    }

    return rawStatus;
}

function mapStatusToTone(statusText) {
    const normalized = `${statusText || ""}`.toLowerCase();
    if (!normalized) {
        return "";
    }

    if (
        normalized.includes("\uC758\uC2EC") ||
        normalized.includes("\uC704\uD5D8") ||
        normalized.includes("danger") ||
        normalized.includes("unsafe") ||
        normalized.includes("low")
    ) {
        return "danger";
    }

    if (
        normalized.includes("\uC8FC\uC758") ||
        normalized.includes("caution") ||
        normalized.includes("warn") ||
        normalized.includes("medium") ||
        normalized.includes("moderate")
    ) {
        return "caution";
    }

    if (
        normalized.includes("\uC548\uC2EC") ||
        normalized.includes("\uC548\uC804") ||
        normalized.includes("safe") ||
        normalized.includes("high")
    ) {
        return "safe";
    }

    return "";
}

function hasMeaningfulAnalysis(data) {
    const analysisData = getAnalysisData(data);
    const summary = extractSummary(data);
    const hasClaims = Array.isArray(analysisData?.claims) && analysisData.claims.length > 0;
    const hasReasons = extractReasonItems(data).length > 0;

    return Boolean(summary || hasClaims || hasReasons);
}

function isInvalidAnalysisResult(data) {
    const scoreInfo = extractScoreInfo(data);
    if (scoreInfo.value === null) {
        return false;
    }

    return scoreInfo.value <= 0 && !hasMeaningfulAnalysis(data);
}

function extractScoreInfo(data) {
    const analysisData = getAnalysisData(data);
    const candidates = [
        { key: "risk_score", value: analysisData?.risk_score },
        { key: "danger_score", value: analysisData?.danger_score },
        { key: "score", value: analysisData?.score },
        { key: "confidence", value: analysisData?.confidence },
    ];

    if (analysisData?.result && typeof analysisData.result === "object") {
        candidates.push(
            { key: "risk_score", value: analysisData.result.risk_score },
            { key: "danger_score", value: analysisData.result.danger_score },
            { key: "score", value: analysisData.result.score },
            { key: "confidence", value: analysisData.result.confidence }
        );
    }

    for (const candidate of candidates) {
        const numeric = toNumber(candidate.value);
        if (numeric !== null) {
            return { key: candidate.key, value: numeric };
        }
    }

    return { key: "", value: null };
}

function getDisplayScoreValue(scoreValue) {
    return scoreValue === 100 ? 99 : scoreValue;
}

function inferTone(data) {
    const serverTone = mapStatusToTone(getServerStatusText(data));

    if (isInvalidAnalysisResult(data)) {
        return "review";
    }

    if (serverTone) {
        return serverTone;
    }

    return hasMeaningfulAnalysis(data) ? "review" : "pending";
}

function normalizeReasonItem(item, index) {
    if (typeof item === "string" && item.trim()) {
        return {
            title: `${TEXT.reasonFallbackPrefix}${index + 1}`,
            description: item.trim(),
        };
    }

    if (!item || typeof item !== "object") {
        return null;
    }

    const title =
        firstString([item.title, item.label, item.category, item.reason, item.type]) ||
        `${TEXT.reasonFallbackPrefix}${index + 1}`;

    const description =
        firstString([item.description, item.message, item.detail, item.text, item.summary, item.reason]) ||
        JSON.stringify(item, null, 2);

    if (isScoreKey(title) || isScoreKey(description)) {
        return null;
    }

    return { title, description };
}

function extractReasonItems(data) {
    const analysisData = getAnalysisData(data);
    const containers = [analysisData];
    const rawItems = [];
    const excludedKeys = new Set([
        "event",
        "status",
        "trust_level",
        "trustLevel",
        "details",
        "title",
        "channel_name",
        "channel_title",
        "published_at",
        "analyzed_at",
        "claims",
        "video_id",
        "event_type",
    ]);

    if (analysisData && typeof analysisData === "object") {
        for (const key of ["result", "analysis", "report", "payload", "details"]) {
            const nested = analysisData[key];
            if (nested && typeof nested === "object") {
                containers.push(nested);
            }
        }
    }

    for (const container of containers) {
        if (!container || typeof container !== "object") {
            continue;
        }

        for (const key of ["reasons", "findings", "warnings", "issues", "details", "evidence"]) {
            if (Array.isArray(container[key])) {
                rawItems.push(...container[key]);
            }
        }
    }

    const normalized = rawItems
        .map((item, index) => normalizeReasonItem(item, index))
        .filter(Boolean);

    if (normalized.length) {
        return normalized.slice(0, 6);
    }

    if (!analysisData || typeof analysisData !== "object") {
        return [];
    }

    return Object.entries(analysisData)
        .filter(([key, value]) => !isScoreKey(key) && !excludedKeys.has(key) && value != null && typeof value !== "object")
        .slice(0, 5)
        .map(([key, value]) => ({
            title: formatLabel(key),
            description: `${value}`,
        }));
}

function extractSummary(data) {
    const analysisData = getAnalysisData(data);
    const nestedResult = analysisData?.result && typeof analysisData.result === "object" ? analysisData.result : {};
    const nestedAnalysis = analysisData?.analysis && typeof analysisData.analysis === "object" ? analysisData.analysis : {};

    return firstString([
        analysisData?.details,
        analysisData?.summary,
        analysisData?.message,
        analysisData?.overview,
        analysisData?.verdict,
        analysisData?.status,
        nestedResult.summary,
        nestedResult.message,
        nestedAnalysis.summary,
        nestedAnalysis.message,
    ]);
}

function buildPanelItems(data) {
    const analysisData = getAnalysisData(data);
    const metadata = getDisplayMetadata(data);
    const serverStatus = getServerStatusText(data);
    const items = [];
    const summary = extractSummary(data);
    const analyzedAt = firstString([
        metadata.analyzedAt,
        analysisData?.result?.analyzed_at,
        analysisData?.analysis?.analyzed_at,
    ]);

    if (summary) {
        items.push({ title: TEXT.reasonSummary, description: summary });
    }

    if (serverStatus) {
        items.push({ title: TEXT.reasonTrustLevel, description: serverStatus });
    }

    items.push(...extractReasonItems(data));

    if (Array.isArray(analysisData?.claims)) {
        analysisData.claims.forEach((claim, index) => {
            const description = firstString([
                claim?.reason,
                claim?.claim_text,
                claim?.verification_status,
            ]);

            if (!description) {
                return;
            }

            items.push({
                title: `${TEXT.reasonClaims}${index + 1}`,
                description,
            });
        });
    }

    if (metadata.publishedAt) {
        items.push({ title: TEXT.reasonPublished, description: metadata.publishedAt });
    }

    if (analyzedAt) {
        items.push({ title: TEXT.reasonAnalyzed, description: analyzedAt });
    }

    const deduped = [];
    const seen = new Set();

    for (const item of items) {
        if (!item?.title || !item?.description) {
            continue;
        }

        const key = `${item.title}::${item.description}`;
        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        deduped.push(item);
    }

    return deduped.slice(0, 8);
}

function renderPanel(data) {
    const ui = ensureUi();
    if (!ui?.panelReport || !ui.panelRaw) {
        return;
    }

    const tone = inferTone(data);
    const toneCopy = getToneUiCopy(tone);
    const metadata = getDisplayMetadata(data);

    updatePanelShell({
        tone,
        label: toneCopy.panelLabel,
        title: toneCopy.panelTitle,
        meta: toneCopy.panelMeta,
        videoTitle: metadata.title,
        channelName: metadata.channelName,
    });

    const items = buildPanelItems(data);
    ui.panelReport.innerHTML = "";

    if (!items.length) {
        ui.panelReport.innerHTML = `<p class="acv-report-empty">${TEXT.reportEmpty}</p>`;
    } else {
        for (const item of items) {
            const card = document.createElement("div");
            card.className = "report-item";

            const title = document.createElement("h4");
            title.textContent = item.title;

            const description = document.createElement("p");
            description.textContent = item.description;

            card.appendChild(title);
            card.appendChild(description);
            ui.panelReport.appendChild(card);
        }
    }

    ui.panelRaw.textContent = JSON.stringify(data, null, 2);
}

function renderOverlay(data) {
    const ui = ensureUi();
    if (!ui?.overlay || !ui.modalTitle || !ui.modalSubtitle || !ui.continueButton) {
        return;
    }

    const analysisData = getAnalysisData(data);
    const tone = inferTone(data);
    const toneCopy = getToneUiCopy(tone);
    const scoreInfo = extractScoreInfo(data);
    const displayScoreValue = scoreInfo.value !== null ? getDisplayScoreValue(scoreInfo.value) : null;

    let subtitle = extractSummary(data) || TEXT.modalSummaryFallback;
    if (tone === "review") {
        subtitle = toneCopy.scoreDescription("");
    } else if (displayScoreValue !== null) {
        subtitle = toneCopy.scoreDescription(`${displayScoreValue}${TEXT.points}`);
    } else if (analysisData?.status) {
        subtitle = analysisData.status;
    } else {
        subtitle = toneCopy.panelMeta;
    }

    ui.overlay.dataset.tone = tone;
    ui.modalTitle.innerHTML = toneCopy.overlayTitle;
    ui.modalSubtitle.innerHTML = subtitle;
    ui.continueButton.textContent = ["danger", "caution", "review"].includes(tone)
        ? TEXT.buttonContinueCaution
        : TEXT.buttonContinue;

    if (!overlayDismissed) {
        setOverlayVisibility(true);
    }
}

function renderAnalysis(data) {
    latestResult = data;

    const tone = inferTone(data);
    const toneCopy = getToneUiCopy(tone);
    const trustLevelLabel = getTrustLevelLabel(data);
    const scoreInfo = extractScoreInfo(data);
    const displayScoreValue = scoreInfo.value !== null ? getDisplayScoreValue(scoreInfo.value) : null;
    const scoreText = displayScoreValue !== null && ["danger", "caution", "safe"].includes(tone)
        ? `${displayScoreValue}${TEXT.points}`
        : "";

    updateBadge({
        tone: ["danger", "caution", "safe", "review"].includes(tone) ? tone : "pending",
        label: trustLevelLabel || toneCopy.badgeLabel,
        scoreText,
    });

    renderPanel(data);
    renderOverlay(data);
}

function setPendingState(metaText) {
    updateBadge({ tone: "pending", label: TEXT.pendingBadge, scoreText: "" });
    updatePanelShell(metaText);
}

function setErrorState(message) {
    updateBadge({ tone: "error", label: TEXT.errorBadge, scoreText: "" });
    updatePanelShell(message);
    setOverlayVisibility(false);
}

function scheduleSubtitleRetry(reason, delay = 1200) {
    if (!isLeader || subtitleUploaded || subtitleUploadInFlight || !getActiveVideoId() || subtitleFetchLoopActive) {
        return;
    }

    clearSubtitleRetryTimer();
    subtitleRetryTimer = window.setTimeout(() => {
        subtitleRetryTimer = null;

        if (!isLeader || subtitleUploaded || subtitleUploadInFlight || !getActiveVideoId() || subtitleFetchLoopActive) {
            return;
        }

        console.log("[EXT-CONTENT] Retrying subtitle extraction.", { reason });
        forceSubtitleFetch();
    }, delay);
}

function isRetryableUploadStatus(status) {
    return [408, 425, 429, 500, 502, 503, 504].includes(status);
}

function uploadSubtitle(videoId, data, metadata, attempt = 0) {
    if (subtitleUploaded || subtitleUploadInFlight) {
        return;
    }

    const resolvedMetadata = buildUploadMetadata(metadata, videoId);
    const resolvedMetadataVideoId = firstString([resolvedMetadata.video_id]);
    if (resolvedMetadataVideoId && resolvedMetadataVideoId !== videoId) {
        console.warn("[EXT-CONTENT] Ignoring subtitle upload for mismatched video.", {
            expectedVideoId: videoId,
            resolvedMetadataVideoId,
        });
        cachedSubtitleData = null;
        cachedMetadata = null;
        forceSubtitleFetch();
        return;
    }

    const requestPayload = {
        metadata: resolvedMetadata,
        subtitle_data: data,
    };

    subtitleUploadInFlight = true;
    fetch(`${API_BASE_URL}/api/subtitles/${videoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorBody = await response.text().catch(() => "");
                const error = new Error(
                    errorBody ? `HTTP ${response.status}: ${errorBody}` : `HTTP ${response.status}`
                );
                error.status = response.status;
                error.body = errorBody;
                throw error;
            }

            subtitleUploaded = true;
            subtitleUploadInFlight = false;
            clearSubtitleRetryTimer();
            cancelSubtitleFetchLoop();
            await response.json();
        })
        .catch((error) => {
            console.error("[EXT-CONTENT] Subtitle upload failed:", error);
            subtitleUploadInFlight = false;

            const status = Number(error?.status);
            if (attempt < 2 && isRetryableUploadStatus(status)) {
                const nextDelay = 1500 * (attempt + 1);
                setPendingState(TEXT.waitingSubtitles);
                window.setTimeout(() => {
                    if (!subtitleUploaded && getActiveVideoId() === videoId) {
                        uploadSubtitle(videoId, data, metadata, attempt + 1);
                    }
                }, nextDelay);
                return;
            }

            setErrorState(TEXT.uploadError);
        });
}

function forceSubtitleFetch() {
    if (subtitleFetchLoopActive) {
        return;
    }

    subtitleFetchLoopActive = true;
    const runId = ++subtitleFetchRunId;
    const targetVideoId = getActiveVideoId();
    setPendingState(TEXT.waitingSubtitleButton);

    let attempts = 0;
    const maxAttempts = 60;
    const finish = () => {
        if (runId === subtitleFetchRunId) {
            subtitleFetchLoopActive = false;
        }
    };

    const tryToggle = () => {
        if (
            runId !== subtitleFetchRunId ||
            !isLeader ||
            subtitleUploaded ||
            subtitleUploadInFlight ||
            !getActiveVideoId() ||
            getActiveVideoId() !== targetVideoId
        ) {
            finish();
            return;
        }

        if (isAdShowing()) {
            setPendingState(TEXT.waitingAd);
            setTimeout(tryToggle, 500);
            return;
        }

        const ccButton = document.querySelector(".ytp-subtitles-button");
        const ready =
            ccButton &&
            ccButton.style.display !== "none" &&
            ccButton.getAttribute("aria-pressed") !== null;

        if (!ready) {
            attempts += 1;
            if (attempts >= maxAttempts) {
                finish();
                setErrorState(TEXT.waitingSubtitleButton);
                return;
            }

            setTimeout(tryToggle, 500);
            return;
        }

        const isPressed = ccButton.getAttribute("aria-pressed") === "true";
        if (isPressed) {
            ccButton.click();
            setTimeout(() => {
                if (runId !== subtitleFetchRunId) {
                    return;
                }

                const latestButton = document.querySelector(".ytp-subtitles-button");
                if (latestButton) {
                    latestButton.click();
                }
                finish();
            }, 300);
        } else {
            ccButton.click();
            finish();
        }
    };

    setTimeout(tryToggle, 500);
}

function connectSSE(videoId) {
    if (eventSource) {
        eventSource.close();
    }

    let didComplete = false;

    setPendingState(TEXT.waitingMeta);
    eventSource = new EventSource(`${API_BASE_URL}/api/stream/${videoId}`);

    eventSource.addEventListener("extract_command", () => {
        isLeader = true;
        console.log("[EXT-CONTENT] extract_command received.", { videoId, hasCachedSubtitle: Boolean(cachedSubtitleData) });
        setPendingState(TEXT.waitingSubtitles);

        if (cachedSubtitleData && !subtitleUploaded) {
            uploadSubtitle(videoId, cachedSubtitleData, cachedMetadata);
        } else {
            forceSubtitleFetch();
        }
    });

    eventSource.addEventListener("waiting", () => {
        setPendingState(TEXT.waitingFollower);
    });

    eventSource.addEventListener("progress", (event) => {
        try {
            const data = JSON.parse(event.data);
            const analysisData = getAnalysisData(data);
            setPendingState(firstString([analysisData?.status, data?.status, TEXT.waitingMeta]));
        } catch (error) {
            console.error("[EXT-CONTENT] Failed to parse progress payload:", error);
        }
    });

    eventSource.addEventListener("complete", (event) => {
        didComplete = true;

        try {
            const data = JSON.parse(event.data);
            console.log("[EXT-CONTENT] Final analysis received");
            console.dir(data);
            renderAnalysis(data);
        } catch (error) {
            console.error("[EXT-CONTENT] Failed to parse complete payload:", error);
            setErrorState(TEXT.streamError);
        } finally {
            eventSource?.close();
        }
    });

    eventSource.addEventListener("error", () => {
        if (didComplete) {
            return;
        }

        console.error("[EXT-CONTENT] SSE connection error");
        setErrorState(TEXT.streamError);
    });
}

function resetState() {
    cancelSubtitleFetchLoop();
    cachedSubtitleData = null;
    cachedMetadata = null;
    isLeader = false;
    subtitleUploaded = false;
    subtitleUploadInFlight = false;
    latestResult = null;
    overlayDismissed = false;
    clearSubtitleRetryTimer();

    resetPanelContent();
    setPanelVisibility(false);
    setOverlayVisibility(false);
    updateBadge({ tone: "pending", label: TEXT.pendingBadge, scoreText: "" });
}

function clearVideoSession(options = {}) {
    const { removeUi = false } = options;

    closeEventStream();
    currentVideoId = null;

    if (removeUi) {
        cancelSubtitleFetchLoop();
        cachedSubtitleData = null;
        cachedMetadata = null;
        isLeader = false;
        subtitleUploaded = false;
        subtitleUploadInFlight = false;
        latestResult = null;
        overlayDismissed = false;
        destroyUi();
        return;
    }

    resetState();
}

function init() {
    if (!isWatchPage()) {
        clearVideoSession({ removeUi: true });
        return;
    }

    const videoId = getVideoId();

    ensureUi();

    if (videoId === currentVideoId && eventSource && eventSource.readyState !== EventSource.CLOSED) {
        return;
    }

    currentVideoId = videoId;
    resetState();
    inject();
    connectSSE(videoId);
}

init();
window.addEventListener("yt-navigate-finish", init);
window.addEventListener("beforeunload", closeEventStream);

function handleBridgeMessage(message, source = "window") {
    if (!message || typeof message !== "object") {
        return;
    }

    if (message?.type === "YT_SUB_RETRY_HINT") {
        const activeVideoId = getActiveVideoId();
        const relatedVideoIds = [
            message?.requestVideoId,
            message?.playerVideoId,
            message?.pageVideoId,
        ].filter((value) => typeof value === "string" && value.trim());

        if (activeVideoId && relatedVideoIds.length > 0 && !relatedVideoIds.includes(activeVideoId)) {
            return;
        }

        if (message?.reason === "ad-playing") {
            setPendingState(TEXT.waitingAd);
            scheduleSubtitleRetry("ad-playing", 1500);
            return;
        }

        scheduleSubtitleRetry(message?.reason || "inject-hint", 900);
        return;
    }

    if (message?.type !== "YT_SUB_DATA") {
        return;
    }

    const filterResult = shouldIgnoreSubtitleMessage(message);
    if (filterResult.ignore) {
        if (filterResult.reason === "ad-playing") {
            setPendingState(TEXT.waitingAd);
            scheduleSubtitleRetry("ignored-ad-payload", 1500);
        }

        console.warn("[EXT-CONTENT] Ignored subtitle payload.", filterResult);
        return;
    }

    const videoId = filterResult.context.activeVideoId;
    cachedSubtitleData = message.payload;
    cachedMetadata = mergeMetadata(message.metadata, videoId);
    clearSubtitleRetryTimer();
    cancelSubtitleFetchLoop();
    console.log("[EXT-CONTENT] Subtitle payload received.", {
        source,
        videoId,
        isLeader,
        hasMetadata: Boolean(cachedMetadata?.title || cachedMetadata?.channel_title),
    });

    updatePanelShell(cachedMetadata?.title || TEXT.subtitleCached);

    if (isLeader && !subtitleUploaded && videoId) {
        uploadSubtitle(videoId, cachedSubtitleData, cachedMetadata);
    }
}

window.addEventListener("message", (event) => {
    if (event.source !== window) {
        return;
    }

    handleBridgeMessage(event.data, "window");
});
