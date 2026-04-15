(function() {
    console.log("%c[EXT-INJECT] Interceptor Active", "color: blue; font-weight: bold;");

    const metadataCache = Object.create(null);
    const playerState = {
        stableVideoId: "",
        syncTimer: null,
        observer: null,
        observedPlayer: null,
        pendingSubtitlePayload: null,
    };

    function isNonEmptyString(value) {
        return typeof value === "string" && value.trim().length > 0;
    }

    function firstNonEmptyString(values) {
        for (const value of values) {
            if (isNonEmptyString(value)) {
                return value.trim();
            }
        }

        return "";
    }

    function safeCall(fn, fallback = null) {
        try {
            return fn();
        } catch (error) {
            return fallback;
        }
    }

    function extractFromPlayerResponse(playerResponse) {
        try {
            if (!playerResponse || !playerResponse.videoDetails) {
                return null;
            }

            const details = playerResponse.videoDetails;
            const microformat = playerResponse.microformat?.playerMicroformatRenderer || {};

            return {
                videoId: details.videoId || "",
                title: details.title || "",
                description: details.shortDescription || "",
                channel_id: details.channelId || "",
                channel_title: details.author || "",
                published_at: microformat.publishDate || "",
                tags: Array.isArray(details.keywords) ? details.keywords : [],
            };
        } catch (error) {
            console.error("[EXT-INJECT] Failed to extract player response metadata", error);
            return null;
        }
    }

    function extractVideoId(urlStr) {
        if (!isNonEmptyString(urlStr)) {
            return "";
        }

        try {
            const url = new URL(urlStr.startsWith("http") ? urlStr : window.location.origin + urlStr);
            return url.searchParams.get("v") || "";
        } catch (error) {
            return "";
        }
    }

    function getUrlFromFetchArgs(args) {
        const input = args?.[0];
        if (typeof input === "string") {
            return input;
        }

        if (input && typeof input.url === "string") {
            return input.url;
        }

        return "";
    }

    function getPageVideoId() {
        return safeCall(() => new URLSearchParams(window.location.search).get("v") || "", "");
    }

    function getPlayerApi() {
        return safeCall(() => document.getElementById("movie_player"), null);
    }

    function getCurrentPlayerResponse() {
        const playerResponse = safeCall(() => {
            const player = getPlayerApi();
            if (player && typeof player.getPlayerResponse === "function") {
                return player.getPlayerResponse();
            }

            return null;
        }, null);

        return playerResponse || window.ytInitialPlayerResponse || null;
    }

    function getCurrentPlayerVideoId() {
        const response = getCurrentPlayerResponse();
        const extracted = extractFromPlayerResponse(response);
        if (isNonEmptyString(extracted?.videoId)) {
            return extracted.videoId;
        }

        const playerVideoId = safeCall(() => {
            const player = getPlayerApi();
            const videoData = typeof player?.getVideoData === "function" ? player.getVideoData() : null;
            return videoData?.video_id || videoData?.videoId || "";
        }, "");

        return isNonEmptyString(playerVideoId) ? playerVideoId : "";
    }

    function isVisible(node) {
        if (!node) {
            return false;
        }

        const style = safeCall(() => window.getComputedStyle(node), null);
        if (!style) {
            return false;
        }

        return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    }

    function isAdShowing() {
        try {
            const player = getPlayerApi();
            if (!player) {
                return false;
            }

            const adClassNames = ["ad-showing", "ad-interrupting", "ad-created", "ad-playing"];
            if (adClassNames.some((className) => player.classList?.contains(className))) {
                return true;
            }

            const adSelectors = [
                ".ytp-ad-player-overlay",
                ".ytp-ad-preview-container",
                ".ytp-ad-skip-button-container",
                ".ytp-ad-text",
                ".video-ads.ytp-ad-module",
            ];

            for (const selector of adSelectors) {
                const node =
                    safeCall(() => player.querySelector(selector), null) ||
                    safeCall(() => document.querySelector(selector), null);

                if (isVisible(node)) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error("[EXT-INJECT] Failed to determine ad state", error);
            return false;
        }
    }

    function resetMetadataForVideo(videoId) {
        if (isNonEmptyString(videoId) && metadataCache[videoId]) {
            delete metadataCache[videoId];
        }
    }

    function pruneMetadataCache(keepVideoIds = []) {
        const keepSet = new Set(keepVideoIds.filter(isNonEmptyString));
        for (const videoId of Object.keys(metadataCache)) {
            if (!keepSet.has(videoId)) {
                delete metadataCache[videoId];
            }
        }
    }

    function shouldSuppressFetchError(url) {
        return /doubleclick\.net|youtube\.com\/pagead\//i.test(`${url || ""}`);
    }

    function normalizeTagList(value) {
        if (Array.isArray(value)) {
            return value.filter(isNonEmptyString).map((item) => item.trim());
        }

        if (!isNonEmptyString(value)) {
            return [];
        }

        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function extractChannelIdFromHref(href) {
        if (!isNonEmptyString(href)) {
            return "";
        }

        try {
            const url = new URL(href, window.location.origin);
            const parts = url.pathname.split("/").filter(Boolean);
            if (parts[0] === "channel" && isNonEmptyString(parts[1])) {
                return parts[1];
            }
        } catch (error) {}

        return "";
    }

    function getDomFallbackMetadata(targetVideoId) {
        const pageVideoId = getPageVideoId();
        const initialMetadata = extractFromPlayerResponse(window.ytInitialPlayerResponse);
        const canUseInitialMetadata =
            initialMetadata &&
            [targetVideoId, pageVideoId].filter(isNonEmptyString).includes(initialMetadata.videoId);
        const channelLink =
            safeCall(() => document.querySelector("ytd-watch-metadata #owner a[href]"), null) ||
            safeCall(() => document.querySelector("#owner-name a[href]"), null) ||
            safeCall(() => document.querySelector("ytd-channel-name a[href]"), null);

        return {
            videoId: firstNonEmptyString([targetVideoId, pageVideoId, initialMetadata?.videoId]),
            title: firstNonEmptyString([
                safeCall(() => document.querySelector('meta[name="title"]')?.getAttribute("content"), ""),
                safeCall(() => document.querySelector('meta[property="og:title"]')?.getAttribute("content"), ""),
                safeCall(() => document.querySelector("ytd-watch-metadata h1 yt-formatted-string")?.textContent, ""),
                safeCall(() => document.querySelector("h1.title yt-formatted-string")?.textContent, ""),
                safeCall(() => document.title.replace(/\s*-\s*YouTube$/, ""), ""),
                canUseInitialMetadata ? initialMetadata.title : "",
            ]),
            description: firstNonEmptyString([
                safeCall(() => document.querySelector('meta[name="description"]')?.getAttribute("content"), ""),
                safeCall(() => document.querySelector('meta[property="og:description"]')?.getAttribute("content"), ""),
                canUseInitialMetadata ? initialMetadata.description : "",
            ]),
            channel_id: firstNonEmptyString([
                extractChannelIdFromHref(safeCall(() => channelLink?.getAttribute("href"), "")),
                canUseInitialMetadata ? initialMetadata.channel_id : "",
            ]),
            channel_title: firstNonEmptyString([
                safeCall(() => channelLink?.textContent, ""),
                safeCall(() => document.querySelector('link[itemprop="name"]')?.getAttribute("content"), ""),
                canUseInitialMetadata ? initialMetadata.channel_title : "",
            ]),
            published_at: firstNonEmptyString([
                safeCall(() => document.querySelector('meta[itemprop="datePublished"]')?.getAttribute("content"), ""),
                safeCall(() => document.querySelector('meta[itemprop="uploadDate"]')?.getAttribute("content"), ""),
                canUseInitialMetadata ? initialMetadata.published_at : "",
            ]),
            tags: normalizeTagList(
                safeCall(() => document.querySelector('meta[name="keywords"]')?.getAttribute("content"), "") ||
                    (canUseInitialMetadata ? initialMetadata.tags : [])
            ),
        };
    }

    function rememberPendingSubtitlePayload(data, requestVideoId, pageVideoId, playerVideoId) {
        playerState.pendingSubtitlePayload = {
            data,
            requestVideoId: requestVideoId || "",
            pageVideoId: pageVideoId || "",
            playerVideoId: playerVideoId || "",
            timestamp: Date.now(),
        };
    }

    function clearPendingSubtitlePayload() {
        playerState.pendingSubtitlePayload = null;
    }

    function updateStableVideoId(videoId, reason = "") {
        if (!isNonEmptyString(videoId)) {
            return "";
        }

        if (playerState.stableVideoId !== videoId) {
            console.log(
                `%c[EXT-INJECT] Main video confirmed [${videoId}]${reason ? ` (${reason})` : ""}`,
                "color: #4caf50;"
            );
        }

        playerState.stableVideoId = videoId;
        return videoId;
    }

    function isMainVideoCandidate(videoId, pageVideoId = getPageVideoId()) {
        if (!isNonEmptyString(videoId)) {
            return false;
        }

        return [pageVideoId, playerState.stableVideoId].filter(isNonEmptyString).includes(videoId);
    }

    function isMainVideoRequest(requestVideoId, pageVideoId = getPageVideoId()) {
        return isMainVideoCandidate(requestVideoId, pageVideoId);
    }

    function getProvisionalMainVideoId(requestVideoId, pageVideoId = getPageVideoId(), playerVideoId = getCurrentPlayerVideoId()) {
        if (isNonEmptyString(requestVideoId) && isNonEmptyString(pageVideoId) && requestVideoId === pageVideoId) {
            return requestVideoId;
        }

        if (
            !isNonEmptyString(requestVideoId) &&
            isNonEmptyString(pageVideoId) &&
            (!isNonEmptyString(playerVideoId) || playerVideoId === pageVideoId || isAdShowing())
        ) {
            return pageVideoId;
        }

        if (isNonEmptyString(requestVideoId) && isMainVideoCandidate(requestVideoId, pageVideoId)) {
            return requestVideoId;
        }

        return "";
    }

    function flushPendingSubtitlePayload(reason = "flush") {
        const pending = playerState.pendingSubtitlePayload;
        if (!pending || isAdShowing()) {
            return false;
        }

        const confirmedVideoId = syncMainVideoState(`${reason}-sync`);
        const candidateVideoId = pending.requestVideoId || pending.pageVideoId || confirmedVideoId;
        if (!isMainVideoCandidate(candidateVideoId, pending.pageVideoId || getPageVideoId())) {
            clearPendingSubtitlePayload();
            return false;
        }

        clearPendingSubtitlePayload();
        console.log(`%c[EXT-INJECT] Flushing deferred subtitle payload [${candidateVideoId}]`, "color: #8bc34a;");
        postSubtitleData(pending.data, pending.requestVideoId);
        return true;
    }

    function syncMainVideoState(reason = "sync") {
        if (isAdShowing()) {
            return playerState.stableVideoId || "";
        }

        const pageVideoId = getPageVideoId();
        const playerVideoId = getCurrentPlayerVideoId();

        if (isNonEmptyString(pageVideoId) && isNonEmptyString(playerVideoId) && pageVideoId === playerVideoId) {
            const stableVideoId = updateStableVideoId(playerVideoId, reason);
            flushPendingSubtitlePayload(reason);
            return stableVideoId;
        }

        if (isNonEmptyString(playerVideoId) && playerState.stableVideoId === playerVideoId) {
            flushPendingSubtitlePayload(reason);
            return playerVideoId;
        }

        if (isNonEmptyString(pageVideoId) && playerState.stableVideoId === pageVideoId) {
            flushPendingSubtitlePayload(reason);
            return pageVideoId;
        }

        return "";
    }

    function schedulePlayerSync(reason = "sync", delay = 0) {
        if (playerState.syncTimer) {
            window.clearTimeout(playerState.syncTimer);
        }

        playerState.syncTimer = window.setTimeout(() => {
            playerState.syncTimer = null;
            syncMainVideoState(reason);
            attachPlayerObserver();
        }, delay);
    }

    function attachPlayerObserver() {
        const player = getPlayerApi();
        if (!player || player === playerState.observedPlayer) {
            return;
        }

        if (playerState.observer) {
            playerState.observer.disconnect();
        }

        playerState.observer = new MutationObserver(() => {
            schedulePlayerSync("player-mutation", 100);
        });
        playerState.observer.observe(player, {
            attributes: true,
            attributeFilter: ["class"],
        });
        playerState.observedPlayer = player;
    }

    function cacheMetadata(playerResponse, reason = "player-response") {
        const data = extractFromPlayerResponse(playerResponse);
        if (!isNonEmptyString(data?.videoId)) {
            return null;
        }

        const previousStableVideoId = playerState.stableVideoId;
        if (isNonEmptyString(previousStableVideoId) && previousStableVideoId !== data.videoId && !isAdShowing()) {
            resetMetadataForVideo(previousStableVideoId);
        }

        resetMetadataForVideo(data.videoId);
        metadataCache[data.videoId] = data;

        const pageVideoId = getPageVideoId();
        if (!isAdShowing() && (!isNonEmptyString(pageVideoId) || pageVideoId === data.videoId)) {
            updateStableVideoId(data.videoId, reason);
            pruneMetadataCache([data.videoId, pageVideoId]);
        }

        console.log(`%c[EXT-INJECT] Metadata cache refreshed [${data.videoId}]`, "color: orange;");
        return data;
    }

    function getFallbackMetadata(targetVideoId) {
        const responseCandidates = [
            safeCall(() => {
                const player = getPlayerApi();
                return player && typeof player.getPlayerResponse === "function" ? player.getPlayerResponse() : null;
            }, null),
            window.ytInitialPlayerResponse || null,
        ];

        try {
            for (const response of responseCandidates) {
                const data = extractFromPlayerResponse(response);
                if (data && data.videoId === targetVideoId) {
                    return data;
                }
            }
        } catch (error) {
            console.error("[EXT-INJECT] Failed to resolve fallback metadata", error);
        }

        const domFallback = getDomFallbackMetadata(targetVideoId);
        return {
            videoId: firstNonEmptyString([targetVideoId, domFallback.videoId]),
            title: domFallback.title || "",
            description: domFallback.description || "",
            channel_id: domFallback.channel_id || "",
            channel_title: domFallback.channel_title || "",
            published_at: domFallback.published_at || "",
            tags: normalizeTagList(domFallback.tags),
        };
    }

    function postControlMessage(type, payload = {}) {
        const message = {
            type,
            timestamp: Date.now(),
            ...payload,
        };

        try {
            window.postMessage(message, "*");
        } catch (error) {
            console.error("[EXT-INJECT] Failed to dispatch control message", error);
        }
    }

    function parseXmlTimeToMs(value) {
        if (!isNonEmptyString(value)) {
            return 0;
        }

        const trimmed = value.trim();
        const secondsMatch = trimmed.match(/^(\d+(?:\.\d+)?)s$/i);
        if (secondsMatch) {
            return Math.round(Number(secondsMatch[1]) * 1000);
        }

        const clockMatch = trimmed.match(/^(\d+):(\d{2}):(\d{2})(?:\.(\d+))?$/);
        if (clockMatch) {
            const hours = Number(clockMatch[1]) || 0;
            const minutes = Number(clockMatch[2]) || 0;
            const seconds = Number(clockMatch[3]) || 0;
            const fraction = clockMatch[4] ? Number(`0.${clockMatch[4]}`) : 0;
            return Math.round(((hours * 3600) + (minutes * 60) + seconds + fraction) * 1000);
        }

        const numeric = Number(trimmed);
        if (Number.isFinite(numeric)) {
            return Math.round(numeric * 1000);
        }

        return 0;
    }

    function buildSegmentEvent(text, startMs, durationMs) {
        return {
            tStartMs: Math.max(0, startMs || 0),
            dDurationMs: Math.max(0, durationMs || 0),
            segs: [{ utf8: text }],
        };
    }

    function parseTimedTextXml(text) {
        const xml = safeCall(() => new DOMParser().parseFromString(text, "text/xml"), null);
        if (!xml) {
            return null;
        }

        const parserError = xml.querySelector("parsererror");
        if (parserError) {
            return null;
        }

        const timedTextNodes = [...xml.querySelectorAll("text")];
        const paragraphNodes = [...xml.querySelectorAll("p")];
        const sourceNodes = timedTextNodes.length ? timedTextNodes : paragraphNodes;
        if (!sourceNodes.length) {
            return null;
        }

        const events = sourceNodes
            .map((node, index) => {
                const content = (node.textContent || "").replace(/\s+/g, " ").trim();
                if (!content) {
                    return null;
                }

                const startAttr = node.getAttribute("start") || node.getAttribute("begin") || "0";
                const durAttr = node.getAttribute("dur");
                const endAttr = node.getAttribute("end");
                const startMs = parseXmlTimeToMs(startAttr);
                const durationMs = durAttr
                    ? parseXmlTimeToMs(durAttr)
                    : Math.max(0, parseXmlTimeToMs(endAttr) - startMs) || 2000;

                return buildSegmentEvent(content, startMs || index * 2000, durationMs);
            })
            .filter(Boolean);

        if (!events.length) {
            return null;
        }

        return {
            format: "xml",
            rawText: text,
            text: events.map((event) => event.segs[0].utf8).join(" "),
            events,
        };
    }

    function parseTimedTextPayload(rawText) {
        const normalizedText = typeof rawText === "string" ? rawText.trim() : "";
        if (!normalizedText) {
            return null;
        }

        const firstChar = normalizedText[0];
        if (firstChar === "{" || firstChar === "[") {
            return JSON.parse(normalizedText);
        }

        if (normalizedText.includes("<")) {
            const xmlPayload = parseTimedTextXml(normalizedText);
            if (xmlPayload) {
                return xmlPayload;
            }
        }

        return {
            format: "text",
            rawText: normalizedText,
            text: normalizedText,
            events: [buildSegmentEvent(normalizedText, 0, 0)],
        };
    }

    function postSubtitleData(data, requestVideoId, attempt = 0) {
        const pageVideoId = getPageVideoId();
        const playerVideoId = getCurrentPlayerVideoId();
        const adShowing = isAdShowing();
        const mainVideoRequest = isMainVideoRequest(requestVideoId, pageVideoId);
        const provisionalVideoId = getProvisionalMainVideoId(requestVideoId, pageVideoId, playerVideoId);

        if (adShowing) {
            if (mainVideoRequest) {
                console.log("[EXT-INJECT] Allowing main-video subtitle payload during ad playback.");
            } else if (isMainVideoCandidate(requestVideoId, pageVideoId) || (!isNonEmptyString(requestVideoId) && isMainVideoCandidate(pageVideoId, pageVideoId))) {
                console.log("[EXT-INJECT] Deferring main-video subtitle payload until ad playback ends.");
                rememberPendingSubtitlePayload(data, requestVideoId, pageVideoId, playerVideoId);
                postControlMessage("YT_SUB_RETRY_HINT", {
                    reason: "ad-playing",
                    requestVideoId: requestVideoId || "",
                    pageVideoId,
                    playerVideoId,
                });
                return;
            } else {
                console.log("[EXT-INJECT] Skip subtitle payload during ad playback.");
                postControlMessage("YT_SUB_RETRY_HINT", {
                    reason: "ad-playing",
                    requestVideoId: requestVideoId || "",
                    pageVideoId,
                    playerVideoId,
                });
                return;
            }
        }

        if (
            isNonEmptyString(requestVideoId) &&
            isNonEmptyString(playerVideoId) &&
            requestVideoId !== playerVideoId &&
            !mainVideoRequest
        ) {
            console.warn("[EXT-INJECT] Mismatched VideoId", {
                requestVideoId,
                playerVideoId,
                pageVideoId,
            });
            return;
        }

        let confirmedVideoId = syncMainVideoState("subtitle-dispatch");
        if (!isNonEmptyString(confirmedVideoId) && isNonEmptyString(provisionalVideoId)) {
            confirmedVideoId = provisionalVideoId;
            console.log("[EXT-INJECT] Using provisional main video id for subtitle payload.", {
                confirmedVideoId,
                requestVideoId,
                pageVideoId,
                playerVideoId,
            });
        }

        if (!isNonEmptyString(confirmedVideoId)) {
            if (attempt >= 4) {
                console.warn("[EXT-INJECT] Subtitle payload dropped before main video was confirmed.", {
                    requestVideoId,
                    pageVideoId,
                    playerVideoId,
                });
                postControlMessage("YT_SUB_RETRY_HINT", {
                    reason: "main-video-not-confirmed",
                    requestVideoId: requestVideoId || "",
                    pageVideoId,
                    playerVideoId,
                });
                return;
            }

            window.setTimeout(() => {
                postSubtitleData(data, requestVideoId, attempt + 1);
            }, 150 * (attempt + 1));
            return;
        }

        if (isNonEmptyString(requestVideoId) && confirmedVideoId !== requestVideoId) {
            console.warn("[EXT-INJECT] Subtitle payload blocked until main video is confirmed.", {
                requestVideoId,
                confirmedVideoId,
                playerVideoId,
                pageVideoId,
            });
            postControlMessage("YT_SUB_RETRY_HINT", {
                reason: "subtitle-video-mismatch",
                requestVideoId: requestVideoId || "",
                pageVideoId,
                playerVideoId,
                confirmedVideoId,
            });
            return;
        }

        const resolvedVideoId = requestVideoId || confirmedVideoId || playerVideoId || pageVideoId || "";
        if (!isNonEmptyString(resolvedVideoId)) {
            console.warn("[EXT-INJECT] Subtitle payload dropped because no resolved video id was available.");
            return;
        }

        const finalMetadata =
            metadataCache[resolvedVideoId] ||
            metadataCache[confirmedVideoId] ||
            getFallbackMetadata(resolvedVideoId);
        const message = {
            type: "YT_SUB_DATA",
            payload: data,
            metadata: finalMetadata,
            requestVideoId: requestVideoId || "",
            resolvedVideoId,
            pageVideoId: pageVideoId || "",
            playerVideoId: playerVideoId || "",
            isAd: false,
            timestamp: Date.now(),
        };

        try {
            window.postMessage(message, "*");
        } catch (error) {
            console.error("[EXT-INJECT] Failed to dispatch subtitle payload", error);
        }
    }

    async function handleTimedTextResponse(response, videoId, source) {
        try {
            const clone = response.clone();
            const rawText = await clone.text();
            const data = parseTimedTextPayload(rawText);
            if (!data) {
                console.warn(`[EXT-INJECT] Empty timedtext payload (${source})`, { videoId });
                postControlMessage("YT_SUB_RETRY_HINT", {
                    reason: "empty-timedtext",
                    requestVideoId: videoId || "",
                    pageVideoId: getPageVideoId(),
                    playerVideoId: getCurrentPlayerVideoId(),
                });
                return;
            }
            postSubtitleData(data, videoId);
        } catch (error) {
            console.error(`[EXT-INJECT] Timedtext Parse Error (${source})`, error);
            postControlMessage("YT_SUB_RETRY_HINT", {
                reason: "timedtext-parse-error",
                requestVideoId: videoId || "",
                pageVideoId: getPageVideoId(),
                playerVideoId: getCurrentPlayerVideoId(),
            });
        }
    }

    function handlePlayerResponsePayload(payload, source) {
        try {
            cacheMetadata(payload, source);
            schedulePlayerSync(source, 0);
        } catch (error) {
            console.error("[EXT-INJECT] Failed to process player response payload", error);
        }
    }

    function initializeStateWatchers() {
        if (initializeStateWatchers.initialized) {
            return;
        }

        initializeStateWatchers.initialized = true;

        window.addEventListener("yt-navigate-start", () => {
            playerState.stableVideoId = "";
            clearPendingSubtitlePayload();
            schedulePlayerSync("yt-navigate-start", 0);
        });

        for (const eventName of ["yt-navigate-finish", "yt-page-data-updated", "popstate", "hashchange"]) {
            window.addEventListener(eventName, () => {
                schedulePlayerSync(eventName, 100);
            });
        }

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                schedulePlayerSync("visibilitychange", 100);
            }
        });

        attachPlayerObserver();
        schedulePlayerSync("bootstrap", 0);
    }

    if (window.ytInitialPlayerResponse) {
        handlePlayerResponsePayload(window.ytInitialPlayerResponse, "ytInitialPlayerResponse");
    } else {
        schedulePlayerSync("no-initial-player-response", 0);
    }

    initializeStateWatchers();

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = getUrlFromFetchArgs(args);

        let response;
        try {
            response = await originalFetch(...args);
        } catch (error) {
            if (!shouldSuppressFetchError(url)) {
                console.error("[EXT-INJECT] Fetch failed", { url, error });
            }
            throw error;
        }

        try {
            if (isNonEmptyString(url) && url.includes("/youtubei/v1/player")) {
                const clone = response.clone();
                clone
                    .json()
                    .then((data) => handlePlayerResponsePayload(data, "fetch-player"))
                    .catch((error) => console.error("[EXT-INJECT] Fetch Player Error", error));
                return response;
            }

            if (isNonEmptyString(url) && url.includes("api/timedtext")) {
                const videoId = extractVideoId(url);
                console.log(`%c[EXT-INJECT] Subtitle Fetch Detected! [${videoId || "unknown"}]`, "color: green;");
                void handleTimedTextResponse(response, videoId, "Fetch");
            }
        } catch (error) {
            console.error("[EXT-INJECT] Fetch intercept error", error);
        }

        return response;
    };

    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    XHR.open = function(method, url) {
        this._url = typeof url === "string" ? url : "";
        return open.apply(this, arguments);
    };

    XHR.send = function() {
        this.addEventListener("load", function() {
            try {
                if (isNonEmptyString(this._url) && this._url.includes("/youtubei/v1/player")) {
                    const data = JSON.parse(this.responseText);
                    handlePlayerResponsePayload(data, "xhr-player");
                    return;
                }

                if (isNonEmptyString(this._url) && this._url.includes("api/timedtext")) {
                    const videoId = extractVideoId(this._url);
                    console.log(`%c[EXT-INJECT] Subtitle XHR Detected! [${videoId || "unknown"}]`, "color: green;");

                    const data = parseTimedTextPayload(this.responseText);
                    if (!data) {
                        console.warn("[EXT-INJECT] Empty timedtext payload (XHR)", { videoId });
                        postControlMessage("YT_SUB_RETRY_HINT", {
                            reason: "empty-timedtext",
                            requestVideoId: videoId || "",
                            pageVideoId: getPageVideoId(),
                            playerVideoId: getCurrentPlayerVideoId(),
                        });
                        return;
                    }
                    postSubtitleData(data, videoId);
                }
            } catch (error) {
                console.error("[EXT-INJECT] XHR intercept error", error);
                postControlMessage("YT_SUB_RETRY_HINT", {
                    reason: "timedtext-parse-error",
                    requestVideoId: extractVideoId(this._url || ""),
                    pageVideoId: getPageVideoId(),
                    playerVideoId: getCurrentPlayerVideoId(),
                });
            }
        });

        try {
            return send.apply(this, arguments);
        } catch (error) {
            console.error("[EXT-INJECT] XHR send failed", error);
            throw error;
        }
    };
})();
