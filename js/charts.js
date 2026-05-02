// LifeLogs — Canvas Chart Renderer
// Custom canvas-based projection charts

const CHARTS = {

  // ─── Line Chart (Salary/Savings Projection) ───────────────────────────────

  drawLineChart(canvasId, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const cW = canvas.offsetWidth;
    const cH = canvas.offsetHeight;

    const PAD = { top: 30, right: 20, bottom: 50, left: 70 };
    const chartW = cW - PAD.left - PAD.right;
    const chartH = cH - PAD.top - PAD.bottom;

    ctx.clearRect(0, 0, cW, cH);

    // Background grid lines
    const allValues = datasets.flatMap(d => d.data.map(p => p.value));
    const maxVal = Math.max(...allValues) * 1.15;
    const years = datasets[0]?.data.map(p => p.year) || [1, 2, 3, 5, 7, 10];

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + (chartH * i / 5);
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();

      // Y labels
      const val = maxVal * (1 - i / 5);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(ENGINE.formatINR(val), PAD.left - 6, y + 3);
    }

    // X axis labels
    years.forEach((yr, i) => {
      const x = PAD.left + (i / (years.length - 1)) * chartW;
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Y${yr}`, x, PAD.top + chartH + 20);

      // Vertical grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + chartH);
      ctx.stroke();
    });

    // Axis lines
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.lineTo(PAD.left + chartW, PAD.top + chartH);
    ctx.stroke();

    // Draw datasets
    datasets.forEach(dataset => {
      const points = dataset.data.map((pt, i) => ({
        x: PAD.left + (i / (years.length - 1)) * chartW,
        y: PAD.top + chartH - (pt.value / maxVal) * chartH
      }));

      // Area fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, PAD.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, PAD.top + chartH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + chartH);
      grad.addColorStop(0, dataset.color + '30');
      grad.addColorStop(1, dataset.color + '05');
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) * 0.4;
        const cp1y = points[i - 1].y;
        const cp2x = points[i].x - (points[i].x - points[i - 1].x) * 0.4;
        const cp2y = points[i].y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
      }
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots
      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = dataset.color;
        ctx.fill();
        ctx.strokeStyle = '#020408';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // Legend
    if (options.legend) {
      datasets.forEach((ds, i) => {
        const lx = PAD.left + i * 130;
        const ly = 14;
        ctx.fillStyle = ds.color;
        ctx.fillRect(lx, ly - 5, 20, 2);
        ctx.beginPath();
        ctx.arc(lx + 10, ly - 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(ds.label, lx + 28, ly);
      });
    }
  },

  // ─── Radar Chart (Compare Paths) ─────────────────────────────────────────

  drawRadarChart(canvasId, datasets, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const cW = canvas.offsetWidth;
    const cH = canvas.offsetHeight;
    const cx = cW / 2;
    const cy = cH / 2;
    const R = Math.min(cW, cH) * 0.35;
    const N = labels.length;

    ctx.clearRect(0, 0, cW, cH);

    // Web rings
    for (let ring = 1; ring <= 5; ring++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const r = (ring / 5) * R;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${ring === 5 ? 0.12 : 0.06})`;
      ctx.lineWidth = ring === 5 ? 1 : 0.5;
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Labels
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const lx = cx + Math.cos(angle) * (R + 22);
      const ly = cy + Math.sin(angle) * (R + 22);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'bold 8px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], lx, ly);
    }

    // Data polygons
    datasets.forEach(ds => {
      ctx.beginPath();
      ds.values.forEach((val, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const r = (val / 100) * R;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = ds.color + '25';
      ctx.fill();
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots
      ds.values.forEach((val, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const r = (val / 100) * R;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 3, 0, Math.PI * 2);
        ctx.fillStyle = ds.color;
        ctx.fill();
      });
    });
  },

  // ─── Bar Chart (Monthly Savings Breakdown) ───────────────────────────────

  drawBarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const cW = canvas.offsetWidth;
    const cH = canvas.offsetHeight;
    const PAD = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = cW - PAD.left - PAD.right;
    const chartH = cH - PAD.top - PAD.bottom;
    const maxVal = Math.max(...data.map(d => d.value)) * 1.2;
    const barW = (chartW / data.length) * 0.6;
    const gap = chartW / data.length;

    ctx.clearRect(0, 0, cW, cH);

    // Horizontal grid
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (chartH * i / 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(ENGINE.formatINR(maxVal * (1 - i / 4)), PAD.left - 4, y + 3);
    }

    data.forEach((d, i) => {
      const x = PAD.left + gap * i + gap / 2 - barW / 2;
      const barH = (d.value / maxVal) * chartH;
      const y = PAD.top + chartH - barH;

      // Bar with gradient
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, d.color || '#00ff9d');
      grad.addColorStop(1, (d.color || '#00ff9d') + '40');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW, barH);

      // Top border highlight
      ctx.fillStyle = d.color || '#00ff9d';
      ctx.fillRect(x, y, barW, 2);

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW / 2, PAD.top + chartH + 20);
    });
  }
};

window.CHARTS = CHARTS;
