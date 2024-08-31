import { SVGAttributes } from "react";
import { ShapeRendererType } from "./constants";

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeComponentProps = Partial<ShapeProps> & {
  type: ShapeRendererType;
};
