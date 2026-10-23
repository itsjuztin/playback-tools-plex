# Playback Tools for Plex

> An all-in-one automation and control companion for Plex Web. Silent intro and credit skipping, next episode countdown bypass, 1-click Picture-in-Picture, and keyboard speed controls.

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Privacy: 100% Local](https://img.shields.io/badge/Privacy-100%25%20Local-green.svg)](#privacy--security)

---

## Features

- **Silent & Invisible Auto-Skip:** Automatically triggers "Skip Intro" and "Skip Credits" using synthetic mouse dispatch with zero intrusive banners or delay.
- **Next Episode Countdown Bypass:** Automatically launches the next episode immediately, eliminating the 10-second post-play wait.
- **Picture-in-Picture (PiP):** Injects a native 1-click floating window button directly into Plex's player controls.
- **Playback Speed Hotkeys:**
  - `[` — Decrease speed (-0.1x)
  - `]` — Increase speed (+0.1x)
  - `\` — Reset speed to 1.0x
  - Clean on-screen HUD badge confirming your active speed.
- **Always 1.0x Baseline:** Playback speed strictly resets to a clean 1.0x baseline on every new video so you're never surprised by fast-forwarded dialogue.
- **Universal Plex Support:** Operates seamlessly across `https://app.plex.tv` and local instances (`localhost:32400`, `127.0.0.1:32400`).
- **Independent Toggles:** Every feature can be toggled on or off individually from the extension popup.

---

## Installation

### Manual Install (Developer Mode)
1. Clone or download this repository.
2. In Google Chrome, go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** (top-left) and select this folder.

---

## Privacy & Security

- **100% Client-Side:** Runs locally in your browser DOM.
- **Zero External Connections:** Does not communicate with external servers, telemetry services, or analytics trackers.

---

## The Developer Utility Suite

Check out the other tools in this open-source suite:
- [**Volume Booster & Equalizer for Tabs**](https://github.com/itsjuztin/volume-booster-tab) — Boost tab audio up to 1000% with soft-limiter anti-clipping and 3-band EQ.
- [**Playback Tools for YouTube**](https://github.com/itsjuztin/playback-tools-youtube) — Forces 4K/top resolution, auto-guards against bitrate drops, and cleans up Shorts & end cards.
- [**Independent Tab Zoom**](https://github.com/itsjuztin/independent-tab-zoom) — Per-tab isolated zoom control without syncing across the same domain.

---

## License

[MIT](LICENSE) © 2026 Justin
