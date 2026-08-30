import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

interface Layer {
  el: HTMLElement;
  speed: number;
}

const layers = new Set<Layer>();
let rafId = 0;
let listening = false;

function apply() {
  rafId = 0;
  const mid = window.innerHeight / 2;
  for (const layer of layers) {
    const rect = layer.el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const shift = (mid - center) * layer.speed;
    layer.el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
  }
}

function schedule() {
  if (rafId) return;
  rafId = window.requestAnimationFrame(apply);
}

function ensureListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

function maybeStopListening() {
  if (layers.size > 0 || !listening) return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

/**
 * Attach the returned ref to an element to drift it against the scroll.
 * `speed` is roughly the fraction of travel added per pixel of viewport offset;
 * 0.04–0.16 reads as depth, higher reads as a glitch. Disabled for reduced motion.
 */
export function useParallaxLayer<T extends HTMLElement = HTMLDivElement>(speed: number) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || speed === 0) return;
    const layer: Layer = { el, speed };
    layers.add(layer);
    ensureListening();
    schedule();
    return () => {
      layers.delete(layer);
      el.style.transform = '';
      maybeStopListening();
    };
  }, [reduced, speed]);

  return ref;
}

/**
 * Reveal-on-enter: element starts shifted + transparent and settles once, the
 * page's single entrance grammar. No-ops under reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 20px, 0)';
    el.style.transition = `opacity 720ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 720ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    const show = () => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    // Safety net: never leave content hidden if the observer never fires.
    const fallback = window.setTimeout(show, 1400 + delay);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [reduced, delay]);

  return ref;
}

/** Pointer-driven micro-parallax for the hero cluster (desktop + motion only). */
export function usePointerParallax(enabled: boolean) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!enabled || reduced) return;
      const { innerWidth, innerHeight } = window;
      const nx = (event.clientX / innerWidth - 0.5) * 2;
      const ny = (event.clientY / innerHeight - 0.5) * 2;
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        setOffset({ x: nx, y: ny });
      });
    },
    [enabled, reduced],
  );

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return { offset: reduced ? { x: 0, y: 0 } : offset, onPointerMove, reset };
}
