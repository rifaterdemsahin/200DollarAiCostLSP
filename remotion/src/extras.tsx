// Logos hook, camera layer + overlays, Ronaldinho photos, bank account, Land Rover.
import React from "react";
import { Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import data from "../public/data.json";
import eyes from "../public/eyes.json";
import { C, FONT, MONO } from "./theme";
import { Big, Emoji, Pop, ease, useSpring, Confetti } from "./kit";

// ---------- frontier lab logos (hook, 0:00) ----------
const LABS: { name: string; file?: string }[] = [
  { name: "Anthropic", file: "anthropic" }, { name: "OpenAI", file: "openai" }, { name: "Gemini", file: "googlegemini" },
  { name: "Meta", file: "meta" }, { name: "Mistral", file: "mistralai" }, { name: "DeepSeek", file: "deepseek" }, { name: "xAI" },
];
export const Logos: React.FC = () => (
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, width: 980 }}>
    {LABS.map((l, i) => (
      <Pop key={l.name} delay={4 + i * 3} style={{ width: 215 }}>
        <div style={{ background: "#fff", borderRadius: 30, height: 190, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 0 rgba(0,0,0,.35)" }}>
          {l.file ? <Img src={staticFile(`logos/${l.file}.svg`)} style={{ width: 110, height: 110 }} /> : <div style={{ fontFamily: FONT, fontSize: 80, color: "#000" }}>xAI</div>}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 30, color: "#fff", textAlign: "center", marginTop: 8 }}>{l.name}</div>
      </Pop>
    ))}
  </div>
);

