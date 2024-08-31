/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Position } from "@xyflow/react";
import { flextree } from "d3-flextree";
import { arrayToTree } from "performant-array-to-tree";

import { IVinceMindNode } from "./type";

export const getMindRoot = (
  nodes: IVinceMindNode[],
  node: IVinceMindNode
): IVinceMindNode => {
  let result: IVinceMindNode = node;
  let parentId: string;

  do {
    parentId = (result?.data?.parentId as string) || result.id;
    result = nodes.find((n) => {
      return n.id === parentId;
    })!;
  } while (result?.data?.parentId);

  return result;
};

export const getMindChildren = (
  nodes: IVinceMindNode[],
  rootNode: IVinceMindNode
): IVinceMindNode[] => {
  const minds: Record<string, IVinceMindNode[]> = {};

  nodes.forEach((node) => {
    if (node.type !== "mind") return;
    const root = getMindRoot(nodes as IVinceMindNode[], node as IVinceMindNode);
    minds[root.id] ||= [];
    minds[root.id].push(node as IVinceMindNode);
  });

  return minds[rootNode.id];
};

export const doLayout = (
  rootNode: IVinceMindNode,
  nodes: IVinceMindNode[],
  edges: Edge[]
) => {
  if (nodes.length <= 1) return;

  const tree = arrayToTree(nodes, { id: "id", parentId: "data.parentId" })[0];

  const layout = flextree({
    children: (d: any) => d.children,
    nodeSize: (d: any) => {
      return [
        d?.data?.data?.measured?.height || d?.data?.data?.style?.height,
        d?.data?.data?.measured?.width || d?.data?.data?.style?.width,
      ];
    },
    spacing: (nodeA, nodeB) => nodeA.path(nodeB).length,
  });
  const flexNode = layout.hierarchy(tree);
  layout(flexNode);

  flexNode.each((node) => {
    if (node.hasChildren) {
      node.children!.forEach((child: any) => {
        edges.push({
          id: `${node.data.data.id}-${child.data.data.id}`,
          source: node.data.data.id,
          target: child.data.data.id,
          sourceHandle: Position.Right,
          targetHandle: Position.Left,
        });
      });
    }

    if (node.data.data.id === rootNode.id) {
      // echo
    } else {
      node.data.data.position.y =
        node.x + node.right + rootNode.data.originPosition.y;
      node.data.data.position.x =
        node.y + node.bottom + +rootNode.data.originPosition.x;
    }
  });
};
