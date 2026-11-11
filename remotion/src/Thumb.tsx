import React from "react";
import { C, FONT } from "./theme";
import { Big, Emoji, Fill } from "./kit";
export const Thumb: React.FC = () => (
  <Fill bg={`linear-gradient(170deg, ${C.red}, #4a0a2a 60%, #0b0b14)`}>
    <div style={{ position: "absolute", top: 230 }}><Big size={150}>don't pay</Big></div>
    <div style={{ position: "absolute", top: 390 }}><Big size={330} color={C.yellow}>$200</Big></div>
    <Emoji c="🤖" size={520} style={{ marginTop: 330 }} />
    <div style={{ position: "absolute", top: 790, left: 330, fontSize: 230, fontFamily: "Apple Color Emoji" }}>🕶️</div>
    <div style={{ position: "absolute", bottom: 420 }}><Big size={96} color="#fff">give it glasses (LSP)</Big></div>
  </Fill>
);
