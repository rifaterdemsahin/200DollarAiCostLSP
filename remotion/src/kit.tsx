// Reusable animation primitives. Copy this file to any new Short.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EMOJI, FONT } from "./theme";

export const useSpring = (delay = 0, cfg = { damping: 9, stiffness: 140, mass: .7 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: cfg });
};
export const Emoji: React.FC<{ c: string; size?: number; style?: React.CSSProperties }> = ({ c, size = 200, style }) =>
  <div style={{ fontFamily: EMOJI, fontSize: size, lineHeight: 1, ...style }}>{c}</div>;

export const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 150, color = C.ink, style }) =>
  <div style={{ fontFamily: FONT, fontSize: size, color, textAlign: "center", lineHeight: 1.02, textTransform: "uppercase",
    textShadow: "0 8px 0 rgba(0,0,0,.35)", WebkitTextStroke: "2px rgba(0,0,0,.25)", ...style }}>{children}</div>;

export const Pop: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const s = useSpring(delay);
  return <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -12}deg)`, opacity: Math.min(1, s * 2), ...style }}>{children}</div>;
};
export const Shake: React.FC<{ amp?: number; children: React.ReactNode }> = ({ amp = 10, children }) => {
  const f = useCurrentFrame();
  return <div style={{ transform: `translate(${Math.sin(f * 2.3) * amp}px, ${Math.cos(f * 3.1) * amp}px) rotate(${Math.sin(f * 1.7) * amp / 8}deg)` }}>{children}</div>;
};
export const Fill: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) =>
  <div style={{ position: "absolute", inset: 0, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, paddingBottom: 380, overflow: "hidden" }}>{children}</div>;

export const SpeedLines: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,.18)" }) => {
  const f = useCurrentFrame();
  return <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 22 }).map((_, i) => {
      const y = (i * 91 + f * (30 + (i % 5) * 12)) % 2100 - 100;
      return <rect key={i} x={(i * 137) % 1000} y={y} width={180 + (i % 4) * 90} height={6 + (i % 3) * 4} rx={4} fill={color} />;
    })}
  </svg>;
};
export const Confetti: React.FC<{ from?: number }> = ({ from = 0 }) => {
  const f = useCurrentFrame() - from; const cols = [C.red, C.green, C.yellow, C.blue, C.purple];
  if (f < 0) return null;
  return <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 70 }).map((_, i) => {
      const a = (i * 2.399) % (Math.PI * 2), v = 10 + (i % 7) * 4;
      const x = 540 + Math.cos(a) * v * f * .9, y = 900 + Math.sin(a) * v * f * .9 + .5 * f * f * .9;
      return <rect key={i} x={x} y={y} width={18} height={26} fill={cols[i % 5]} transform={`rotate(${f * (i % 9) * 4} ${x} ${y})`} />;
    })}
  </svg>;
};
export const useWordT = () => { const f = useCurrentFrame(); return f; };
export const ease = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
