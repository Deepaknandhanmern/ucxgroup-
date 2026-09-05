// Fires a very short vibration on devices that support the Vibration API
// (Android Chrome/Firefox; iOS Safari has no API for this and silently
// no-ops). Used as a light physical acknowledgment on touch-only actions
// like opening an accordion or a nav drawer — desktop clicks already get
// visual feedback, this is just the mobile equivalent.
export function tapHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(12);
  }
}
