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

export function TextNode({ id, selected, data }: NodeProps<ITextNode>) {
  const { html } = data;
  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = {};

  const { setNodes } = useReactFlow();

  const onTextChange = (html: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              html,
            },
          };
        }

        return node;
      })
    );
  };

  return (
    <>
      <NodeResizer keepAspectRatio={shiftKeyPressed} isVisible={selected} />

      <div style={{ width, height }}>
        <TextEditor value={html} onChange={onTextChange} />
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
