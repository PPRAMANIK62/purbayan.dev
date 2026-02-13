import { useEffect, useRef, useCallback } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

const DEFAULT_TIMEOUT = 5000;
const DESKTOP_MIN_WIDTH = 768;

interface UseKonamiCodeOptions {
  timeout?: number;
}

function useKonamiCode(
  callback: () => void,
  options?: UseKonamiCodeOptions,
): void {
  const positionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const timeoutMs = options?.timeout ?? DEFAULT_TIMEOUT;

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const resetSequence = useCallback(() => {
    positionRef.current = 0;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.innerWidth < DESKTOP_MIN_WIDTH) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI_SEQUENCE[positionRef.current];

      if (key === expected) {
        positionRef.current += 1;

        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }

        if (positionRef.current === KONAMI_SEQUENCE.length) {
          resetSequence();
          callbackRef.current();
          return;
        }

        timerRef.current = setTimeout(resetSequence, timeoutMs);
      } else {
        resetSequence();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeoutMs, resetSequence]);
}

export { useKonamiCode };
export default useKonamiCode;
