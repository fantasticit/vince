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

import styles from "./index.module.scss";
import { useCallback } from "react";

export type ITextNode = Node<{
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

export function TextNode({ id, selected, data }: NodeProps<ITextNode>) {
  const { html } = data;
  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = { backgroundColor: "rgba(102, 152, 255, 0.6)" };

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
    <div className={styles.wrap}>
      <NodeResizer
        keepAspectRatio={shiftKeyPressed}
        color="rgba(102, 152, 255, 0.6)"
        isVisible={selected}
      />

      <div style={{ width, height }}>
        <TextEditor value={html} onChange={onChange} />
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
    </div>
  );
}
