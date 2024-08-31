import { Circle } from "./shapes/circle";
import { Cylinder } from "./shapes/cylinder";
import { Diamond } from "./shapes/diamond";
import { Hexagon } from "./shapes/hexagon";
import { Parallelogram } from "./shapes/parallelogram";

export const ShapeComponents = {
  circle: Circle,
  cylinder: Cylinder,
  diamond: Diamond,
  hexagon: Hexagon,
  parallelogram: Parallelogram,
};

export type ShapeRendererType = keyof typeof ShapeComponents;
