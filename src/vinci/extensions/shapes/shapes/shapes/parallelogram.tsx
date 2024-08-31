import { type ShapeProps } from "../type";

import { generatePath } from "./utils";

export function Parallelogram({ width, height, ...svgAttributes }: ShapeProps) {
  const skew = width * 0.25;

  const parallelogramPath = generatePath([
    [0, height],
    [skew, 0],
    [width, 0],
    [width - skew, height],
  ]);

  return <path d={parallelogramPath} {...svgAttributes} />;
}
