"use client";

import { useEffect } from "react";
import { getSoundManager } from "../utils/soundManager";

/**
 * BackgroundAudio — mounts in the root layout.
 * Starts the looping background track at 20% volume after the first
 * user interaction (required by browser autoplay policy).
 * Stops cleanly on unmount.
 */
export default function BackgroundAudio() {
  useEffect(() => {
    let started = false;

    function startOnInteraction() {
      if (started) return;
      started = true;
      getSoundManager()?.startBackground();
      // Remove all listeners once the track has started
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("scroll", startOnInteraction);
    }

    window.addEventListener("click", startOnInteraction);
    window.addEventListener("keydown", startOnInteraction);
    window.addEventListener("touchstart", startOnInteraction, { passive: true });
    window.addEventListener("scroll", startOnInteraction, { passive: true });

    return () => {
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("scroll", startOnInteraction);
      getSoundManager()?.stopBackground();
    };
  }, []);

  return null;
}
