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

export function ShapeNode({ id, selected, data }: NodeProps<IShapeNode>) {
  const { color, type } = data;
  const { width, height } = useNodeDimensions(id);
  const { setNodes } = useReactFlow();
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = { backgroundColor: color };

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
      <TextEditor value={data.html} onChange={onTextChange} />

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
