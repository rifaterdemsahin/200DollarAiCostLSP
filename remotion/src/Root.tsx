import React from "react";
import { Composition, Still } from "remotion";
import data from "../public/data.json";
import { Short } from "./Short";
import { Thumb } from "./Thumb";

export const Root: React.FC = () => (
  <>
    <Composition id="Short" component={Short} durationInFrames={data.total} fps={data.fps} width={1080} height={1920} />
    <Still id="Thumb" component={Thumb} width={1080} height={1920} />
  </>
);
