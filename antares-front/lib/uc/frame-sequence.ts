"use client";

import { gsap, ScrollTrigger } from "./gsap";

export type FrameSequenceOptions = {
  canvas: HTMLCanvasElement;
  frames: string[];
  fit?: "cover" | "contain";
  /** Parallel image requests while preloading. */
  concurrency?: number;
  /** Wipe the canvas before each draw (needed when frames have transparency). */
  clear?: boolean;
  /** 1 = follow the scrubbed playhead exactly, < 1 = ease toward it. */
  lerp?: number;
  scrollTrigger?: ScrollTrigger.Vars;
  onProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
};

/**
 * Scroll-scrubbed image sequence painted to a <canvas>.
 *
 * Ported from the behaviour of the original site: frames preload in the
 * background with bounded concurrency, the scroll position drives a `playhead`
 * tween, and each tick paints the nearest *loaded* frame so scrubbing stays
 * responsive before the whole sequence has arrived.
 */
export class FrameSequence {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frameURLs: string[];
  private fit: "cover" | "contain";
  private clear: boolean;
  private concurrency: number;
  private lerpFactor: number;

  private images: (HTMLImageElement | undefined)[];
  private loadedSet = new Set<number>();
  private playhead = { frame: 0 };
  private currentFrame = -1;
  private destroyed = false;

  private queue: number[] = [];
  private activeLoads = 0;

  private tween?: gsap.core.Tween;
  private st?: ScrollTrigger;
  private resizeObserver?: ResizeObserver;
  private resizeTimer = 0;
  private ticker?: () => void;
  private displayFrame = 0;

  constructor(opts: FrameSequenceOptions) {
    this.canvas = opts.canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.frameURLs = opts.frames;
    this.fit = opts.fit ?? "cover";
    this.clear = opts.clear ?? false;
    this.concurrency = opts.concurrency ?? 6;
    this.lerpFactor = opts.lerp ?? 1;
    this.images = new Array(this.frameURLs.length);
    this.onProgress = opts.onProgress;
    this.onReady = opts.onReady;

    this.setupCanvas();
    this.initScrollAnimation(opts.scrollTrigger);
    this.preload();
  }

  private onProgress?: (loaded: number, total: number) => void;
  private onReady?: () => void;

  private get total() {
    return this.frameURLs.length;
  }

  /* ---------------- canvas ---------------- */

  private setupCanvas() {
    this.updateCanvasSize();
    this.resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize();
      this.currentFrame = -1;
      this.render();
      // Refreshing inside the observer would land in the middle of a
      // ScrollTrigger pass, so settle first — same 200ms the original waits.
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.st?.refresh(), 200);
    });
    this.resizeObserver.observe(this.canvas);
  }

  private updateCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------------- loading ---------------- */

  private preload() {
    for (let i = 0; i < this.total; i++) this.queue.push(i);
    this.pump();
  }

  private pump() {
    while (!this.destroyed && this.activeLoads < this.concurrency && this.queue.length) {
      const index = this.queue.shift()!;
      if (this.loadedSet.has(index)) continue;
      this.activeLoads++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.images[index] = img;
        this.loadedSet.add(index);
        this.activeLoads--;
        this.onProgress?.(this.loadedSet.size, this.total);
        if (this.loadedSet.size === 1) this.onReady?.();
        if (index === Math.round(this.displayFrame)) this.render();
        this.pump();
      };
      img.onerror = () => {
        this.activeLoads--;
        this.pump();
      };
      img.src = this.frameURLs[index];
    }
  }

  /** Nearest already-decoded frame, so early scrubbing never shows a blank canvas. */
  private nearestLoaded(target: number) {
    if (this.loadedSet.has(target)) return target;
    for (let d = 1; d < this.total; d++) {
      if (this.loadedSet.has(target - d)) return target - d;
      if (this.loadedSet.has(target + d)) return target + d;
    }
    return -1;
  }

  /* ---------------- scroll + paint ---------------- */

  private initScrollAnimation(stVars?: ScrollTrigger.Vars) {
    this.tween = gsap.to(this.playhead, {
      frame: this.total - 1,
      ease: "none",
      scrollTrigger: { scrub: true, ...stVars },
    });
    this.st = this.tween.scrollTrigger;

    this.ticker = () => {
      if (this.destroyed) return;
      const target = this.playhead.frame;
      this.displayFrame +=
        this.lerpFactor >= 1
          ? target - this.displayFrame
          : (target - this.displayFrame) * this.lerpFactor;
      this.render();
    };
    gsap.ticker.add(this.ticker);
  }

  private render() {
    const wanted = Math.max(0, Math.min(Math.round(this.displayFrame), this.total - 1));
    const index = this.nearestLoaded(wanted);
    if (index < 0 || index === this.currentFrame) return;
    const img = this.images[index];
    if (!img) return;
    this.currentFrame = index;

    const cw = this.canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const ch = this.canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
    if (this.clear) this.ctx.clearRect(0, 0, cw, ch);

    const scale =
      this.fit === "cover"
        ? Math.max(cw / img.width, ch / img.height)
        : Math.min(cw / img.width, ch / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  destroy() {
    this.destroyed = true;
    if (this.ticker) gsap.ticker.remove(this.ticker);
    this.resizeObserver?.disconnect();
    this.st?.kill();
    this.tween?.kill();
    this.images = [];
    this.loadedSet.clear();
  }
}

/** Builds `/uc/frames/<dir>/frame_000.avif`-style URL lists. */
export function frameURLs(
  dir: string,
  count: number,
  { pad = 3, start = 0, ext = "avif" } = {},
) {
  return Array.from(
    { length: count },
    (_, i) => `/uc/frames/${dir}/frame_${String(i + start).padStart(pad, "0")}.${ext}`,
  );
}
