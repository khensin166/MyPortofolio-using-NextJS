"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

// THEME CONFIGURATIONS
const themeConfigs = {
  forest: {
    colors: ["#ead161", "#fbe400", "#fffa86", "#c2a725"],
    shape: "star",
    playSound: () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const playTone = (freq: number, startTime: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
          gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + startTime + duration * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
          osc.start(ctx.currentTime + startTime);
          osc.stop(ctx.currentTime + startTime + duration);
        };
        playTone(880, 0, 0.3);
        playTone(1108.73, 0.05, 0.3);
        playTone(1318.51, 0.1, 0.4);
        playTone(1760, 0.15, 0.5);
      } catch (e) {}
    }
  },
  dark: {
    colors: ["#818cf8", "#a78bfa", "#c084fc", "#e879f9"], // Purple/indigo hues
    shape: "diamond",
    playSound: () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        // Soft, quiet, deep sound (senyap-senyap)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05); // Very soft
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {}
    }
  },
  light: {
    colors: ["#38bdf8", "#34d399", "#fbbf24", "#fb923c"], // Cheerful bright colors
    shape: "circle",
    playSound: () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        // Quick, cheerful bubble/pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    }
  }
};

const ThemeMagicClick = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    // Determine active theme (default to light if undefined)
    const activeTheme = (theme === "forest" || theme === "dark" || theme === "light") ? theme : "light";
    const config = themeConfigs[activeTheme as keyof typeof themeConfigs];
    
    // Play sound based on theme
    config.playSound();

    // Spawn 5-8 particles
    const numParticles = Math.floor(Math.random() * 4) + 5;
    const newParticles: Particle[] = Array.from({ length: numParticles }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 10;
      return {
        id: Date.now() + Math.random(),
        x: e.clientX + Math.cos(angle) * distance,
        y: e.clientY + Math.sin(angle) * distance,
        size: Math.random() * 10 + 8,
        rotation: Math.random() * 360,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  }, [theme]);

  useEffect(() => {
    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [handleGlobalClick]);

  if (!theme) return null;

  const renderShape = (themeMode: string) => {
    if (themeMode === "forest") {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      );
    }
    if (themeMode === "dark") {
      // Diamond
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M12 2l10 10-10 10L2 12z" />
        </svg>
      );
    }
    // Circle for light
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  };

  const activeTheme = (theme === "forest" || theme === "dark" || theme === "light") ? theme : "light";

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, x: particle.x, y: particle.y, scale: 0, rotate: particle.rotation }}
            animate={{
              opacity: 0,
              y: particle.y - 40 - Math.random() * 40,
              x: particle.x + (Math.random() - 0.5) * 40,
              scale: 1.5,
              rotate: particle.rotation + 90,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute"
            style={{ width: particle.size, height: particle.size, color: particle.color }}
          >
            {renderShape(activeTheme)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ThemeMagicClick;
