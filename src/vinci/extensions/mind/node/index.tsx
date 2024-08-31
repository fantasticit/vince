import {
  NodeResizer,
  type NodeProps,
  useStore,
  useKeyPress,
  useReactFlow,
  Handle,
  Position,
} from "@xyflow/react";

import { IconPlus } from "@douyinfe/semi-icons";
import cls from "classnames";

import { TextEditor } from "../../../components/text-editor";

import { IVinceMindNode } from "../type";

import styles from "./index.module.scss";

function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id));
  return {
    width: node?.measured?.width || 0,
    height: node?.measured?.height || 0,
  };
}

export function MindNode({ id, selected, data }: NodeProps<IVinceMindNode>) {
  const { html, fill } = data;
  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const { setNodes } = useReactFlow();
  const handleStyle = {};

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
        keepAspectRatio={shiftKeyPressed}
        color="#3384f5"
        isVisible={selected}
      ></NodeResizer>

      <div style={{ width, height, backgroundColor: fill }}>
        <TextEditor value={html} onChange={onTextChange} />

        <div className={cls(styles.btnWrap, selected && styles.selected)}>
          <IconPlus
            style={{ fontSize: "12px" }}
            className="js-mind-trigger"
            data-mind-id={id}
            data-type="add"
          />
        </div>
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
