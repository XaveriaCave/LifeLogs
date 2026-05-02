// LifeLogs — Geometric Particle System (COD style)
// Rectangles, squares, lines as particles

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const shapes = ['rect', 'square', 'line', 'cross', 'bracket'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const colors = ['#00ff9d', '#ffd700', '#4ecdc4', '#a29bfe', '#fd79a8'];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      shape,
      size: Math.random() * 8 + 2,
      alpha: Math.random() * 0.25 + 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005
    };
  }

  drawParticle(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
    ctx.strokeStyle = p.color;
    ctx.fillStyle = p.color;
    ctx.lineWidth = 0.8;

    switch (p.shape) {
      case 'rect':
        ctx.strokeRect(-p.size * 1.5, -p.size * 0.5, p.size * 3, p.size);
        break;
      case 'square':
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(-p.size * 2, 0);
        ctx.lineTo(p.size * 2, 0);
        ctx.stroke();
        break;
      case 'cross':
        ctx.beginPath();
        ctx.moveTo(-p.size, 0); ctx.lineTo(p.size, 0);
        ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
        ctx.stroke();
        break;
      case 'bracket':
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(s * 0.5, -s); ctx.lineTo(-s * 0.5, -s);
        ctx.moveTo(-s * 0.5, -s); ctx.lineTo(-s * 0.5, s);
        ctx.moveTo(-s * 0.5, s); ctx.lineTo(s * 0.5, s);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  animate() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.pulse += p.pulseSpeed;

      if (p.x < -20) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.canvas.height + 20;
      if (p.y > this.canvas.height + 20) p.y = -20;

      this.drawParticle(p);
    });

    requestAnimationFrame(() => this.animate());
  }
}

window.ParticleSystem = ParticleSystem;
