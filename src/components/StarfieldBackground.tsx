import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  driftX: number;
  driftY: number;
  color: string;
  glowColor: string;
  isHero: boolean;
}

interface MeteorParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  startX: number;
  startY: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  tailWidth: number;
  color: string;
  glowColor: string;
  active: boolean;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvasSize();

    // Vibrant celestial color palette
    const starColorSchemes = [
      { color: '#ffffff', glow: '#bae6fd' },
      { color: '#f0f9ff', glow: '#38bdf8' },
      { color: '#e0f2fe', glow: '#0ea5e9' },
      { color: '#7dd3fc', glow: '#0284c7' },
      { color: '#38bdf8', glow: '#00f0ff' },
      { color: '#c084fc', glow: '#a855f7' },
      { color: '#fef08a', glow: '#eab308' },
    ];

    // High star density for a vivid, prominent cosmic sky
    const starCount = Math.min(Math.max(Math.floor((width * height) / 3400), 160), 380);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const isHero = Math.random() < 0.16; // 16% prominent hero stars
      const radius = isHero
        ? Math.random() * 1.4 + 1.8 // 1.8px - 3.2px
        : Math.random() * 1.1 + 0.8; // 0.8px - 1.9px

      const scheme = starColorSchemes[Math.floor(Math.random() * starColorSchemes.length)];

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseAlpha: isHero ? Math.random() * 0.25 + 0.75 : Math.random() * 0.35 + 0.55,
        twinkleSpeed: Math.random() * 0.03 + 0.012,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: (Math.random() - 0.5) * 0.08,
        color: scheme.color,
        glowColor: scheme.glow,
        isHero,
      });
    }

    // Active Shooting Stars & Stardust sparks
    const shootingStars: ShootingStar[] = [];
    const particles: MeteorParticle[] = [];
    let nextSpawnTime = performance.now() + 1000;

    const createShootingStar = (forceLong: boolean = false) => {
      // Natural falling angle: 32° to 52° diagonal across the sky
      const angle = (Math.PI / 180) * (Math.random() * 20 + 32);
      const isLargeMeteor = forceLong || Math.random() < 0.35;
      const startX = Math.random() * (width * 0.85);
      const startY = Math.random() * (height * 0.42);

      const meteorSchemes = [
        { color: '#ffffff', glow: '#38bdf8' },
        { color: '#e0f2fe', glow: '#0ea5e9' },
        { color: '#fef08a', glow: '#f59e0b' },
        { color: '#e0e7ff', glow: '#6366f1' },
      ];
      const scheme = meteorSchemes[Math.floor(Math.random() * meteorSchemes.length)];

      shootingStars.push({
        x: startX,
        y: startY,
        startX,
        startY,
        length: isLargeMeteor ? Math.random() * 70 + 130 : Math.random() * 45 + 85,
        speed: isLargeMeteor ? Math.random() * 5 + 13 : Math.random() * 4 + 9,
        angle,
        alpha: 1,
        tailWidth: isLargeMeteor ? 2.5 : 1.6,
        color: scheme.color,
        glowColor: scheme.glow,
        active: true,
      });
    };

    const spawnShootingStars = (now: number) => {
      if (now > nextSpawnTime && shootingStars.length < 3) {
        createShootingStar();

        // 20% chance of a twin meteor glide!
        if (Math.random() < 0.2) {
          setTimeout(() => {
            createShootingStar(false);
          }, 350 + Math.random() * 400);
        }

        // Next meteor slides down every 2.0 to 4.5 seconds
        nextSpawnTime = now + Math.random() * 2500 + 2000;
      }
    };

    const onResize = () => {
      setupCanvasSize();
    };

    window.addEventListener('resize', onResize);

    // Render loop - NO mouse tracking, pure fluid starry sky
    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Visible, Twinkling Night Sky Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Cosmic slow autonomous drift
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap around borders
        if (star.x < 0) star.x += width;
        if (star.x > width) star.x -= width;
        if (star.y < 0) star.y += height;
        if (star.y > height) star.y -= height;

        // Twinkle effect
        star.phase += star.twinkleSpeed;
        const twinkle = Math.sin(star.phase);
        const currentAlpha = Math.max(0.35, Math.min(1, star.baseAlpha + twinkle * 0.35));

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;

        // Glowing halo for hero & medium stars
        if (star.isHero) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = star.glowColor;
        } else if (star.radius > 1.3) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = star.glowColor;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Sparkling 4-point cross diffraction spikes on prominent stars at peak brightness
        if (star.isHero && twinkle > 0.45) {
          const spikeLength = star.radius * 2.8;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeLength, star.y);
          ctx.lineTo(star.x + spikeLength, star.y);
          ctx.moveTo(star.x, star.y - spikeLength);
          ctx.lineTo(star.x, star.y + spikeLength);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.7;
          ctx.globalAlpha = (twinkle - 0.45) * currentAlpha * 0.9;
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0;

      // 2. Spawn and Animate Periodic Shooting Stars (流星滑落)
      spawnShootingStars(now);

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Head (front tip) & Tail coordinates
        const headX = ss.x + Math.cos(ss.angle) * ss.speed;
        const headY = ss.y + Math.sin(ss.angle) * ss.speed;
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        // Gradient for the luminous meteor tail
        const tailGradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
        tailGradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
        tailGradient.addColorStop(0.5, `rgba(186, 230, 253, ${ss.alpha * 0.4})`);
        tailGradient.addColorStop(0.85, `rgba(255, 255, 255, ${ss.alpha * 0.85})`);
        tailGradient.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        // Draw meteor streak tail
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = tailGradient;
        ctx.lineWidth = ss.tailWidth;
        ctx.lineCap = 'round';
        ctx.globalAlpha = ss.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = ss.glowColor;
        ctx.stroke();

        // Draw bright incandescent meteor head
        ctx.beginPath();
        ctx.arc(headX, headY, ss.tailWidth * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.shadowColor = ss.glowColor;
        ctx.globalAlpha = ss.alpha;
        ctx.fill();

        // Spawn a trailing stardust spark behind the head
        if (Math.random() < 0.6) {
          particles.push({
            x: headX - Math.cos(ss.angle) * (Math.random() * 20),
            y: headY - Math.sin(ss.angle) * (Math.random() * 20),
            size: Math.random() * 1.5 + 0.6,
            alpha: ss.alpha * 0.8,
            decay: 0.035 + Math.random() * 0.02,
            color: ss.color,
          });
        }

        // Advance meteor
        ss.x = headX;
        ss.y = headY;
        ss.alpha -= 0.012; // Smooth fade duration

        // Expire if faded or left the screen
        if (ss.alpha <= 0 || ss.x > width + 150 || ss.y > height + 150) {
          ss.active = false;
        }
      }

      // 3. Render Meteor Stardust Sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
      aria-hidden="true"
    />
  );
};
