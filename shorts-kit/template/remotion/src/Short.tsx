import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import data from "../public/data.json";
import { C, FONT } from "./theme";
import { Hook } from "./Hook";
import * as S from "./scenes";
import * as X from "./extras";

const MAP: Record<string, React.FC<any>> = { price: S.Price, commute: S.Commute, errors: S.Errors, guess: S.Guess, toggle: S.Toggle,
  squiggle: S.Squiggle, fixes: S.Fixes, smart: S.Smart, blackhole: S.BlackHole, wallet: S.Wallet, keep: S.Keep };

const CAM: Record<string, React.FC> = { carpay: X.CamCarPay, guess: X.CamGuess, shades: X.CamShades, landrover: X.CamLandRover };
const OVER: Record<string, React.FC> = { ronaldinho: X.Ronaldinho, bank: X.Bank };
const Subs: React.FC = () => {
  const f = useCurrentFrame(); const t = f / data.fps;
  const idx = data.words.findIndex((w, i) => t >= w.s && (i === data.words.length - 1 || t < data.words[i + 1].s));
  if (idx < 0 || t > data.words[data.words.length - 1].e + .4) return null;
  const g = Math.floor(idx / 3) * 3; const grp = data.words.slice(g, g + 3);
  return <div style={{ position: "absolute", bottom: 330, left: 60, width: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px" }}>
    {grp.map((w, i) => <span key={g + i} style={{ fontFamily: FONT, fontSize: 84, textTransform: "uppercase", color: g + i === idx ? C.yellow : "#fff",
      WebkitTextStroke: "10px #000", paintOrder: "stroke fill", transform: g + i === idx ? "scale(1.12)" : "none" }}>{w.w}</span>)}
  </div>;
};
export const Short: React.FC = () => {
  const f = useCurrentFrame();
  const punch = data.scenes.reduce((a, s) => a + (f >= s.from && f < s.from + 5 ? 1 - (f - s.from) / 5 : 0), 0);
  return <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("mix.wav")} />
    <AbsoluteFill style={{ transform: `scale(${1 + punch * .05})` }}>
      <Sequence from={0} durationInFrames={data.hook}><Hook /></Sequence>
      {data.scenes.map(s => { const C2 = MAP[s.type]; return <Sequence key={s.id} from={s.from} durationInFrames={s.dur}><C2 dur={s.dur} /></Sequence>; })}
    </AbsoluteFill>
    {data.overlays.filter(o => OVER[o.id]).map(o => { const O = OVER[o.id]; return <Sequence key={o.id} from={o.from} durationInFrames={o.dur}><O /></Sequence>; })}
    {data.cams.map(c => { const O = CAM[c.id]; return <Sequence key={c.id} from={c.from} durationInFrames={c.dur}><X.CamLayer from={c.from}><O /></X.CamLayer></Sequence>; })}
    <Subs />
    <div style={{ position: "absolute", bottom: 0, left: 0, height: 16, width: `${(f / data.total) * 100}%`, background: C.yellow }} />
  </AbsoluteFill>;
};
