import { useEffect, useRef } from "react";

// Counts open modals so closing the player doesn't unlock scrolling under the details modal.
let openModals = 0;

/** Escape to close, lock page scroll, move focus in and restore it on close. */
export default function useModalBehavior(isOpen, onClose) {
  const initialFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();

    document.addEventListener("keydown", onKey);
    openModals += 1;
    document.body.style.overflow = "hidden";
    initialFocusRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      openModals -= 1;
      if (openModals === 0) document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  return initialFocusRef;
}
