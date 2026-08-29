/**
 * character-animation.js
 * ---------------------------------------------------------------------------
 * A dependency-free, canvas-based sprite scrubber that makes a character's
 * eyes/gaze follow the cursor by smoothly scrubbing through a horizontal
 * sprite sheet, with eased "chase" interpolation and a gentle return to an
 * idle pose when the pointer leaves.
 *
 * The sprite sheet is 97 frames, 420x420 each, laid out in a single row.
 * The source video is one continuous cycle:
 *
 *    frame 0   -> idle / looking center
 *    frame 24  -> looking fully LEFT
 *    frame 48  -> idle / looking center   (used as the resting pose)
 *    frame 72  -> looking fully RIGHT
 *    frame 96  -> idle / looking center
 *
 * Only the 24 -> 48 -> 72 range is used interactively, so the character
 * never has to "wrap around" back through center to reach an extreme.
 *
 * Usage:
 *   const hero = new CharacterHero(canvasEl, {
 *     spriteSheet: '/character-spritesheet.png',
 *   });
 *   hero.init();
 *   // later, on unmount:
 *   hero.destroy();
 * ---------------------------------------------------------------------------
 */

export class CharacterHero {
  /**
   * @param {HTMLCanvasElement} canvas - target canvas element
   * @param {Object} [opts]
   * @param {string} opts.spriteSheet - URL to the sprite sheet image
   * @param {number} [opts.frameCount=97] - total frames in the sheet
   * @param {number} [opts.frameWidth=420] - width of a single frame (px)
   * @param {number} [opts.frameHeight=420] - height of a single frame (px)
   * @param {number} [opts.idleFrame=48] - resting/center frame index
   * @param {number} [opts.leftFrame=24] - full-left frame index
   * @param {number} [opts.rightFrame=72] - full-right frame index
   * @param {HTMLElement|Window} [opts.trackingTarget=window] - element whose
   *        pointer movement drives the animation. Defaults to the whole
   *        window so the character feels aware of the cursor anywhere on
   *        the page, not just when hovering the canvas itself.
   * @param {number} [opts.maxOffsetPx=1100] - horizontal pixel distance from
   *        the character's center at which the gaze reaches full extreme.
   *        Lower = more sensitive/twitchy, higher = calmer.
   * @param {number} [opts.followSpeed=6] - how quickly the displayed frame
   *        chases the target frame while actively tracking (higher = snappier).
   * @param {number} [opts.idleReturnSpeed=4] - how quickly it eases back to
   *        idleFrame once the pointer leaves (lower = slower/gentler).
   * @param {number} [opts.maxTiltDeg=1.5] - optional subtle rotation (deg) driven
   *        by vertical cursor position, for a light parallax feel. 0 disables it.
   * @param {boolean} [opts.idleBreathing=true] - subtle idle "breathing" motion
   *        (CSS-level scale/translate) applied only while at rest.
   */
  constructor(canvas, opts = {}) {
    if (!canvas || canvas.tagName !== 'CANVAS') {
      throw new Error('CharacterHero requires a <canvas> element');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.opts = Object.assign(
      {
        spriteSheet: '',
        frameCount: 97,
        frameWidth: 420,
        frameHeight: 420,
        idleFrame: 48,
        leftFrame: 24,
        rightFrame: 72,
        trackingTarget: typeof window !== 'undefined' ? window : null,
        maxOffsetPx: 1100,
        followSpeed: 6,
        idleReturnSpeed: 4,
        maxTiltDeg: 1.5,
        idleBreathing: true,
      },
      opts
    );

    // Animation state
    this.image = null;
    this.loaded = false;
    this.destroyed = false;

    this.currentFrame = this.opts.idleFrame;
    this.targetFrame = this.opts.idleFrame;

    this.currentTilt = 0;
    this.targetTilt = 0;

    this.isTracking = false; // true while pointer is actively driving gaze
    this._lastTime = 0;
    this._rafId = null;

    this._prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Bind handlers once so add/removeEventListener reference the same fn
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._onResize = this._onResize.bind(this);
    this._tick = this._tick.bind(this);
  }

  /** Load the sprite sheet and start the render loop. */
  async init() {
    await this._loadImage();
    if (this.destroyed) return;

    this._setupCanvasSize();
    this._attachListeners();

    // Draw the idle pose immediately so there's no blank flash while
    // waiting on the first animation frame.
    this._render();

    if (!this._prefersReducedMotion) {
      this._rafId = requestAnimationFrame(this._tick);
    }

    return this;
  }

  /** Remove all listeners and stop the render loop. Safe to call once. */
  destroy() {
    this.destroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);

    const target = this.opts.trackingTarget;
    if (target) {
      target.removeEventListener('pointermove', this._onPointerMove);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerleave', this._onPointerLeave);
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._onResize);
    }
  }

  // ---------------------------------------------------------------------
  // Setup
  // ---------------------------------------------------------------------

  _loadImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.loaded = true;
        resolve();
      };
      img.onerror = reject;
      img.decoding = 'async';
      img.src = this.opts.spriteSheet;
    });
  }

  _setupCanvasSize() {
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    const rect = this.canvas.getBoundingClientRect();

    // Fall back to the frame's intrinsic size if the canvas hasn't been
    // given explicit CSS dimensions yet.
    const cssWidth = rect.width || this.opts.frameWidth;
    const cssHeight = rect.height || this.opts.frameHeight;

    this.canvas.width = Math.round(cssWidth * dpr);
    this.canvas.height = Math.round(cssHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this._cssWidth = cssWidth;
    this._cssHeight = cssHeight;
  }

  _attachListeners() {
    const target = this.opts.trackingTarget;
    if (target) {
      target.addEventListener('pointermove', this._onPointerMove, { passive: true });
    }
    if (typeof document !== 'undefined') {
      // Fires when the pointer leaves the browser viewport entirely.
      document.addEventListener('pointerleave', this._onPointerLeave);
      document.addEventListener('visibilitychange', this._onVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._onResize);
    }
  }

  // ---------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------

  _onPointerMove(e) {
    if (!this.loaded) return;

    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const norm = clamp(dx / this.opts.maxOffsetPx, -1, 1);
    const { idleFrame, leftFrame, rightFrame } = this.opts;

    // norm < 0 (pointer left of center) -> ease toward leftFrame
    // norm > 0 (pointer right of center) -> ease toward rightFrame
    this.targetFrame =
      norm < 0
        ? lerp(idleFrame, leftFrame, -norm)
        : lerp(idleFrame, rightFrame, norm);

    if (this.opts.maxTiltDeg) {
      const vNorm = clamp(dy / this.opts.maxOffsetPx, -1, 1);
      this.targetTilt = vNorm * this.opts.maxTiltDeg;
    }

    this.isTracking = true;
  }

  _onPointerLeave() {
    this.isTracking = false;
    this.targetFrame = this.opts.idleFrame;
    this.targetTilt = 0;
  }

  _onVisibilityChange() {
    if (document.hidden) {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._rafId = null;
    } else if (!this._prefersReducedMotion && !this._rafId) {
      this._lastTime = 0;
      this._rafId = requestAnimationFrame(this._tick);
    }
  }

  _onResize() {
    this._setupCanvasSize();
    this._render();
  }

  // ---------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------

  _tick(time) {
    if (this.destroyed) return;

    const dt = this._lastTime ? Math.min((time - this._lastTime) / 1000, 0.1) : 0;
    this._lastTime = time;

    // Frame-rate independent exponential smoothing ("chase" the target).
    const speed = this.isTracking ? this.opts.followSpeed : this.opts.idleReturnSpeed;
    const frameAlpha = 1 - Math.exp(-dt * speed);
    const tiltAlpha = 1 - Math.exp(-dt * this.opts.idleReturnSpeed);

    this.currentFrame += (this.targetFrame - this.currentFrame) * frameAlpha;
    this.currentTilt += (this.targetTilt - this.currentTilt) * tiltAlpha;

    this._render();

    this._rafId = requestAnimationFrame(this._tick);
  }

  _render() {
    if (!this.loaded) return;

    const { ctx } = this;
    const { frameWidth, frameHeight, frameCount } = this.opts;
    const w = this._cssWidth;
    const h = this._cssHeight;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    if (this.currentTilt) {
      ctx.translate(w / 2, h / 2);
      ctx.rotate((this.currentTilt * Math.PI) / 180);
      ctx.translate(-w / 2, -h / 2);
    }

    // Crossfade between the floor and ceiling frame for sub-frame smoothness
    // instead of visibly snapping between whole sprite frames. The base frame
    // is drawn fully opaque and the next frame is faded in on top of it — NOT
    // two partial-alpha layers over a transparent canvas, which would make
    // opacity dip mid-crossfade (visible as a flicker/"blink" every time the
    // scrub crosses an integer frame).
    const clamped = clamp(this.currentFrame, 0, frameCount - 1);
    const floorIdx = Math.floor(clamped);
    const ceilIdx = Math.min(floorIdx + 1, frameCount - 1);
    const blend = clamped - floorIdx;

    this._drawFrame(floorIdx, w, h, 1);
    if (blend > 0.001) {
      this._drawFrame(ceilIdx, w, h, blend);
    }

    ctx.restore();
  }

  _drawFrame(index, w, h, alpha) {
    const { ctx } = this;
    const { frameWidth, frameHeight } = this.opts;
    const sx = index * frameWidth;

    ctx.globalAlpha = alpha;
    ctx.drawImage(this.image, sx, 0, frameWidth, frameHeight, 0, 0, w, h);
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default CharacterHero;
