"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CursorEngine } from "./components/cursor-engine";
import { SceneLayer, type GlobeTarget } from "./components/scene-layer";

type Phase = "idle" | "resisting" | "repelling" | "allowed";

const reduceMotionQuery = "(prefers-reduced-motion: reduce)";
const finePointerQuery = "(pointer: fine)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  return subscribeToMediaQuery(reduceMotionQuery, onStoreChange);
}

function getReducedMotionSnapshot() {
  return getMediaQuerySnapshot(reduceMotionQuery);
}

function subscribeToFinePointer(onStoreChange: () => void) {
  return subscribeToMediaQuery(finePointerQuery, onStoreChange);
}

function getFinePointerSnapshot() {
  return getMediaQuerySnapshot(finePointerQuery);
}

function subscribeToMediaQuery(query: string, onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const media = window.matchMedia(query);
  media.addEventListener("change", onStoreChange);

  return () => media.removeEventListener("change", onStoreChange);
}

function getMediaQuerySnapshot(query: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
}

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("resisting");
  const [flickPoint, setFlickPoint] = useState({ x: 0, y: 0 });
  const [flickVisible, setFlickVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [repelCount, setRepelCount] = useState(0);
  const globeAnchorRef = useRef<HTMLDivElement>(null);
  const globeTargetRef = useRef<GlobeTarget | null>(null);
  const anchorStyleTargetRef = useRef({ x: Number.NaN, y: Number.NaN, size: Number.NaN });
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const requestAccessRef = useRef<HTMLButtonElement>(null);
  const repelTimeoutRef = useRef<number | null>(null);
  const flickTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const finePointer = useSyncExternalStore(subscribeToFinePointer, getFinePointerSnapshot, () => false);

  const cursorActive = finePointer && !reducedMotion;
  const requiredRepels = cursorActive ? 3 : 1;

  const allowAccess = useCallback(() => {
    setPhase((current) => (current === "allowed" ? current : "allowed"));
    setFlickVisible(false);
  }, []);

  const handleGlobeTargetChange = useCallback((target: GlobeTarget) => {
    globeTargetRef.current = target;

    const anchor = globeAnchorRef.current;
    if (!anchor) {
      return;
    }

    const nextSize = target.radius * 2;
    const previous = anchorStyleTargetRef.current;
    if (
      Math.abs(target.x - previous.x) < 0.35 &&
      Math.abs(target.y - previous.y) < 0.35 &&
      Math.abs(nextSize - previous.size) < 0.2
    ) {
      return;
    }

    anchorStyleTargetRef.current = { x: target.x, y: target.y, size: nextSize };

    anchor.style.setProperty("--globe-x", `${target.x}px`);
    anchor.style.setProperty("--globe-y", `${target.y}px`);
    anchor.style.setProperty("--globe-size", `${nextSize}px`);
  }, []);

  const requestDomainEntry = useCallback(() => {
    if (phase !== "allowed" || isTransitioning) {
      return;
    }

    if (reducedMotion) {
      router.push("/domain");
      return;
    }

    setIsTransitioning(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      router.push("/domain");
    }, 520);
  }, [isTransitioning, phase, reducedMotion, router]);

  const triggerRepel = useCallback(
    (point: { x: number; y: number }) => {
      if (phase !== "resisting") {
        return;
      }

      if (repelTimeoutRef.current) {
        window.clearTimeout(repelTimeoutRef.current);
      }
      if (flickTimeoutRef.current) {
        window.clearTimeout(flickTimeoutRef.current);
      }

      setFlickPoint(point);
      setFlickVisible(true);
      setPhase("repelling");

      setRepelCount((current) => {
        const next = current + 1;

        if (next >= requiredRepels) {
          window.setTimeout(() => {
            allowAccess();
          }, 120);
        }

        return next;
      });

      flickTimeoutRef.current = window.setTimeout(() => {
        setFlickVisible(false);
      }, 250);

      repelTimeoutRef.current = window.setTimeout(() => {
        setPhase((current) => (current === "allowed" ? current : "resisting"));
      }, 190);
    },
    [allowAccess, phase, requiredRepels],
  );

  useEffect(() => {
    if (phase === "allowed") {
      enterButtonRef.current?.focus();
      return;
    }

    if (!cursorActive) {
      requestAccessRef.current?.focus();
    }
  }, [cursorActive, phase]);

  useEffect(() => {
    return () => {
      if (repelTimeoutRef.current) {
        window.clearTimeout(repelTimeoutRef.current);
      }
      if (flickTimeoutRef.current) {
        window.clearTimeout(flickTimeoutRef.current);
      }
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const repelsComplete = Math.min(repelCount, requiredRepels);
  const repelsRemaining = Math.max(requiredRepels - repelsComplete, 0);
  const resistanceProgress = phase === "allowed" ? 100 : (repelsComplete / requiredRepels) * 100;

  return (
    <main className="cinematic-shell">
      <div className="nebula-backdrop" />
      <div className="cinematic-vignette" />
      <div
        aria-hidden
        className={isTransitioning ? "transition-gate transition-gate--active" : "transition-gate"}
      />
      <CursorEngine
        active={cursorActive}
        phase={phase}
        globeAnchorRef={globeAnchorRef}
        globeTargetRef={globeTargetRef}
        onRepel={triggerRepel}
      />

      <div
        aria-hidden
        className={flickVisible ? "flick-hand flick-hand--visible" : "flick-hand"}
        style={{ left: flickPoint.x, top: flickPoint.y }}
      />

      <section className="hero-stage">
        <div className="hero-copy" data-phase={phase}>
          <p className="phase-label">
            {phase === "idle" && "Warming up"}
            {phase === "resisting" && "Building in motion"}
            {phase === "repelling" && "Try again"}
            {phase === "allowed" && "Let's build"}
          </p>
          <h1>Building Creative Systems With Code.</h1>
          <p className="hero-description">
            An interactive portfolio about creating products, visuals, and experiences through code.
          </p>
          <p className="hero-instruction">
            {phase === "allowed"
              ? "With the ability to build and imagine, there's no limit to what's possible."
              : cursorActive
                ? `Engage the globe to trigger ${repelsRemaining} more interaction pulse${repelsRemaining === 1 ? "" : "s"}.`
                : "Tap to continue."}
          </p>

          <div className="resistance-meter" role="status" aria-live="polite">
            <div className="resistance-meter__label-row">
              <span>Build momentum</span>
              <span>{phase === "allowed" ? "Complete" : `${repelsComplete}/${requiredRepels}`}</span>
            </div>
            <div className="resistance-meter__track">
              <span className="resistance-meter__fill" style={{ width: `${resistanceProgress}%` }} />
            </div>
          </div>

          {phase !== "allowed" && !cursorActive && (
            <button
              ref={requestAccessRef}
              type="button"
              className="hero-cta hero-cta--button hero-cta--ghost"
              onClick={() => setRepelCount((count) => {
                const next = count + 1;
                if (next >= requiredRepels) {
                  allowAccess();
                }
                return next;
              })}
            >
              Start Building
            </button>
          )}

          <div className={phase === "allowed" ? "cta-row cta-row--visible" : "cta-row"}>
            <button
              ref={enterButtonRef}
              type="button"
              className="hero-cta hero-cta--button"
              onClick={requestDomainEntry}
              disabled={phase !== "allowed"}
            >
              Enter Portfolio
            </button>
            <span className="cta-note">
              {phase === "allowed" ? "Creation flow unlocked" : "Unlock by interacting with the globe"}
            </span>
          </div>
        </div>

        <div className="hero-composition">
          <figure className={phase === "allowed" ? "portrait-block portrait-block--ready" : "portrait-block"}>
            <Image
              src="/Avatar_with_palms_in_front-removebg-preview.png"
              alt="Portrait of the portfolio creator"
              width={920}
              height={1120}
              priority
              className="hero-portrait hero-portrait--transparent"
            />
          </figure>
          <div aria-hidden className="hero-orbit-layer">
            <SceneLayer
              reducedMotion={reducedMotion}
              allowed={phase === "allowed"}
              onGlobeTargetChange={handleGlobeTargetChange}
            />
          </div>
          <div
            ref={globeAnchorRef}
            aria-hidden
            className={phase === "allowed" ? "globe-anchor globe-anchor--allowed" : "globe-anchor"}
          >
            <span className="globe-hit-core" />
          </div>
        </div>
      </section>

      <section id="main-content" className={phase === "allowed" ? "entry-strip entry-strip--visible" : "entry-strip"}>
        <p>Frontend Builder</p>
        <p>Creative Coder</p>
        <p>Interaction Designer</p>
      </section>
    </main>
  );
}
