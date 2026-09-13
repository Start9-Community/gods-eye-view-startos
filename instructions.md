# God's Eye View

A live 3D globe of public sensor data. Aircraft transponders, ship beacons, satellite orbits, earthquakes, wildfires, road traffic and public webcams, all drawn on a photorealistic globe you can fly around in your browser.

## Documentation

- Upstream project: <https://github.com/bilawalsidhu/gods-eye-view>
- Where the data comes from: <https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md>

## What you get on StartOS

Most of it works the moment it starts — no accounts, no API keys. Flights, satellites, earthquakes, public cameras, radio stations, bikeshare and space launches all run on open data that needs no credentials, and the globe renders real satellite imagery out of the box.

A few layers need a key you supply yourself, and those are optional: Google's photorealistic 3D buildings, voice control, wildfires, ship tracking and live traffic.

**This one is worth knowing before you install it.** God's Eye View is a viewer for other people's data, so your server fetches from Google, OpenAI and about a dozen other providers while you use it. Those requests come from your home connection and are not sent over Tor. Every part of the globe you look at is a request to a map provider, and voice control sends your microphone audio to OpenAI. It is a great toy and a genuinely useful OSINT tool — it just isn't a private one, and self-hosting it doesn't make it private.

## Getting set up

Nothing is required. Start it and open the Web UI.

Your browser will ask for a username and password. The username is `admin`, and the password is in the **Show UI Password** action. God's Eye View has no login of its own, so StartOS puts one in front of it — which also keeps strangers off the parts of it that spend your money.

If you want more than the default layers, each of these is optional and each is its own action:

- **Map Tile Keys** — a free Cesium ion token makes imagery more reliable than the shared default. A Google Maps key adds photorealistic 3D buildings, and is metered, so set a billing cap at Google.
- **Data Feed Keys** — free keys for wildfires (NASA FIRMS), ship tracking (AISStream), traffic (TomTom) and a higher flight-data rate limit (OpenSky).
- **Voice & Spend Controls** — an OpenAI key for talking to the globe, plus throttles on the metered services.

Saving any of these restarts the service. It comes back in a few seconds.

## Using God's Eye View

### Web interface

Open the Web UI, sign in as `admin`, and pick a starting view. Data layers are in the panel on the left, visual presets on the right. Click any aircraft, vessel, satellite or camera to track it.

The globe is drawn by your browser, not by your server, so how smoothly it runs depends on the device you are viewing from. A phone will struggle where a laptop won't.

### Actions

- **Show UI Password** — the username and password your browser asks for.
- **Reset UI Password** — makes a new one and shows it once. The old one stops working right away. Browsers remember these logins, so if the old password still seems to work, open a private window.
- **Map Tile Keys**, **Data Feed Keys**, **Voice & Spend Controls** — the optional keys described above.

## Limitations

- The in-app "POWER UP" key panel does not work here. Use the actions instead. You may see it complain when the page loads; you can ignore that.
- Setting a Google Maps key means that key is readable by anyone who can sign in to your instance — that's how the app is built. Restrict it by referrer in the Google console and set a billing cap.
- Anyone with your UI password can run up charges on your Google and OpenAI keys. Treat it as a real password, and set spending limits with the providers rather than relying only on the in-app throttles.
- Over Tor the map imagery is fetched by your browser, not your server, so tiles may load slowly or not at all depending on your browser's settings.
- Upstream calls this "a fast, hackable foundation, not a hardened production service," and it changes daily. Expect rough edges.
