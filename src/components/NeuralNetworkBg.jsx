import { useEffect, useRef } from 'react';

const NeuralNetworkBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    let pulses = [];
    const NUM_NODES = 50;
    const CONNECTION_DIST = 180;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', resize);
    resize();

    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2.5 + 1.5;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Gentle breathing pulse
        this.currentRadius = this.radius + Math.sin(time * 0.002 + this.pulsePhase) * 0.8;
      }

      draw() {
        // Glow (approximated via overlapping circles)
        ctx.fillStyle = 'rgba(139, 92, 246, 0.04)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Pulse {
      constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.progress = 0;
        this.speed = 0.008 + Math.random() * 0.012;
        this.alive = true;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.alive = false;
        }
      }

      draw() {
        const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
        const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
        const alpha = Math.sin(this.progress * Math.PI) * 0.8;

        ctx.fillStyle = `rgba(0, 188, 212, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(0, 188, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Init nodes
    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push(new Node());
    }

    let lastPulseTime = 0;

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw connections
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(time);
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 32400) { // 180 * 180
            const dist = Math.sqrt(distSq) || 1;
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        node.draw();
      }

      // Spawn random pulses along connections
      if (time - lastPulseTime > 600) {
        lastPulseTime = time;
        // Pick a random node pair that's connected
        const i = Math.floor(Math.random() * nodes.length);
        const j = Math.floor(Math.random() * nodes.length);
        if (i !== j) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 32400) { // 180 * 180
            pulses.push(new Pulse(nodes[i], nodes[j]));
          }
        }
      }

      // Update & draw pulses
      pulses = pulses.filter(p => p.alive);
      for (const pulse of pulses) {
        pulse.update();
        pulse.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default NeuralNetworkBg;
