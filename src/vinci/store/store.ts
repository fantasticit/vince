import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

import { VinceStore } from "./types";

export const createVinceStore = (initialData: {
  nodes: VinceStore["nodes"];
  edges: VinceStore["edges"];
}) =>
  create<VinceStore>((set, get) => ({
    nodes: initialData.nodes || [],
    edges: initialData.edges || [],
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    setNodes: (nodes) => {
      set({ nodes });
    },
    setEdges: (edges) => {
      set({ edges });
    },

    addNode: (node) => {
      set({
        nodes: [...get().nodes, node],
      });
    },
  }));

export type IUseVinceStore = ReturnType<typeof createVinceStore>;
