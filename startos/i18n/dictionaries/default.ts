export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  "Starting God's Eye View!": 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The God\'s Eye View globe. Your browser asks for the username "admin" and the password from the Set Web UI Password action.': 5,

  // init/watchPassword.ts
  "God's Eye View has no login of its own — set a password before starting it": 6,

  // actions/setPassword.ts
  'Set Web UI Password': 7,
  'Reset Web UI Password': 8,
  'Generate the password your browser asks for when you open God\'s Eye View. The username is always "admin". Running this again replaces the existing password.': 9,
  'The current password stops working as soon as this runs. Browsers cache these logins, so open a private window if the old one still seems to work.': 10,
  'Web UI Password Set': 11,
  'Your browser asks for these the next time you open the Web UI. Save the password now — it is not shown again. It also protects the endpoints that spend your API credit, so treat it as a real credential.': 12,
  Username: 13,
  Password: 14,

  // actions/mapKeys.ts
  'Map Tile Keys': 15,
  'Optional keys for the globe imagery. Without them the globe renders Esri satellite imagery; a Cesium ion token adds photorealistic 3D and world terrain, and a Google Maps key adds direct Google 3D tiles and place search.': 16,
  'Saving restarts the service: these keys are compiled into the browser bundle, so the client is rebuilt before the globe comes back.': 17,
  'Cesium ion Token': 18,
  'Free for personal, non-commercial use from cesium.com. Unlocks Google Photorealistic 3D Tiles through ion, world terrain and Bing aerial imagery.': 19,
  'Google Maps API Key (browser)': 20,
  'Enables direct Google Photorealistic 3D Tiles and place search. Metered — set a billing cap at Google. This key is compiled into the page and readable by anyone who can sign in, so restrict it by HTTP referrer at Google.': 21,
  'Google Maps API Key (server)': 22,
  'Used only by the server for Places and Street View lookups and never sent to the browser. Leave empty to use the browser key for those too.': 23,

  // actions/dataFeedKeys.ts
  'Data Feed Keys': 24,
  'Optional keys that unlock extra data layers, all free to obtain. Flights, satellites, earthquakes, radio, bikeshare, public cameras and launches need no key at all.': 25,
  'Saving restarts the service.': 26,
  'NASA FIRMS Map Key': 27,
  'Free from NASA EOSDIS. Enables the active wildfires layer.': 28,
  'AISStream API Key': 29,
  'Free from aisstream.io. Enables live vessel tracking.': 30,
  'TomTom API Key': 31,
  'Free tier available. Enables the live traffic-flow layer; see Voice & Spend Controls for the daily tile budget.': 32,
  'Launch Library 2 Token': 33,
  'Raises the request allowance for the space-launch layer, which otherwise works anonymously.': 34,
  'OpenSky Client ID': 35,
  'Flight tracking works anonymously; OpenSky credentials raise the rate limit. Both this and the secret must be set to take effect.': 36,
  'OpenSky Client Secret': 37,
  'The secret paired with the OpenSky client ID above.': 38,

  // actions/spendControls.ts
  'Must be a whole number': 39,
  'Voice & Spend Controls': 40,
  'The OpenAI key for voice control, and the per-visitor throttles the app applies in front of the metered providers.': 41,
  'Saving restarts the service. These throttles are not billing caps: anyone who can sign in can drive spend through these endpoints, so also set quotas and billing alerts with the providers themselves.': 42,
  'OpenAI API Key': 43,
  'Enables voice control through the OpenAI Realtime API. Metered — a few cents per minute of conversation. Audio from the browser is sent to OpenAI.': 44,
  'OpenAI Requests per Minute (per IP)': 45,
  "Leave empty for upstream's default (unlimited).": 46,
  'Google Places Requests per Minute (per IP)': 47,
  'TomTom Daily Tile Budget': 48,
  "Soft cap on traffic-tile requests per day. Leave empty for upstream's default of 40000.": 49,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
