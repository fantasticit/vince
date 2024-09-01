import { useCallback, useEffect } from "react";
import {
  type Node,
  type Edge,
  useReactFlow,
  useNodesInitialized,
  useStore,
} from "@xyflow/react";
import { cloneDeep } from "lodash";

import { ExtensionManager } from "../extension-manager";

export function useAutoLayout(extensionManager: ExtensionManager) {
  const { setNodes, setEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const elements = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      nodeMap: state.nodeLookup,
      edgeMap: state.edgeLookup,
    }),
    compareElements
  );

  const doLayout = useCallback(() => {
    if (!nodesInitialized || elements.nodeMap.size === 0) {
      return;
    }

    const nodes = cloneDeep([...elements.nodeMap.values()]);
    const edges = cloneDeep([...elements.edgeMap.values()]);
    extensionManager.doLayout(nodes, edges);
    setNodes(nodes);
    setEdges(edges);
  }, [
    elements.edgeMap,
    elements.nodeMap,
    extensionManager,
    nodesInitialized,
    setEdges,
    setNodes,
  ]);

  useEffect(() => {
    if (!nodesInitialized || elements.nodeMap.size === 0) {
      return;
    }

    doLayout();
  }, [nodesInitialized, doLayout, elements.nodeMap.size]);

  return doLayout;
}

export default useAutoLayout;

type Elements = {
  nodeMap: Map<string, Node>;
  edgeMap: Map<string, Edge>;
};

function compareElements(xs: Elements, ys: Elements) {
  return (
    compareNodes(xs.nodeMap, ys.nodeMap) && compareEdges(xs.edgeMap, ys.edgeMap)
  );
}

function compareNodes(xs: Map<string, Node>, ys: Map<string, Node>) {
  if (xs.size !== ys.size) return false;
  for (const [id, x] of xs.entries()) {
    const y = ys.get(id);

    if (!y) return false;
    if (x.resizing || x.dragging) return true;
    if (
      x.measured?.width !== y.measured?.width ||
      x.measured?.height !== y.measured?.height
    )
      return false;
  }

  return true;
}

function compareEdges(xs: Map<string, Edge>, ys: Map<string, Edge>) {
  if (xs.size !== ys.size) return false;

  for (const [id, x] of xs.entries()) {
    const y = ys.get(id);
    if (!y) return false;
    if (x.source !== y.source || x.target !== y.target) return false;
    if (x?.sourceHandle !== y?.sourceHandle) return false;
    if (x?.targetHandle !== y?.targetHandle) return false;
  }

  return true;
}
