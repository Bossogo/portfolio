"use client";

import { RefObject, useEffect, useRef } from "react";
import type { GlobeTarget } from "./scene-layer";

type Phase = "idle" | "resisting" | "repelling" | "allowed";

type CursorEngineProps = {
  active: boolean;
  phase: Phase;
  globeAnchorRef: RefObject<HTMLElement | null>;
  globeTargetRef: RefObject<GlobeTarget | null>;
  onRepel: (point: { x: number; y: number }) => void;
};

export function CursorEngine({ active, phase, globeAnchorRef, globeTargetRef, onRepel }: CursorEngineProps) {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const simRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, initialized: false });
  const frameRef = useRef<number | null>(null);
  const clickBoostRef = useRef(0);
  const lastRepelAtRef = useRef(0);
  const repelArmedRef = useRef(true);
  const viewportRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!active) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };

      if (!simRef.current.initialized) {
        simRef.current.x = event.clientX;
        simRef.current.y = event.clientY;
        simRef.current.initialized = true;
      }
    };

    const handlePointerDown = () => {
      clickBoostRef.current = 1;
    };

    const handleResize = () => {
      viewportRef.current = { width: window.innerWidth, height: window.innerHeight };
    };

    viewportRef.current = { width: window.innerWidth, height: window.innerHeight };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    document.body.classList.add("custom-cursor-active");

    return () => {
      document.body.classList.remove("custom-cursor-active");
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      return;
    }

    const tick = () => {
      const sim = simRef.current;
      const pointer = pointerRef.current;
      const followStrength = phase === "allowed" ? 0.3 : 0.12;
      const damping = phase === "allowed" ? 0.66 : 0.76;

      if (!sim.initialized) {
        sim.x = window.innerWidth / 2;
        sim.y = window.innerHeight / 2;
        sim.initialized = true;
      }

      sim.vx += (pointer.x - sim.x) * followStrength;
      sim.vy += (pointer.y - sim.y) * followStrength;

      if (phase === "resisting" || phase === "repelling") {
        const target = globeTargetRef.current;
        const anchor = globeAnchorRef.current;

        let gx = 0;
        let gy = 0;
        let sourceRadius = 0;

        if (target) {
          gx = target.x;
          gy = target.y;
          sourceRadius = target.radius;
        } else if (anchor) {
          const rect = anchor.getBoundingClientRect();
          gx = rect.left + rect.width / 2;
          gy = rect.top + rect.height / 2;
          sourceRadius = Math.max(rect.width, rect.height) * 0.5;
        } else {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }

        const pointerDx = pointer.x - gx;
        const pointerDy = pointer.y - gy;
        const pointerDistance = Math.hypot(pointerDx, pointerDy) || 0.0001;

        // Keep the active hit zone intentionally small so it matches the globe center.
        const interactionRadius = Math.max(14, sourceRadius * 0.34);
        const rearmRadius = interactionRadius * 2.9;
        if (!repelArmedRef.current && pointerDistance > rearmRadius) {
          repelArmedRef.current = true;
        }

        const dx = sim.x - gx;
        const dy = sim.y - gy;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const repelRadius = interactionRadius * 1.55;

        if (pointerDistance < repelRadius) {
          const distanceRatio = 1 - pointerDistance / repelRadius;
          const clickBoost = clickBoostRef.current > 0.01 ? 2.4 : 1;
          const force = distanceRatio * distanceRatio * 24 * clickBoost;
          const dirX = dx / distance;
          const dirY = dy / distance;

          sim.vx += dirX * force;
          sim.vy += dirY * force;

          if (pointerDistance < interactionRadius) {
            sim.vx += dirX * 9.5;
            sim.vy += dirY * 9.5;
          }

          const now = performance.now();
          if (repelArmedRef.current && pointerDistance < interactionRadius && now - lastRepelAtRef.current > 380) {
            lastRepelAtRef.current = now;
            repelArmedRef.current = false;
            onRepel({ x: gx, y: gy });
          }
        }
      }

      clickBoostRef.current *= 0.84;
      sim.vx *= damping;
      sim.vy *= damping;
      sim.x += sim.vx;
      sim.y += sim.vy;

      sim.x = Math.min(Math.max(sim.x, 8), viewportRef.current.width - 8);
      sim.y = Math.min(Math.max(sim.y, 8), viewportRef.current.height - 8);

      const ring = ringRef.current;
      const core = coreRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${sim.x}px, ${sim.y}px, 0)`;
      }
      if (core) {
        core.style.transform = `translate3d(${sim.x}px, ${sim.y}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
    };
  }, [active, globeAnchorRef, globeTargetRef, onRepel, phase]);

  if (!active) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={phase === "repelling" ? "custom-cursor-ring custom-cursor-ring--repelling" : "custom-cursor-ring"}
      />
      <div ref={coreRef} aria-hidden className="custom-cursor-core" />
    </>
  );
}