// Logos hook, camera layer + overlays, Ronaldinho photos, bank account, Land Rover.
import React from "react";
import { Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import data from "../public/data.json";
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
export const CamLayer: React.FC<{ from: number; children?: React.ReactNode }> = ({ from, children }) => {
  const f = useCurrentFrame(); const H = data.voice_delay * data.fps;
  const ZOOM = 1.22;                                   // A-roll base zoom, centred on the face (origin 50% 42%)
  const sc = ZOOM + ease(f, 0, 7, .14, 0) + f * .0009;   // + entry punch + slow push-in
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 42%", transform: `scale(${sc})` }}>
      <OffthreadVideo src={staticFile("cam.mp4")} startFrom={Math.max(0, Math.round(from - H))} muted style={{ width: 1080, height: 1920, objectFit: "cover" }} />
    </div>
    {f < 4 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: .85 - f * .2 }} />}
    {children}
  </div>;
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
export const CamShades: React.FC = () => {
  const f = useCurrentFrame(); const d = useSpring(34, { damping: 7, stiffness: 160, mass: 1 });
  return <>
    <Banner color={C.green}>distilled + LSP</Banner>
    <div style={{ position: "absolute", left: 540 - 215, top: 560 - (1 - d) * 900, fontSize: 430, lineHeight: 1, fontFamily: "Apple Color Emoji", opacity: f >= 34 ? 1 : 0 }}>🕶️</div>
    <Pop delay={52} style={{ position: "absolute", top: 1100, left: 0, width: 1080 }}><Big size={150} color={C.yellow} style={{ WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>smart enough</Big></Pop>
  </>;
};

// ---------- Land Rover (SVG Defender-style, green with white roof) ----------
export const LandRover: React.FC<{ w?: number }> = ({ w = 960 }) => (
  <svg width={w} viewBox="0 0 700 340">
    <ellipse cx="350" cy="318" rx="320" ry="14" fill="#0006" />
    <path d="M40 230 L40 150 Q40 128 62 126 L150 122 L196 52 Q204 42 218 42 L520 42 Q534 42 540 54 L572 122 L640 128 Q662 130 662 152 L662 230 Z" fill="#2f6b4f" />
    <path d="M196 52 Q204 42 218 42 L520 42 Q534 42 540 54 L552 82 L186 82 Z" fill="#f4f4f4" />
    <path d="M214 92 L520 92 L548 124 L186 124 Z" fill="#9fd3ee" /><rect x="352" y="90" width="9" height="36" fill="#2f6b4f" />
    <rect x="52" y="168" width="40" height="30" rx="8" fill="#ffe9a8" /><rect x="610" y="168" width="40" height="30" rx="8" fill="#ffe9a8" />
    <rect x="260" y="160" width="190" height="52" rx="10" fill="#1c3b2c" stroke="#bfc9c4" strokeWidth="5" />
    <ellipse cx="355" cy="186" rx="62" ry="20" fill="#0d5e2f" stroke="#f1c40f" strokeWidth="4" /><text x="355" y="192" textAnchor="middle" fontSize="15" fontFamily="Arial Black" fill="#fff" letterSpacing="1">LAND ROVER</text>
    <rect x="34" y="226" width="634" height="26" rx="8" fill="#26292b" />
    {[170, 530].map(x => <g key={x}><circle cx={x} cy="252" r="58" fill="#111" /><circle cx={x} cy="252" r="30" fill="#c9ced1" /><circle cx={x} cy="252" r="10" fill="#555" /></g>)}
  </svg>
);
export const CamLandRover: React.FC = () => {
  const f = useCurrentFrame(); const x = ease(f, 18, 34, -1100, 60); const settle = f > 34 ? Math.sin((f - 34) * 1.3) * Math.max(0, 8 - (f - 34) * .4) : 0;
  return <>
    <Banner color={C.yellow} top={140}>keep the car</Banner>
    <div style={{ position: "absolute", top: 1100 + settle, left: x }}><LandRover w={820} /></div>
    <div style={{ position: "absolute", top: 880, right: 50, transformOrigin: "50% 0", transform: `rotate(${f > 40 ? Math.sin(f * 1.1) * 28 * Math.max(0, 1 - (f - 40) / 70) : 0}deg)`, opacity: f > 30 ? 1 : 0 }}><Emoji c="🔑" size={190} /></div>
    <Pop delay={52} style={{ position: "absolute", top: 280, left: 120 }}><div style={{ background: "#fff", color: "#0b0b14", fontFamily: FONT, fontSize: 46, padding: "16px 26px", borderRadius: 22, textAlign: "center", textTransform: "uppercase", transform: "rotate(-3deg)" }}>Kilo + cheap model + <span style={{ color: "#12a56a" }}>LSP on</span></div></Pop>
    <Confetti from={50} />
  </>;
};

// ---------- Ronaldinho / Ronaldo photos (user-provided files) ----------
export const Ronaldinho: React.FC = () => {
  const f = useCurrentFrame(); const a = useSpring(0, { damping: 8, stiffness: 150, mass: .8 }); const b = useSpring(8, { damping: 8, stiffness: 150, mass: .8 });
  return <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#10182b,#000)", overflow: "hidden" }}>
    <Banner color={C.yellow} top={130} size={104}>no Ronaldinho</Banner>
    <div style={{ position: "absolute", top: 420, left: 40, width: 600, height: 600, borderRadius: 30, overflow: "hidden", border: "10px solid #fff", transform: `translateX(${(1 - a) * -700}px) rotate(-6deg) scale(${1 + Math.sin(f / 8) * .02})`, boxShadow: "0 20px 60px #000" }}><Img src={staticFile("img/ronaldini.jpeg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <div style={{ position: "absolute", top: 700, right: 40, width: 440, height: 660, borderRadius: 30, overflow: "hidden", border: "10px solid #fff", transform: `translateX(${(1 - b) * 700}px) rotate(5deg)`, boxShadow: "0 20px 60px #000" }}><Img src={staticFile("img/ronaldo.jpeg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <Pop delay={14} style={{ position: "absolute", top: 1080, left: 120 }}><Emoji c="🚫" size={300} /></Pop>
  </div>;
};

// ---------- bank account (0:44) ----------
export const Bank: React.FC = () => {
  const f = useCurrentFrame(); const s = useSpring(0); const bal = Math.round(ease(f, 10, 50, 0, 200));
  return <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0e3b2b,#06150f)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 230, gap: 30, overflow: "hidden" }}>
    <Banner color={C.green} top={120} size={104}>bank account</Banner>
    <div style={{ marginTop: 200, width: 900, background: "#fff", color: "#0b0b14", borderRadius: 36, padding: 40, transform: `scale(${s}) rotate(${(1 - s) * 8}deg)`, boxShadow: "0 24px 0 rgba(0,0,0,.35)" }}>
      <div style={{ fontFamily: FONT, fontSize: 44, display: "flex", justifyContent: "space-between" }}><span>🏦 Current account</span><span style={{ color: "#12a56a" }}>● live</span></div>
      <div style={{ fontFamily: MONO, fontSize: 30, color: "#666", marginTop: 6 }}>balance this month</div>
      <div style={{ fontFamily: FONT, fontSize: 160, color: "#12a56a", lineHeight: 1.1 }}>+${bal}.00</div>
      <div style={{ borderTop: "3px dashed #ccc", marginTop: 18, paddingTop: 18, fontFamily: MONO, fontSize: 32, lineHeight: 1.7 }}>
        <div>$200 big AI sub <span style={{ float: "right", color: C.red }}>cancelled ✖</span></div>
        <div>cheap model + LSP <span style={{ float: "right", color: "#12a56a" }}>pennies ✔</span></div></div>
    </div>
    {f > 40 && <Confetti from={40} />}
  </div>;
};
