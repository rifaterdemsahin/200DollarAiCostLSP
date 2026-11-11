import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "./theme";
import { Big, Confetti, Emoji, Fill, Pop, Shake, SpeedLines, ease, useSpring } from "./kit";

// 1 — $200 slams in, car drives away with the money
export const Price: React.FC = () => {
  const f = useCurrentFrame(); const s = useSpring(4, { damping: 6, stiffness: 200, mass: 1 });
  const carX = ease(f, 55, 110, -400, 1500);
  return <Fill bg={`linear-gradient(160deg, ${C.red}, #7a0f2a)`}>
    <SpeedLines />
    <Shake amp={f > 4 && f < 22 ? 18 : 2}><Big size={330} style={{ transform: `scale(${1.8 - s * .8})`, opacity: s }}>$200</Big></Shake>
    <Pop delay={14}><Big size={110} color={C.yellow}>every month</Big></Pop>
    <div style={{ position: "absolute", top: 1180, left: carX, transform: "scaleX(-1)" }}><Emoji c="🚗" size={300} /></div>
    {Array.from({ length: 10 }).map((_, i) => <Emoji key={i} c="💸" size={90} style={{ position: "absolute", left: (i * 113) % 980, top: ((f * (12 + i) + i * 190) % 2000) - 100 }} />)}
    <Pop delay={40} style={{ position: "absolute", bottom: 560, transform: "rotate(-8deg)" }}><div style={{ border: `10px solid ${C.yellow}`, padding: "10px 40px", borderRadius: 16 }}><Big size={96} color={C.yellow}>car payment</Big></div></Pop>
  </Fill>;
};

// 2 — "This gets me to work": car races to the office
export const Commute: React.FC = () => {
  const f = useCurrentFrame(); const x = ease(f, 0, 38, -300, 520); const bob = Math.sin(f * 1.4) * 8;
  const key = Math.sin(f * .5) * 28;
  return <Fill bg={`linear-gradient(180deg, #4cc9ff, #2a7de1)`}>
    <SpeedLines />
    <Emoji c="🏢" size={420} style={{ position: "absolute", right: 30, top: 700 }} />
    <div style={{ position: "absolute", top: 900 + bob, left: x }}><Emoji c="🚗" size={300} style={{ transform: "scaleX(-1)" }} /></div>
    <div style={{ position: "absolute", top: 1200, width: 1080, height: 24, background: "#222" }} />
    <Pop delay={4} style={{ position: "absolute", top: 300 }}><Big size={150}>gets me<br />to work</Big></Pop>
    <div style={{ position: "absolute", top: 1260, transformOrigin: "50% 0", transform: `rotate(${key}deg)` }}><Emoji c="🔑" size={170} /></div>
  </Fill>;
};

const ERR = ["TypeError: undefined is not a function", "at render (app.js:42)", "Cannot read properties of undefined", "ReferenceError: x is not defined", "Uncaught TypeError: foo is not a function", "at Object.<anonymous> (index.js:7)"];
// 3 — red error wall + facepalm
export const Errors: React.FC = () => {
  const f = useCurrentFrame();
  return <Fill bg="#12060a">
    <Shake amp={f < 40 ? 12 : 4}>
      <div style={{ width: 960, background: "#1b0a10", border: `6px solid ${C.red}`, borderRadius: 24, padding: 30, fontFamily: MONO, fontSize: 42, color: C.red, lineHeight: 1.5, height: 800, overflow: "hidden" }}>
        {Array.from({ length: 16 }).map((_, i) => { const n = Math.floor(f / 3) - i; return n >= 0 ? <div key={i} style={{ opacity: 1 - i * .04 }}>✖ {ERR[(n + i) % ERR.length]}</div> : null; })}
      </div>
    </Shake>
    <Pop delay={12}><Big size={120} color={C.red}>undefined is<br />not a function</Big></Pop>
    <Pop delay={30} style={{ position: "absolute", bottom: 560, right: 60 }}><Emoji c="🤦" size={300} /></Pop>
  </Fill>;
};

