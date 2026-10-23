/**
 * PlexFlow - Popup Controller
 * Manages toggle persistence and syncs settings to active Plex tabs.
 */

const TOGGLE_IDS = [
  'skipIntro',
  'skipCredits',
  'bypassCountdown',
  'enablePiP',
  'enableSpeedHotkeys'
];

async function initPopup() {
  const defaults = {
    skipIntro: true,
    skipCredits: true,
    bypassCountdown: true,
    enablePiP: true,
    enableSpeedHotkeys: true
  };

  const stored = await chrome.storage.local.get(defaults);

  TOGGLE_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.checked = stored[id] !== undefined ? stored[id] : true;

      el.addEventListener('change', async () => {
        const update = { [id]: el.checked };
        await chrome.storage.local.set(update);

        // Notify active Plex tabs
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            target: 'plexflow',
            action: 'UPDATE_SETTINGS',
            settings: update
          }, () => {});
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', initPopup);
