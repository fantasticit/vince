import { Node } from "@xyflow/react";

export type IData<T> = {
  originPosition: { x: number; y: number };
  html: string;
} & T;

export type IVinceTextNode<T extends Record<string, unknown>> = Node<IData<T>>;
