import { type ShapeComponentProps } from "./type";
import { ShapeComponents } from "./constants";

export function ShapeRenderer({
  type,
  width,
  height,
  ...svgAttributes
}: ShapeComponentProps) {
  const ShapeComponent = ShapeComponents[type];

  if (!ShapeComponent || !width || !height) {
    return null;
  }

  const strokeWidth = svgAttributes.strokeWidth
    ? +svgAttributes.strokeWidth
    : 0;

  const innerWidth = width - 2 * strokeWidth;
  const innerHeight = height - 2 * strokeWidth;

  return (
    <svg width={width} height={height} className="shape-svg">
      <g
        transform={`translate(${svgAttributes.strokeWidth ?? 0}, ${
          svgAttributes.strokeWidth ?? 0
        })`}
      >
        <ShapeComponent
          width={innerWidth}
          height={innerHeight}
          {...svgAttributes}
        />
      </g>
    </svg>
  );
}
