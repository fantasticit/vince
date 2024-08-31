import {
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";

export type VinceNode = Node;

export type VinceStore = {
  nodes: VinceNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<VinceNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: VinceNode[]) => void;
  setEdges: (edges: Edge[]) => void;

  addNode: (node: VinceNode) => void;
};
