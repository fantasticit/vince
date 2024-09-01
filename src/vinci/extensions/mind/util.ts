/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Node, Position, ReactFlowInstance } from "@xyflow/react";
import { arrayToTree } from "performant-array-to-tree";
import { unionWith } from "lodash";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { flextree } from "./layout/d3-flextree.js";
import { getBranchColor } from "./theme";

import { IVinceMindNode } from "./type";

export const getMindRoot = (nodes: Node[], node: Node): Node => {
  let result: Node = node;
  let parentId: string;

  do {
    parentId = (result?.data?.parentId as string) || result.id;
    result = nodes.find((n) => {
      return n.id === parentId;
    })!;
  } while (result?.data?.parentId);

  return result;
};

export const getMindChildren = (nodes: Node[], rootNode: Node): Node[] => {
  const minds: Record<string, Node[]> = {};

  nodes.forEach((node) => {
    if (node.type !== "mind") return;
    const root = getMindRoot(nodes as Node[], node as Node);
    minds[root.id] ||= [];
    minds[root.id].push(node as Node);
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
    spacing: () => 2,
  });
  const flexNode = layout.hierarchy(tree);
  layout(flexNode);

  flexNode.each((node: any, index: number) => {
    if (!node.parent) return;

    if (node.depth === 1) {
      const color = getBranchColor(index);
      node.data.data.data.stroke = color;
    } else {
      node.data.data.data.stroke = node.parent.data.data.data.stroke;
    }

    if (node.parent) {
      edges.push({
        id: `${node.parent.data.data.id}-${node.data.data.id}`,
        source: node.parent.data.data.id,
        target: node.data.data.id,
        sourceHandle: Position.Right,
        targetHandle: Position.Left,
        style: {
          stroke: node.data.data.data.stroke,
        },
      });
    }

    node.data.data.position.y =
      node.x + node.right + rootNode.data.originPosition.y;
    node.data.data.position.x =
      node.y + node.bottom + +rootNode.data.originPosition.x;
  });
};

export const patchNodeLayout = (reactflow: ReactFlowInstance, node: Node) => {
  const nodes = reactflow.getNodes();
  const edges = reactflow.getEdges();
  const rootNode = node.data.isRoot ? node : getMindRoot(nodes, node);

  const mindEdges: Edge[] = [];
  const mindNodes = [
    rootNode as IVinceMindNode,
    ...getMindChildren(nodes as IVinceMindNode[], rootNode as IVinceMindNode),
  ] as IVinceMindNode[];

  doLayout(rootNode as IVinceMindNode, mindNodes, mindEdges);

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
};
