import { useShallow } from "zustand/react/shallow";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
} from "@xyflow/react";
import {
  DragEventHandler,
  DragEvent,
  useState,
  MouseEvent,
  MouseEventHandler,
} from "react";

import "@xyflow/react/dist/style.css";

import "./style.scss";

import { createVinceStore, type VinceStore } from "./store";
import { Extension, ExtensionManager } from "./extension-manager";
import { useAutoLayout } from "./hooks/use-layout";

import { Mind } from "./extensions/mind";
import { Shape } from "./extensions/shapes";
import { Text } from "./extensions/text";

import { Toolbar } from "./components/toolbar";

const extensions: Extension[] = [Mind, Shape, Text];

const selector = (state: VinceStore) => ({
  ...state,
});

export function InnerEditor() {
  const [useVinceStore] = useState(() =>
    createVinceStore({ nodes: [], edges: [] })
  );
  const vinceStore = useVinceStore(useShallow(selector));
  const reactflow = useReactFlow();
  const [extensionManager] = useState(
    () => new ExtensionManager(reactflow, extensions)
  );

  useAutoLayout(extensionManager);

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    extensionManager.handleDrop(evt);
  };

  const onClick = ((evt: MouseEvent) => {
    evt.preventDefault();
    extensionManager.handleClick(evt);
  }) as unknown as MouseEventHandler;

  return (
    <div
      className="vinci-example"
      style={{ width: "100vw", height: "100vh", outline: "1px solid red" }}
    >
      <ReactFlow
        nodeTypes={extensionManager.nodeTypes}
        nodes={vinceStore.nodes}
        edges={vinceStore.edges}
        onNodesChange={vinceStore.onNodesChange}
        onEdgesChange={vinceStore.onEdgesChange}
        onConnect={vinceStore.onConnect}
        proOptions={{ hideAttribution: true }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        onNodeDoubleClick={(e, node) =>
          extensionManager.onNodeDoubleClick(e, node)
        }
        onNodeDragStart={(e, node, nodes) =>
          extensionManager.onNodeDragStart(e, node, nodes)
        }
        onNodeDrag={(e, node, nodes) =>
          extensionManager.onNodeDrag(e, node, nodes)
        }
        onNodeDragStop={(e, node, nodes) =>
          extensionManager.onNodeDragStop(e, node, nodes)
        }
        fitView
        panOnDrag
      >
        <Background />
        <Controls />
        <Toolbar />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export function Editor() {
  return (
    <ReactFlowProvider>
      <InnerEditor />
    </ReactFlowProvider>
  );
}
