import { v7 as uuid } from "uuid";
import { cloneDeep, unionWith } from "lodash";

import { Extension } from "../../extension-manager";

import { MindNode } from "./node";
import { getMindRoot, getMindChildren, doLayout } from "./util";
import { IVinceMindNode } from "./type";
import { Edge } from "@xyflow/react";

export const Mind = Extension.create({
  name: "mind",
  addNode() {
    return MindNode;
  },
  addPlugins() {
    return [
      {
        key: "mind",
        doLayout(extensionManager, reactflow, nodes, edges) {
          const mindsRoot: Record<string, IVinceMindNode> = {};
          const minds: Record<string, IVinceMindNode[]> = {};

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
            console.log(rootNode);
            doLayout(rootNode, minds[key], edges);
          });
          console.log(nodes);
        },
        handleDrop(extensionManager, reactflow, evt) {
          const type = evt.dataTransfer?.getData("vince/drop-to-add-mind");

          if (type) {
            const position = reactflow.screenToFlowPosition({
              x: evt.clientX,
              y: evt.clientY,
            });
            const node = {
              id: uuid(),
              type: "mind",
              position,
              style: { width: 80, height: 32 },
              data: {
                originPosition: cloneDeep(position),
                isRoot: true,
                layout: "RightLogical",
                html: "思维导图",
                fill: "#eff0f0",
              },
            };
            reactflow.addNodes(node);
            return true;
          }

          return false;
        },
        handleClick(extensionManager, reactflow, e) {
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
            position,
            style: { width: 60, height: 32 },
            data: {
              parentId: mindId,
              html: "子主题",
              fill: "#eff0f0",
            },
            draggable: false,
          };
          reactflow.addNodes(node);
          return true;
        },
        onNodeDrag(_, reactflow, __, node) {
          if (node.type === "mind") {
            node.data.originPosition = cloneDeep(node.position);

            const nodes = reactflow.getNodes();
            const edges = reactflow.getEdges();

            const mindEdges: Edge[] = [];
            const mindNodes = [
              node as IVinceMindNode,
              ...getMindChildren(
                nodes as IVinceMindNode[],
                node as IVinceMindNode
              ),
            ];

            doLayout(node as IVinceMindNode, mindNodes, mindEdges);

            const newNodes = unionWith(
              mindNodes,
              nodes,
              (node1, node2) => node1.id === node2.id
            );
            const newEdges = unionWith(
              mindEdges,
              edges,
              (edge1, edge2) => edge1.id === edge2.id
            );

            reactflow.setNodes(newNodes);
            reactflow.setEdges(newEdges);

            return true;
          }
        },
      },
    ];
  },
});
