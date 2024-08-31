import { type ShapeProps } from "../type";

import { generatePath } from "./utils";

export function Hexagon({ width, height, ...svgAttributes }: ShapeProps) {
  const skew = width * 0.1;

  const hexagonPath = generatePath([
    [0, height / 2],
    [skew, 0],
    [width - skew, 0],
    [width, height / 2],
    [width - skew, height],
    [skew, height],
  ]);

  return <path d={hexagonPath} {...svgAttributes} />;
}