// ---------- camera layer: my video, lip-synced via waveform offset; cam audio is never played ----------
// final-timeline seconds -> camera-clip seconds (cam.mp4 is the uncut take; voice has cuts, so skip the removed ranges)
export const clipTime = (finalSec: number) => { let t = finalSec - data.voice_delay; for (const c of data.cuts) if (t >= c.at) t += c.len; return t; };
export const CamLayer: React.FC<{ from: number; inner?: React.ReactNode; children?: React.ReactNode }> = ({ from, inner, children }) => {
  const f = useCurrentFrame();
  const ZOOM = 1.22;                                   // A-roll base zoom, centred on the face (origin 50% 42%)
  const sc = ZOOM + ease(f, 0, 7, .14, 0) + f * .0009;   // + entry punch + slow push-in
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 42%", transform: `scale(${sc})` }}>
      <OffthreadVideo src={staticFile("cam.mp4")} startFrom={Math.max(0, Math.round(clipTime(from / data.fps) * data.fps))} muted style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      {inner}   {/* props tracked to the face share the video's zoom */}
    </div>
    {f < 4 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: .85 - f * .2 }} />}
    {children}
  </div>;
};
// eye position at a camera-clip time (Vision tracker, 10 fps, light smoothing)
const eyeAt = (t: number) => {
  const k = t * 10, i = Math.floor(k), r = k - i; const g = (j: number) => eyes[Math.max(0, Math.min(eyes.length - 1, j))] as any;
  const sm = (j: number) => { let x = 0, y = 0, d = 0, rl = 0; for (let q = -2; q <= 2; q++) { const e = g(j + q); x += (e.lx + e.rx) / 2; y += (e.ly + e.ry) / 2; d += Math.abs(e.rx - e.lx); rl += Math.atan2((e.ry - e.ly) * 1920, (e.rx - e.lx) * 1080); } return { x: x / 5, y: y / 5, d: d / 5, a: rl / 5 }; };
  const A = sm(i), B = sm(i + 1); const m = (a: number, b: number) => a + (b - a) * r;
  return { x: m(A.x, B.x) * 1080, y: m(A.y, B.y) * 1920, d: m(A.d, B.d) * 1080, a: m(A.a, B.a) * 180 / Math.PI };
};
// sunglasses locked to the eyes (drop in, then follow the head)
export const EyeGlasses: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame(); const drop = useSpring(24, { damping: 7, stiffness: 160, mass: 1 });
  if (f < 24) return null;
  const e = eyeAt(clipTime(from / data.fps + f / data.fps)); const W = e.d * 2.25, H = W * .4;
  return <svg width={W} height={H} viewBox="0 0 200 80" style={{ position: "absolute", left: e.x - W / 2, top: e.y - H * .45 - (1 - drop) * 1100, transform: `rotate(${e.a}deg)`, overflow: "visible" }}>
    <path d="M0 22 L12 18 M200 22 L188 18" stroke="#000" strokeWidth="7" strokeLinecap="round" />
    <rect x="8" y="12" width="84" height="56" rx="22" fill="#0a0a0a" stroke="#000" strokeWidth="6" /><rect x="108" y="12" width="84" height="56" rx="22" fill="#0a0a0a" stroke="#000" strokeWidth="6" />
    <path d="M92 28 Q100 20 108 28" stroke="#000" strokeWidth="7" fill="none" />
    <path d="M22 24 L48 24 L36 48 L22 48 Z" fill="#fff" opacity=".18" /><path d="M122 24 L148 24 L136 48 L122 48 Z" fill="#fff" opacity=".18" />
  </svg>;
};
const Banner: React.FC<{ children: React.ReactNode; top?: number; color?: string; delay?: number; size?: number }> = ({ children, top = 160, color = "#fff", delay = 4, size = 96 }) =>
  <Pop delay={delay} style={{ position: "absolute", top, left: 0, width: 1080 }}><Big size={size} color={color} style={{ WebkitTextStroke: "10px #000", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{children}</Big></Pop>;

export const CamCarPay: React.FC = () => { const f = useCurrentFrame(); return <>
  <Banner color={C.red}>$200 / month</Banner>
  <Pop delay={36} style={{ position: "absolute", top: 1010, left: 100, transform: "rotate(-8deg)" }}><div style={{ border: `12px solid ${C.yellow}`, padding: "12px 40px", borderRadius: 18, background: "#000a" }}><Big size={110} color={C.yellow}>car payment</Big></div></Pop>
  {Array.from({ length: 8 }).map((_, i) => <Emoji key={i} c="💸" size={110} style={{ position: "absolute", left: (i * 149) % 960, top: ((f * (10 + i) + i * 230) % 2000) - 100, opacity: .9 }} />)}
</>; };
export const CamGuess: React.FC = () => { const f = useCurrentFrame(); return <>
  <Banner color={C.yellow} size={80}>cheap models guess</Banner>
  {["❓", "🎲", "❓", "🐒", "❓"].map((e, i) => <Emoji key={i} c={e} size={170} style={{ position: "absolute", left: [60, 780, 30, 800, 420][i], top: [450, 520, 900, 960, 1180][i] + Math.sin(f / 5 + i) * 25, transform: `rotate(${Math.sin(f / 6 + i) * 15}deg)` }} />)}
</>; };
export const CamShades: React.FC = () => <>
  <Banner color={C.green}>distilled + LSP</Banner>
  <Pop delay={52} style={{ position: "absolute", top: 1100, left: 0, width: 1080 }}><Big size={150} color={C.yellow} style={{ WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>smart enough</Big></Pop>
</>;

// ---------- relaxed man + bank account (wallet gets relaxed) ----------
export const CamBank: React.FC = () => {
  const f = useCurrentFrame(); const s = useSpring(10); const bal = Math.round(ease(f, 14, 60, 0, 200));
  return <>
    <Banner color={C.green} size={110}>relaxed 😌</Banner>
    <div style={{ position: "absolute", top: 1010, left: 100, width: 880, background: "#fff", color: "#0b0b14", borderRadius: 32, padding: "26px 34px", transform: `scale(${s}) rotate(${(1 - s) * 6}deg)`, boxShadow: "0 18px 0 rgba(0,0,0,.4)" }}>
      <div style={{ fontFamily: FONT, fontSize: 38, display: "flex", justifyContent: "space-between" }}><span>🏦 Bank account</span><span style={{ color: "#12a56a" }}>● live</span></div>
      <div style={{ fontFamily: FONT, fontSize: 130, color: "#12a56a", lineHeight: 1.1 }}>+${bal}.00</div>
      <div style={{ fontFamily: MONO, fontSize: 28, color: "#555" }}>saved this month · big sub <span style={{ color: C.red }}>cancelled ✖</span></div>
    </div>
    {f > 50 && <Confetti from={50} />}
  </>;
};

// ---------- Land Rover: user photo img/landrover.jpg (number plates blurred) ----------
export const CamLandRover: React.FC = () => {
  const f = useCurrentFrame(); const x = ease(f, 18, 34, -1100, 100); const settle = f > 34 ? Math.sin((f - 34) * 1.3) * Math.max(0, 8 - (f - 34) * .4) : 0;
  return <>
    <Banner color={C.yellow} top={140}>keep the car</Banner>
    <div style={{ position: "absolute", top: 1000 + settle, left: x, width: 880, border: "14px solid #fff", borderRadius: 24, overflow: "hidden", transform: "rotate(-3deg)", boxShadow: "0 24px 60px #000a" }}><Img src={staticFile("img/landrover.jpg")} style={{ width: "100%", display: "block" }} /></div>
    <div style={{ position: "absolute", top: 880, right: 50, transformOrigin: "50% 0", transform: `rotate(${f > 40 ? Math.sin(f * 1.1) * 28 * Math.max(0, 1 - (f - 40) / 70) : 0}deg)`, opacity: f > 30 ? 1 : 0 }}><Emoji c="🔑" size={190} /></div>
    <Pop delay={52} style={{ position: "absolute", top: 280, left: 120 }}><div style={{ background: "#fff", color: "#0b0b14", fontFamily: FONT, fontSize: 46, padding: "16px 26px", borderRadius: 22, textAlign: "center", textTransform: "uppercase", transform: "rotate(-3deg)" }}>Kilo + cheap model + <span style={{ color: "#12a56a" }}>LSP on</span></div></Pop>
    <Confetti from={50} />
  </>;
};

// ---------- Ronaldinho / Ronaldo photos (user-provided files) ----------
export const Ronaldinho: React.FC = () => {
  const f = useCurrentFrame(); const a = useSpring(0, { damping: 8, stiffness: 150, mass: .8 }); const b = useSpring(8, { damping: 8, stiffness: 150, mass: .8 });
  return <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#10182b,#000)", overflow: "hidden" }}>
    <Banner color={C.yellow} top={130} size={88}>no Ronaldinho</Banner>
    <div style={{ position: "absolute", top: 420, left: 40, width: 600, height: 600, borderRadius: 30, overflow: "hidden", border: "10px solid #fff", transform: `translateX(${(1 - a) * -700}px) rotate(-6deg) scale(${1 + Math.sin(f / 8) * .02})`, boxShadow: "0 20px 60px #000" }}><Img src={staticFile("img/ronaldini.jpeg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <div style={{ position: "absolute", top: 700, right: 40, width: 440, height: 660, borderRadius: 30, overflow: "hidden", border: "10px solid #fff", transform: `translateX(${(1 - b) * 700}px) rotate(5deg)`, boxShadow: "0 20px 60px #000" }}><Img src={staticFile("img/ronaldo.jpeg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <Pop delay={14} style={{ position: "absolute", top: 1080, left: 120 }}><Emoji c="🚫" size={300} /></Pop>
  </div>;
};

