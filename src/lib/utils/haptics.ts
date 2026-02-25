export function tapHaptic() {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate(8);
    }
  } catch {
    // silent fail
  }
}

export function toggleHaptic() {
  try {
    if ("vibrate" in navigator) {
      // slightly more pronounced than tap
      navigator.vibrate(18);
    }
  } catch {
    // silent fail
  }
}