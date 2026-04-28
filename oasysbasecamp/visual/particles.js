class ParticleEngine {
  constructor(canvas, cfg) {
    this.canvas   = canvas;
    this.ctx      = canvas.getContext('2d');
    this.N        = cfg.N        || 10000;
    this.colorA   = cfg.colorA   || { h: 142, s: 71, l: 45 }; // verde bosque
    this.colorB   = cfg.colorB   || { h:  20, s:  5, l: 64 }; // tierra
    this.bgColor  = cfg.bgColor  || '#0f172a';
    this.text     = cfg.text     || 'OASYS';
    this.repelR   = cfg.repelRadius || 130;
    this.repelF   = cfg.repelForce  || 14;

    const N = this.N;
    this.px = new Float32Array(N); this.py = new Float32Array(N); this.pz = new Float32Array(N);
    this.vx = new Float32Array(N); this.vy = new Float32Array(N); this.vz = new Float32Array(N);
    this.tx = new Float32Array(N); this.ty = new Float32Array(N); this.tz = new Float32Array(N);
    this.gradT = new Float32Array(N);
    this.phase  = new Float32Array(N);

    this.W = 0; this.H = 0; this.CX = 0; this.CY = 0; this.dpr = 1;
    this.mouseX = -9999; this.mouseY = -9999;
    this.state = 0; // 0=sphere  1=forming  2=word+repel active
    this.t = 0; this.rotY = 0;
    this.FOV = 550; this.CAMERA_Z = 600;
    this.PHI = Math.PI * (1 + Math.sqrt(5));
    this.onReset = null;

    // Parse bgColor hex → rgb for trail overlay
    const hex = this.bgColor.replace('#', '');
    this.bgR = parseInt(hex.slice(0, 2), 16);
    this.bgG = parseInt(hex.slice(2, 4), 16);
    this.bgB = parseInt(hex.slice(4, 6), 16);

    this._bindEvents();
    this._resize();
    this._initParticles();
  }

  // ── Resize & sphere targets ──────────────────────────────────────────────

  _resize() {
    this.dpr = window.devicePixelRatio || 1;
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.CX = this.W / 2;
    this.CY = this.H / 2;
    this.canvas.width  = this.W * this.dpr;
    this.canvas.height = this.H * this.dpr;
    this.canvas.style.width  = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    if (this.state === 0) this._initSphereTargets();
  }

  _initSphereTargets() {
    const { N, W, H, PHI } = this;
    const base = Math.min(W, H);
    const R = base > 1200 ? base * 0.28 : base * 0.40;
    for (let i = 0; i < N; i++) {
      const polar = Math.acos(1 - 2 * (i + 0.5) / N);
      const azim  = PHI * i;
      this.tx[i] = Math.sin(polar) * Math.cos(azim) * R;
      this.ty[i] = Math.sin(polar) * Math.sin(azim) * R;
      this.tz[i] = Math.cos(polar) * R;
    }
  }

  _initParticles() {
    const { N, W, H } = this;
    for (let i = 0; i < N; i++) {
      this.px[i]    = (Math.random() - 0.5) * W * 2;
      this.py[i]    = (Math.random() - 0.5) * H * 2;
      this.pz[i]    = (Math.random() - 0.5) * 1000;
      this.vx[i]    = this.vy[i] = this.vz[i] = 0;
      this.gradT[i] = i / N;
      this.phase[i] = Math.random() * Math.PI * 2;
    }
  }

  // ── Text sampling ────────────────────────────────────────────────────────

  _sampleText(phrase) {
    const { W, H } = this;
    const cW = Math.floor(W), cH = Math.floor(H);
    const off = document.createElement('canvas');
    off.width = cW; off.height = cH;
    const c2 = off.getContext('2d');

    const words  = phrase.split(' ');
    const lines  = [];
    const maxCh  = 12;
    let cur = '';
    words.forEach(w => {
      if ((cur + w).length > maxCh) { lines.push(cur.trim()); cur = w + ' '; }
      else cur += w + ' ';
    });
    lines.push(cur.trim());

    const fs = Math.min(cW * 0.72 / (maxCh * 0.5), cH * 0.50 / lines.length, 180);
    c2.fillStyle = '#fff';
    c2.font = `900 ${fs}px Arial Black, Arial, sans-serif`;
    c2.textAlign = 'center';
    c2.textBaseline = 'middle';

    const lh = fs * 1.1;
    const startY = cH / 2 - ((lines.length - 1) * lh / 2);
    lines.forEach((l, i) => c2.fillText(l, cW / 2, startY + i * lh));

    const data = c2.getImageData(0, 0, cW, cH).data;
    const pts  = [];
    for (let y = 0; y < cH; y++) {
      for (let x = 0; x < cW; x++) {
        if (data[(y * cW + x) * 4 + 3] > 120) {
          pts.push(
            x - cW / 2 + (Math.random() - 0.5) * 0.8,
            y - cH / 2 + (Math.random() - 0.5) * 0.8
          );
        }
      }
    }
    // Fisher-Yates shuffle on point pairs
    for (let i = pts.length / 2 - 1; i > 0; i--) {
      const j  = Math.floor(Math.random() * (i + 1));
      const ia = i * 2, ja = j * 2;
      let tmp = pts[ia]; pts[ia] = pts[ja]; pts[ja] = tmp;
      tmp = pts[ia + 1]; pts[ia + 1] = pts[ja + 1]; pts[ja + 1] = tmp;
    }
    return pts;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  formWord(phrase) {
    if (!phrase.trim()) return;
    this.state = 1;
    const pts    = this._sampleText(phrase);
    const pCount = pts.length / 2;
    for (let i = 0; i < this.N; i++) {
      const idx    = (i % pCount) * 2;
      this.tx[i]   = pts[idx];
      this.ty[i]   = pts[idx + 1];
      this.tz[i]   = 0;
    }
    this.rotY = 0; this.t = 0;
    clearTimeout(this._ft);
    this._ft = setTimeout(() => { this.state = 2; }, 1800);
  }

  resetSphere() {
    this.state = 0;
    this._initSphereTargets();
    if (this.onReset) this.onReset();
  }

  start() {
    this._loop();
  }

  // ── Color ────────────────────────────────────────────────────────────────

  _lerp(a, b, t) { return a + (b - a) * t; }

  _particleColor(gradT, brightBoost) {
    const { colorA: A, colorB: B } = this;
    const h = this._lerp(A.h, B.h, gradT);
    const s = this._lerp(A.s, B.s, gradT);
    const l = this._lerp(A.l, B.l, gradT) + (brightBoost || 0);
    return `${h},${s}%,${l}%`;
  }

  // ── Physics ──────────────────────────────────────────────────────────────

  _update() {
    const { N, FOV, CAMERA_Z, repelR, repelF } = this;
    this.t += 0.005;
    if (this.state === 0) this.rotY += 0.006;
    const jitter = this.state === 0 ? 1.8 : 0;

    for (let i = 0; i < N; i++) {
      const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
      let tX =  this.tx[i] * cosY - this.tz[i] * sinY;
      let tY =  this.ty[i];
      let tZ =  this.tx[i] * sinY + this.tz[i] * cosY;

      if (this.state === 0) {
        tX += Math.sin(this.t * 8 + this.phase[i]) * jitter;
        tY += Math.cos(this.t * 9 + this.phase[i]) * jitter;
        tZ += Math.sin(this.t * 7 + this.phase[i] * 2) * jitter;
      }

      const sp = this.state === 0 ? 0.020 : 0.022;
      this.vx[i] += (tX - this.px[i]) * sp;
      this.vy[i] += (tY - this.py[i]) * sp;
      this.vz[i] += (tZ - this.pz[i]) * sp;

      // Mouse repulsion (screenspace projection)
      if (this.state >= 1 && this.mouseX > 0) {
        const scale = FOV / (FOV + this.pz[i] + CAMERA_Z);
        const sx = this.px[i] * scale + this.CX;
        const sy = this.py[i] * scale + this.CY;
        const rdx = sx - this.mouseX, rdy = sy - this.mouseY;
        const d2 = rdx * rdx + rdy * rdy;
        if (d2 < repelR * repelR && d2 > 1) {
          const d   = Math.sqrt(d2);
          const mag = repelF * (1 - d / repelR) * 5;
          this.vx[i] += (rdx / d) * mag;
          this.vy[i] += (rdy / d) * mag;
        }
      }

      this.vx[i] *= 0.82; this.vy[i] *= 0.82; this.vz[i] *= 0.82;
      this.px[i] += this.vx[i];
      this.py[i] += this.vy[i];
      this.pz[i] += this.vz[i];
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  _draw() {
    const { ctx, W, H, N, FOV, CAMERA_Z, CX, CY, bgR, bgG, bgB } = this;

    ctx.fillStyle = `rgba(${bgR},${bgG},${bgB},0.20)`;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < N; i++) {
      const zPos = this.pz[i] + CAMERA_Z;
      if (zPos < 10) continue;
      const scale = FOV / zPos;
      const sx = this.px[i] * scale + CX;
      const sy = this.py[i] * scale + CY;

      const spd  = Math.sqrt(this.vx[i] ** 2 + this.vy[i] ** 2 + this.vz[i] ** 2);
      let   a    = Math.min(1, (0.18 + spd * 0.1) * (scale * 0.65));
      let   size = (0.4 + spd * 0.12) * scale;
      let   col;

      if (this.state >= 1) {
        col   = this._particleColor(this.gradT[i], 0);
        a     = Math.min(1, a * 1.6);
        size *= 0.9;
      } else {
        // Sphere: cycle gradient slowly
        const t = (this.gradT[i] + this.t * 0.08) % 1;
        col = this._particleColor(t, 18);
      }

      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, 6.2832);
      ctx.fillStyle = `hsla(${col},${a})`;
      ctx.fill();
    }

    // Cursor glow in repel state
    if (this.state >= 1 && this.mouseX > 0) {
      const grd = ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, this.repelR
      );
      grd.addColorStop(0, 'rgba(34,197,94,0.07)');
      grd.addColorStop(1, 'rgba(34,197,94,0)');
      ctx.beginPath();
      ctx.arc(this.mouseX, this.mouseY, this.repelR, 0, 6.2832);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }

  _loop() {
    this._update();
    this._draw();
    requestAnimationFrame(() => this._loop());
  }

  // ── Events ───────────────────────────────────────────────────────────────

  _bindEvents() {
    this.canvas.addEventListener('mousemove', e => {
      this.mouseX = e.clientX; this.mouseY = e.clientY;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -9999; this.mouseY = -9999;
    });
    this.canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      this.mouseX = e.touches[0].clientX;
      this.mouseY = e.touches[0].clientY;
    }, { passive: false });
    this.canvas.addEventListener('touchend', () => {
      this.mouseX = -9999; this.mouseY = -9999;
    });
    this.canvas.addEventListener('dblclick', () => this.resetSphere());
    window.addEventListener('resize', () => {
      this.ctx.resetTransform();
      this._resize();
    });
  }
}
