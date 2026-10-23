/**
 * Playback Tools for Plex - Content Script
 * Handles silent auto-skipping, countdown bypass, PiP, and speed hotkeys.
 */

const DEFAULT_SETTINGS = {
  skipIntro: true,
  skipCredits: true,
  bypassCountdown: true,
  enablePiP: true,
  enableSpeedHotkeys: true
};

let settings = { ...DEFAULT_SETTINGS };
let hudTimeout = null;

function getHudElement() {
  let hud = document.getElementById('plexflow-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'plexflow-hud';
    document.body.appendChild(hud);
  }
  return hud;
}

function showHud(text) {
  const hud = getHudElement();
  hud.textContent = text;
  hud.classList.add('show');

  if (hudTimeout) clearTimeout(hudTimeout);
  hudTimeout = setTimeout(() => {
    hud.classList.remove('show');
  }, 1200);
}

function getVideo() {
  return document.querySelector('video');
}

function resetPlaybackSpeed(video) {
  if (video && video.playbackRate !== 1.0) {
    video.playbackRate = 1.0;
  }
}

// Plex React components require synthetic mouse events to trigger properly
function triggerPlexClick(element) {
  if (!element) return;
  element.focus();
  ['mousedown', 'mouseup', 'click'].forEach(eventType => {
    element.dispatchEvent(new MouseEvent(eventType, {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1
    }));
  });
  if (typeof element.click === 'function') {
    element.click();
  }
}

// Auto-Skip Engine for Plex Web
function scanForSkipButtons() {
  // 1. Bypass Up Next Countdown / Play Next Episode
  if (settings.bypassCountdown) {
    const upNextBtn = document.querySelector('[class*="AudioVideoUpNext-playButton"], [class*="PostPlay-playButton"], button[data-testid="postplay-play"]');
    if (upNextBtn) {
      triggerPlexClick(upNextBtn);
      return;
    }
  }

  // 2. Skip Intro / Skip Credits Overlay Buttons
  const overlayBtn = document.querySelector('[class*="AudioVideoFullPlayer-overlayButton"], button[data-testid="pre-play-skip"], button[data-testid="post-play-skip"]');
  if (overlayBtn) {
    const text = (overlayBtn.textContent || '').trim().toLowerCase();
    const isIntroText = text.includes('intro');
    const isCreditsText = text.includes('credit');

    if (isIntroText && settings.skipIntro) {
      triggerPlexClick(overlayBtn);
      return;
    }
    if (isCreditsText && settings.skipCredits) {
      triggerPlexClick(overlayBtn);
      return;
    }

    // If Plex obfuscated button text, determine via timeline position
    if (!isIntroText && !isCreditsText) {
      const slider = document.querySelector('[class*="Slider-thumb-"]:not([aria-labelledby])');
      if (slider) {
        const current = parseInt(slider.getAttribute('aria-valuenow') || '0', 10);
        const max = parseInt(slider.getAttribute('aria-valuemax') || '1', 10);
        const progressPercent = (current / max) * 100;

        if (progressPercent < 50 && settings.skipIntro) {
          triggerPlexClick(overlayBtn);
          return;
        }
        if (progressPercent >= 50 && settings.skipCredits) {
          triggerPlexClick(overlayBtn);
          return;
        }
      }
    }
  }
}

// Injects PiP button into Plex player control bar
function injectPipButton() {
  if (!settings.enablePiP || document.getElementById('plexflow-pip-btn')) {
    return;
  }

  const controlBar = document.querySelector('[class*="AudioVideoPlayerControls-buttonGroup"], [class*="AudioVideoPlayerControls-volumeSliderContainer"]');
  if (!controlBar) {
    return;
  }

  const pipBtn = document.createElement('button');
  pipBtn.id = 'plexflow-pip-btn';
  pipBtn.className = 'plexflow-pip-btn';
  pipBtn.title = 'Picture-in-Picture';
  pipBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"></rect>
      <rect x="11" y="9" width="9" height="6" rx="1" fill="currentColor"></rect>
    </svg>
  `;

  pipBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const video = getVideo();
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {}
  });

  controlBar.appendChild(pipBtn);
}

// Keyboard speed controls
function handleKeyDown(e) {
  if (!settings.enableSpeedHotkeys) return;
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
    return;
  }

  const video = getVideo();
  if (!video) return;

  if (e.key === '[') {
    e.preventDefault();
    video.playbackRate = Math.max(0.5, parseFloat((video.playbackRate - 0.1).toFixed(1)));
    showHud(`Speed: ${video.playbackRate}x`);
  } else if (e.key === ']') {
    e.preventDefault();
    video.playbackRate = Math.min(3.0, parseFloat((video.playbackRate + 0.1).toFixed(1)));
    showHud(`Speed: ${video.playbackRate}x`);
  } else if (e.key === '\\') {
    e.preventDefault();
    video.playbackRate = 1.0;
    showHud('Speed: 1.0x');
  }
}

// Periodic check loop for Plex post-play state
setInterval(() => {
  scanForSkipButtons();
}, 600);

const observer = new MutationObserver(() => {
  scanForSkipButtons();
  injectPipButton();

  const video = getVideo();
  if (video && !video.dataset.plexflowSpeedInit) {
    video.dataset.plexflowSpeedInit = 'true';
    resetPlaybackSpeed(video);
    video.addEventListener('play', () => resetPlaybackSpeed(video));
  }
});

function initPlexFlow() {
  const isPlexTv = location.hostname.includes('plex.tv');
  const isPlexPort = location.port === '32400' || location.pathname.startsWith('/web');
  if (!isPlexTv && !isPlexPort) {
    return;
  }

  chrome.storage.local.get(DEFAULT_SETTINGS, (stored) => {
    settings = { ...DEFAULT_SETTINGS, ...stored };
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.target === 'plexflow' && message.action === 'UPDATE_SETTINGS') {
      settings = { ...settings, ...message.settings };
      sendResponse({ success: true, settings });
    }
  });

  window.addEventListener('keydown', handleKeyDown);
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlexFlow);
} else {
  initPlexFlow();
}
