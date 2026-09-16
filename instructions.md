# God's Eye View

## Documentation

- [God's Eye View README](https://github.com/bilawalsidhu/gods-eye-view#readme) — the upstream guide: what is on the globe, the cockpit, voice control, and which keys unlock what.
- [Data sources](https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md) — where every layer's data comes from and its license.

## What you get on StartOS

The globe runs the moment it starts, with no accounts or API keys: flights, satellites, earthquakes, public cameras, radio stations, bikeshare and space launches all use open data, and the imagery is Esri satellite imagery out of the box. StartOS puts a username and password in front of it, since the app has none of its own, and keeps your API keys and the app's caches in one backed-up volume.

Your server fetches from OpenSky, CelesTrak, USGS and about a dozen other providers while you use it, and your browser fetches map tiles directly from Esri, Google or Cesium. Those requests come from your own connection and are not sent over Tor — self-hosting this does not make it private.

## Getting set up

1. Run the **Set Web UI Password** action. StartOS asks you to do this before the service can start. Copy the password — it is shown only once.
2. Start the service and open the **Web UI**. Your browser asks for a username and password: the username is `admin`, the password is the one from step 1.
3. Pick a starting view from the first-run panel and you are in.

Everything below is optional, and each item is its own action. Saving any of them restarts the service; it is back in about ten seconds.

- **Map Tile Keys** — a free Cesium ion token adds photorealistic 3D buildings, world terrain and Bing aerial imagery. A Google Maps key adds Google's 3D tiles directly plus place search; it is metered, so set a billing cap at Google.
- **Data Feed Keys** — free keys for wildfires (NASA FIRMS), ship tracking (AISStream) and live traffic (TomTom), and OpenSky or Launch Library credentials for higher rate limits.
- **Voice & Spend Controls** — an OpenAI key for talking to the globe, plus per-visitor throttles on the metered services.

## Using God's Eye View

### Web interface

Data layers are in the panel on the left, visual presets on the right. Click any aircraft, vessel, satellite or camera to track it. The globe is drawn by your browser, not by your server, so a phone will struggle where a laptop won't.

### Actions

- **Set Web UI Password** (shown as **Reset Web UI Password** once one exists) — makes a new password and shows it once. The old one stops working right away. Browsers remember these logins, so if the old password still seems to work, open a private window.
- **Map Tile Keys**, **Data Feed Keys**, **Voice & Spend Controls** — the optional keys described above. Clearing a field turns that key off.

## Limitations

- The in-app "POWER UP" key panel is not available here; it only works when the app is run from its own development server. Use the actions instead.
- Anyone with your web UI password can run up charges on your Google and OpenAI keys, and the Google Maps key is readable by anyone who can open the page. Treat the password as a real credential, restrict the Google key by referrer, and set spending limits with the providers rather than relying only on the in-app throttles.
