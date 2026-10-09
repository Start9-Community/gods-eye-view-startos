import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.1:0',
  releaseNotes: {
    en_US: `God's Eye View 0.2.1: hardened host and same-origin checks, metered-provider request throttles on by default, and an updated StartOS SDK. MCP is not available through the Web UI. Full upstream notes: https://github.com/bilawalsidhu/gods-eye-view/releases/tag/v0.2.1`,
    es_ES: `God's Eye View 0.2.1: comprobaciones reforzadas de host y mismo origen, límites de peticiones a proveedores de pago activados de forma predeterminada y SDK de StartOS actualizado. MCP no está disponible a través de la interfaz web. Notas completas: https://github.com/bilawalsidhu/gods-eye-view/releases/tag/v0.2.1`,
    de_DE: `God's Eye View 0.2.1: strengere Host- und Same-Origin-Prüfungen, standardmäßig aktivierte Anfragelimits für kostenpflichtige Anbieter und aktualisiertes StartOS-SDK. MCP ist über die Weboberfläche nicht verfügbar. Vollständige Hinweise: https://github.com/bilawalsidhu/gods-eye-view/releases/tag/v0.2.1`,
    pl_PL: `God's Eye View 0.2.1: wzmocnione kontrole hosta i zgodności pochodzenia, domyślnie włączone limity zapytań do płatnych dostawców oraz zaktualizowany SDK StartOS. MCP nie jest dostępny przez interfejs webowy. Pełne informacje: https://github.com/bilawalsidhu/gods-eye-view/releases/tag/v0.2.1`,
    fr_FR: `God's Eye View 0.2.1 : contrôles renforcés de l'hôte et de la même origine, limites de requêtes aux fournisseurs facturés activées par défaut et SDK StartOS mis à jour. MCP n'est pas disponible via l'interface web. Notes complètes : https://github.com/bilawalsidhu/gods-eye-view/releases/tag/v0.2.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
