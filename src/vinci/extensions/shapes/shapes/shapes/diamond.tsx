import { type ShapeProps } from "../type";

import { generatePath } from "./utils";

export function Diamond({ width, height, ...svgAttributes }: ShapeProps) {
  const diamondPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  return <path d={diamondPath} {...svgAttributes} />;
}
