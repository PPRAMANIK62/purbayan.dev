const EVENT = "pp:toggle-inspector"

/** Fired by the command palette; InspectorMode owns the actual state. */
export function toggleInspector() {
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function onInspectorToggle(handler: () => void) {
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}
