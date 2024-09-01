import {
  type Node,
  NodeResizer,
  type NodeProps,
  useStore,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from "@xyflow/react";

import { TextEditor } from "../../../components/text-editor";

import { ShapeRenderer, ShapeRendererType } from "../shapes";

import styles from "./index.module.scss";
import { useCallback } from "react";

export type IShapeNode = Node<{
  type: ShapeRendererType;
  color: string;
  html: string;
}>;

function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id));
  return {
    width: node?.measured?.width || 0,
    height: node?.measured?.height || 0,
  };
}

const PADDING = 5;

export function ShapeNode({ id, selected, data }: NodeProps<IShapeNode>) {
  const { color, type } = data;
  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = { backgroundColor: color };

  const reactflow = useReactFlow();

  const onChange = useCallback(
    (html: string, size: [number, number]) => {
      const node = reactflow.getNode(id)!;
      const width = size[0] + PADDING * 2;
      const height = size[1] + PADDING * 2;

      if (node.style?.width) {
        node.style.width = width;
      }
      if (node.style?.height) {
        node.style.height = height;
      }
      reactflow.updateNode(id, {
        style: { ...node.style, width, height },
        data: {
          ...node.data,
          html,
        },
      });
    },
    [reactflow, id]
  );

  return (
    <>
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      />

      <ShapeRenderer
        type={type}
        width={width}
        height={height}
        fill={color}
        strokeWidth={2}
        stroke={color}
        fillOpacity={0.8}
      />
      <div className={styles.editorWrap}>
        <TextEditor value={data.html} onChange={onChange} />
      </div>

      <Handle
        style={handleStyle}
        id="top"
        type="target"
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id="right"
        type="target"
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id="bottom"
        type="target"
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id="left"
        type="target"
        position={Position.Left}
      />

      <Handle
        style={handleStyle}
        id="top"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id="right"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id="bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id="left"
        type="source"
        position={Position.Left}
      />
    </>
  );
}
