import {
  type NodeProps,
  useStore,
  useReactFlow,
  Handle,
  Position,
} from "@xyflow/react";

import { IconPlus } from "@douyinfe/semi-icons";
import cls from "classnames";
import React, { useCallback } from "react";

import { TextEditor } from "../../../components/text-editor";
import { useDelaySetState } from "../../../hooks/use-delay-state";

import { IVinceMindNode } from "../type";
import { patchNodeLayout } from "../util";

import styles from "./index.module.scss";

function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id));
  console.log(node);
  return {
    width: node?.style?.width || node?.measured?.width || 0,
    height: node?.style?.height || node?.measured?.height || 0,
  };
}

const PADDING = 5;

export function MindNode({ id, data }: NodeProps<IVinceMindNode>) {
  const { html, fill, stroke, isRoot } = data;
  const { width, height } = useNodeDimensions(id);
  const reactflow = useReactFlow();

  const [visible, setVisible] = useDelaySetState(200, false);

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
      patchNodeLayout(reactflow, node);
    },
    [reactflow, id]
  );

  const nodeStyle: React.CSSProperties = {
    boxSizing: "border-box",
    backgroundColor: isRoot ? fill : "transparent",
    borderStyle: "solid",
    borderWidth: isRoot ? 0 : "3px",
    borderColor: stroke,
    borderRadius: "4px",
  };
  const handleStyle = {};

  return (
    <>
      <div
        className="mind-text-container"
        style={{
          width,
          height,
          ...nodeStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
        onMouseEnter={() => setVisible(true, true)}
        onMouseLeave={() => setVisible(false)}
      >
        <TextEditor value={html} onChange={onChange} />

        <div className={cls(styles.btnWrap, visible && styles.selected)}>
          <IconPlus
            style={{ fontSize: "10px" }}
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
