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

  function onPosition(pos: GeolocationPosition) {
    error.value = null
    position.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp,
    }
  }

  function onError(err: GeolocationPositionError) {
    error.value = describe(err)
    // Give up on this watch so a later start() (e.g. the locate button) can retry from scratch.
    stop()
  }

  /** Start watching. Safe to call repeatedly; restarts after an error. */
  function start() {
    if (!supported) {
      error.value = 'Geolocation wird von diesem Browser nicht unterstützt.'
      return
    }
    if (watchId !== null) return
    error.value = null
    watchId = navigator.geolocation.watchPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 20000,
    })
  }

  /** Explicit user request: fetch one fix right away and make sure the watch is running. */
  function locate() {
    if (!supported) return start()
    navigator.geolocation.getCurrentPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    })
    start()
  }

  function stop() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  onBeforeUnmount(stop)

  return { position, error, supported, start, locate, stop }
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
