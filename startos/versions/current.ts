import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:1',
  releaseNotes: {
    en_US:
      "Rebuilt with the latest StartOS SDK. The Web UI password gate now runs at the StartOS proxy, and health checks no longer use more memory the longer the service runs. God's Eye View itself is unchanged.",
    es_ES:
      "Recompilado con el SDK de StartOS más reciente. La contraseña de la interfaz web ahora se aplica en el proxy de StartOS, y las comprobaciones de estado ya no usan más memoria con el tiempo. God's Eye View no cambia.",
    de_DE:
      "Mit dem neuesten StartOS-SDK neu gebaut. Das Passwort der Weboberfläche wird jetzt am StartOS-Proxy geprüft, und Integritätsprüfungen belegen mit der Laufzeit nicht mehr Speicher. God's Eye View selbst bleibt unverändert.",
    pl_PL:
      "Zbudowano ponownie z najnowszym SDK StartOS. Hasło interfejsu WWW jest teraz sprawdzane na proxy StartOS, a sprawdzanie stanu nie zużywa coraz więcej pamięci. Sam God's Eye View się nie zmienia.",
    fr_FR:
      "Reconstruit avec le dernier SDK StartOS. Le mot de passe de l'interface web est désormais appliqué au proxy StartOS, et les contrôles de santé n'utilisent plus davantage de mémoire au fil du temps. God's Eye View lui-même ne change pas.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
