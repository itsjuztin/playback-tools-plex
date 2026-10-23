# Privacy Policy

**Last Updated:** October 23, 2026

## Overview
**Playback Tools for Plex** is an open-source, local-first browser extension designed to enhance the Plex Web playback experience. We believe privacy is a fundamental right. This policy outlines our strict commitment to zero data collection.

## Data Collection & Storage
- **No Personal Data Collected:** We do not collect, track, log, or store any personal information, media titles, Plex library contents, server metadata, tokens, or user identifiers.
- **Local Storage Only:** Feature preferences (such as auto-skip intro/credits, countdown bypass, and hotkeys) are stored strictly on your local device via Chrome Storage API (`chrome.storage.local`).
- **No Telemetry or Analytics:** The extension contains zero tracking pixels, analytics scripts, ads, or external telemetry.

## Permissions Usage
- `storage`: Used solely to persist your local preferences.
- `tabs` & `activeTab`: Used to query active Plex Web tabs.
- `http://localhost/*`, `http://127.0.0.1/*`, `*://app.plex.tv/*`: Required to detect Plex media player controls and automate skip/PiP interactions on local or hosted Plex web clients.

## Third-Party Services
This extension operates entirely client-side. It does not communicate with external servers or third-party services.

## Contact & Bug Reports
For questions, suggestions, or issues, please visit our GitHub repository:  
https://github.com/itsjuztin/playback-tools-plex/issues
