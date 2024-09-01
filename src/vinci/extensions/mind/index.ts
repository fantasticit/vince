import { v7 as uuid } from "uuid";
import { cloneDeep } from "lodash";
import { Node } from "@xyflow/react";

import { Extension } from "../../extension-manager";

import { IVinceMindNode } from "./type";
import { MindNode } from "./node";
import { getMindRoot, doLayout, patchNodeLayout } from "./util";

export const Mind = Extension.create({
  name: "mind",
  addNode() {
    return MindNode;
  },
  addPlugins() {
    return [
      {
        key: "mind",
        doLayout(_, __, nodes, edges) {
          const mindsRoot: Record<string, Node> = {};
          const minds: Record<string, Node[]> = {};

          nodes.forEach((node) => {
            if (node.type !== "mind") return;
            const root = getMindRoot(
              nodes as IVinceMindNode[],
              node as IVinceMindNode
            );
            if (!mindsRoot[root.id]) {
              mindsRoot[root.id] = cloneDeep(root);
            }
            minds[root.id] ||= [];
            minds[root.id].push(node as IVinceMindNode);
          });

          Object.keys(minds).forEach((key) => {
            const rootNode = mindsRoot[key];
            doLayout(
              rootNode as IVinceMindNode,
              minds[key] as IVinceMindNode[],
              edges
            );
          });
        },
        handleDrop(_, reactflow, evt) {
          const type = evt.dataTransfer?.getData("vince/drop-to-add-mind");

          if (type) {
            const position = reactflow.screenToFlowPosition({
              x: evt.clientX,
              y: evt.clientY,
            });
            const node = {
              id: uuid(),
              type: "mind",
              hidden: false,
              position,
              style: { width: 74, height: 32 },
              data: {
                originPosition: cloneDeep(position),
                isRoot: true,
                layout: "RightLogical",
                html: "思维导图",
                fill: "#eff0f0",
                stroke: "#eff0f0",
              },
            };
            const nodes = reactflow.getNodes();
            reactflow.setNodes([
              ...nodes.map((node) => {
                return {
                  ...node,
                  selected: false,
                };
              }),
              node,
            ]);
            return true;
          }

          return false;
        },
        handleClick(_, reactflow, e) {
          const target = (e.nativeEvent.composedPath() as HTMLElement[]).find(
            (el) => {
              return el?.classList?.contains("js-mind-trigger");
            }
          );

          if (!target) return false;

          e.preventDefault();
          e.stopPropagation();

          const mindId = target.getAttribute("data-mind-id");
          // const type = target.getAttribute("data-type");
          const position = reactflow.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          });
          const node = {
            id: uuid(),
            type: "mind",
            hidden: false,
            position,
            style: { width: 64, height: 37 },
            data: {
              parentId: mindId,
              html: "子主题",
              fill: "#eff0f0",
              stroke: "#eff0f0",
            },
            draggable: false,
            selected: true,
          };
          const nodes = reactflow.getNodes();

          reactflow.setNodes([
            ...nodes.map((node) => {
              return {
                ...node,
                selected: false,
              };
            }),
            node,
          ]);
          return true;
        },
        onNodeDrag(_, reactflow, __, node) {
          if (node.type === "mind") {
            node.data.originPosition = cloneDeep(node.position);
            patchNodeLayout(reactflow, node);
            return true;
          }
        },
      },
    ];
  },
});
