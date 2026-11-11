import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "./theme";
import { Fill, Shake } from "./kit";
import { Logos } from "./extras";
const TXT = "Give your cheap model GLASSES";
export const Hook: React.FC = () => {
  const f = useCurrentFrame(); const n = Math.min(TXT.length, Math.floor(f * 1.6));
  return <Fill bg={C.bg}><Shake amp={f < 8 ? 6 : 0}><div style={{ fontFamily: FONT, fontSize: 104, color: "#fff", textAlign: "center", width: 940, textTransform: "uppercase", lineHeight: 1.05 }}>{TXT.slice(0, n)}<span style={{ color: C.yellow }}>{f % 10 < 5 ? "▌" : ""}</span></div></Shake><Logos /></Fill>;
};
