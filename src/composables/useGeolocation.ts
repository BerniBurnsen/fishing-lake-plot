import { onBeforeUnmount, ref } from 'vue'

export interface Position {
  lat: number
  lng: number
  /** Accuracy radius in meters. */
  accuracy: number
  timestamp: number
}

export function useGeolocation() {
  const position = ref<Position | null>(null)
  const error = ref<string | null>(null)
  const supported = 'geolocation' in navigator
  let watchId: number | null = null

  function start() {
    if (!supported) {
      error.value = 'Geolocation wird von diesem Browser nicht unterstützt.'
      return
    }
    if (watchId !== null) return
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        error.value = null
        position.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        }
      },
      (err) => {
        error.value = describe(err)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    )
  }

  function stop() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  onBeforeUnmount(stop)

  return { position, error, supported, start, stop }
}

function describe(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Standortzugriff verweigert. Bitte in den Browser-Einstellungen erlauben.'
    case err.POSITION_UNAVAILABLE:
      return 'Standort nicht verfügbar.'
    case err.TIMEOUT:
      return 'Standortabfrage hat zu lange gedauert.'
    default:
      return err.message
  }
}