// 4 — cheap models guess
export const Guess: React.FC = () => {
  const f = useCurrentFrame(); const pick = Math.floor(f / 7) % 4;
  return <Fill bg={`linear-gradient(160deg, ${C.purple}, #3a1a8f)`}>
    <Pop><Big size={150}>cheap models<br /><span style={{ color: C.yellow }}>guess</span></Big></Pop>
    <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
      {["🎲", "🎰", "🔮", "🐒"].map((e, i) => <div key={i} style={{ transform: `translateY(${pick === i ? -50 : 0}px) scale(${pick === i ? 1.25 : 1}) rotate(${pick === i ? Math.sin(f) * 10 : 0}deg)` }}><Emoji c={e} size={200} /></div>)}
    </div>
    {["❓", "❓", "❓"].map((q, i) => <Emoji key={i} c={q} size={160} style={{ position: "absolute", top: 250 + i * 40, left: 120 + i * 330 + Math.sin(f / 5 + i) * 30, opacity: .8 }} />)}
    <Pop delay={20}><Big size={78} color={C.dim}>"reads code like vibes"</Big></Pop>
  </Fill>;
};

// 5 — LSP toggle flips ON
export const Toggle: React.FC = () => {
  const f = useCurrentFrame(); const on = ease(f, 26, 34, 0, 1); const zoom = 1 + ease(f, 0, 20, 0, .12) + on * .06;
  return <Fill bg={on > .5 ? `radial-gradient(circle, #1b7a52, #07261a)` : "#161625"}>
    <div style={{ transform: `scale(${zoom})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <Big size={110} color={C.blue}>Kilo Code</Big>
      <div style={{ width: 760, height: 360, borderRadius: 180, background: on > .5 ? C.green : "#3a3a55", position: "relative", boxShadow: on > .5 ? `0 0 120px ${C.green}` : "none" }}>
        <div style={{ position: "absolute", top: 30, left: 30 + on * 400, width: 300, height: 300, borderRadius: 150, background: "#fff" }} />
      </div>
      <Big size={220} color={on > .5 ? C.green : C.dim}>LSP {on > .5 ? "ON" : "OFF"}</Big>
    </div>
    {on > .5 && <Confetti from={32} />}
  </Fill>;
};

// 6 — red squiggle flies into the agent
export const Squiggle: React.FC = () => {
  const f = useCurrentFrame(); const t = ease(f, 4, 26, 0, 1); const fly = ease(f, 28, 52, 0, 1);
  const d = "M 0 20 " + Array.from({ length: 12 }).map((_, i) => `q 25 ${i % 2 ? 30 : -30} 50 0`).join(" ");
  return <Fill bg="#10131f">
    <div style={{ fontFamily: MONO, fontSize: 62, color: "#cdd6f4", padding: 40, width: 940, background: "#1a1e2e", borderRadius: 24, position: "absolute", top: 260 }}>
      <div>const user = <span style={{ position: "relative" }}>getUser(1)<svg width="620" height="50" style={{ position: "absolute", left: 0, top: 54 }}><path d={d} stroke={C.red} strokeWidth={7} fill="none" strokeDasharray={650} strokeDashoffset={650 * (1 - t)} /></svg></span>;</div>
      <div style={{ color: C.red, fontSize: 40, marginTop: 40, opacity: t }}>⚠ Type 'string' is not assignable to 'number'</div>
    </div>
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}><path d={d} stroke={C.red} strokeWidth={10} fill="none" transform={`translate(${200 + fly * 400}, ${700 + fly * 520}) scale(${1 - fly * .4}) rotate(${fly * 40})`} opacity={fly > 0 ? 1 : 0} /></svg>
    <div style={{ position: "absolute", bottom: 480, transform: `scale(${1 + (fly > .95 ? Math.sin(f) * .1 : 0)})` }}><Emoji c="🤖" size={300} /></div>
    <Pop delay={8} style={{ position: "absolute", bottom: 820 }}><Big size={96} color={C.red}>straight to<br />the agent</Big></Pop>
  </Fill>;
};

// 7 — three snap cuts, ending in green ticks
export const Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const seg = dur / 3; const i = Math.min(2, Math.floor(f / seg)); const lf = f - i * seg;
  const labels = ["Wrong type", "Missing import", "Fixed"]; const ok = lf > 10;
  return <Fill bg={ok ? "#0a2a1c" : "#2a0a10"}>
    {lf < 3 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: .8 }} />}
    <Pop key={i}><Emoji c={ok ? "✅" : "❌"} size={420} /></Pop>
    <Pop key={"t" + i} delay={2}><Big size={140} color={ok ? C.green : C.red}>{labels[i]}</Big></Pop>
    <div style={{ position: "absolute", bottom: 480, display: "flex", gap: 30 }}>{[0, 1, 2].map(k => <div key={k} style={{ width: 90, height: 90, borderRadius: 45, background: k <= i && (k < i || ok) ? C.green : "#333" }} />)}</div>
    {i === 2 && ok && <Confetti from={Math.floor(seg * 2) + 10} />}
  </Fill>;
};

// 8 — distilled + LSP = smart enough (sunglasses drop)
export const Smart: React.FC = () => {
  const f = useCurrentFrame(); const drop = useSpring(30, { damping: 8, stiffness: 150, mass: 1 });
  const out = ease(f, 140, 175, 0, 1);
  return <Fill bg={`linear-gradient(160deg, ${C.orange}, #b3391a)`}>
    <SpeedLines />
    <Pop><Big size={110}>distilled + LSP</Big></Pop>
    <div style={{ position: "relative" }}><Emoji c="🤖" size={460} /><div style={{ position: "absolute", top: 120 - (1 - drop) * 500, left: 90, fontSize: 280, fontFamily: "Apple Color Emoji" }}>🕶️</div></div>
    <Pop delay={44}><Big size={160} color={C.yellow}>smart<br />enough</Big></Pop>
    <div style={{ position: "absolute", top: 160, right: 70, opacity: out, transform: `scale(${.6 + out * .4})` }}><Emoji c="⚽" size={200} /><div style={{ position: "absolute", top: -30, left: -10, fontSize: 280, color: C.red, fontFamily: FONT }}>🚫</div></div>
  </Fill>;
};

// 9 — black hole eats tokens
export const BlackHole: React.FC = () => {
  const f = useCurrentFrame();
  return <Fill bg="#000">
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3, 4].map(k => <ellipse key={k} cx={540} cy={820} rx={150 + k * 90} ry={70 + k * 40} fill="none" stroke={[C.purple, C.blue, C.purple, "#5a2a9f", "#2a1a5f"][k]} strokeWidth={10 - k} transform={`rotate(${f * (3 - k * .4)} 540 820)`} />)}
      <circle cx={540} cy={820} r={120} fill="#000" stroke="#fff" strokeWidth={4} />
      {Array.from({ length: 14 }).map((_, i) => { const p = ((f * .035 + i / 14) % 1); const a = i * 1.9 + p * 7; const r = 560 * (1 - p); return <text key={i} x={540 + Math.cos(a) * r} y={820 + Math.sin(a) * r * .5} fontSize={90 * (1 - p * .7)} textAnchor="middle" fontFamily="Apple Color Emoji">🪙</text>; })}
    </svg>
    <Pop style={{ position: "absolute", top: 160 }}><Big size={120}>no LSP =</Big></Pop>
    <Pop delay={16} style={{ position: "absolute", top: 1120 }}><Big size={130} color={C.purple}>token<br />black hole</Big></Pop>
  </Fill>;
};

// 10 — wallet relaxes
export const Wallet: React.FC = () => {
  const f = useCurrentFrame();
  return <Fill bg={`linear-gradient(180deg, #7de2b0, #1b9e6a)`}>
    <Pop><Big size={110}>wallet gets</Big></Pop>
    <div style={{ transform: `translateY(${Math.sin(f / 6) * 24}px) rotate(${Math.sin(f / 9) * 6}deg)` }}><Emoji c="🧘" size={420} /></div>
    <div style={{ display: "flex", gap: 40 }}><Emoji c="👛" size={260} /><Emoji c="💚" size={260} style={{ transform: `scale(${1 + Math.sin(f / 4) * .12})` }} /></div>
    <Pop delay={10}><Big size={190} color={C.yellow}>relaxed</Big></Pop>
    {Array.from({ length: 8 }).map((_, i) => <Emoji key={i} c="💵" size={100} style={{ position: "absolute", left: 60 + i * 120, top: 1900 - ((f * (6 + i % 3) + i * 140) % 2000) }} />)}
  </Fill>;
};

// 11 — keep the car
export const Keep: React.FC = () => {
  const f = useCurrentFrame(); const k = Math.sin(f * 1.1) * 30 * Math.max(0, 1 - f / 60);
  const fade = ease(f, 55, 75, 0, 1);
  return <Fill bg={`linear-gradient(160deg, ${C.blue}, #1d3b8f)`}>
    <Pop><Big size={190}>keep<br />the car</Big></Pop>
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <Emoji c="🚗" size={360} />
      <div style={{ transformOrigin: "50% 0", transform: `rotate(${k}deg)` }}><Emoji c="🔑" size={260} /></div>
    </div>
    <Pop delay={14}><div style={{ background: "#fff", color: "#0b0b14", fontFamily: FONT, fontSize: 56, padding: "24px 36px", borderRadius: 24, textAlign: "center", textTransform: "uppercase" }}>Kilo + cheap model + <span style={{ color: "#12a56a" }}>LSP on</span></div></Pop>
    <Confetti from={4} />
    <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade }} />
  </Fill>;
};
