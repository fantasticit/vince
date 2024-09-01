import { useShallow } from "zustand/react/shallow";
import {
  ReactFlow,
  Background,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
  NodeChange,
  Node,
} from "@xyflow/react";
import {
  DragEventHandler,
  DragEvent,
  useState,
  MouseEvent,
  MouseEventHandler,
  useCallback,
} from "react";

import "@xyflow/react/dist/style.css";

import "./style.scss";

import { createVinceStore, type VinceStore } from "./store";
import {
  Extension,
  ExtensionManager,
  ExtensionManagerProvider,
} from "./extension-manager";
import { useAutoLayout } from "./hooks/use-layout";

import { Mind } from "./extensions/mind";
import { Shape } from "./extensions/shapes";
import { Text } from "./extensions/text";

import { Toolbar } from "./components/toolbar";
import { HelperLinesRenderer, getHelperLines } from "./components/helper-line";

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
    extensionManager.handleClick(evt);
  }) as unknown as MouseEventHandler;

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);

  const buildHelperLines = useCallback(
    (changes: NodeChange[], nodes: Node[]) => {
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      if (
        changes.length === 1 &&
        changes[0].type === "position" &&
        changes[0].dragging &&
        changes[0].position
      ) {
        const helperLines = getHelperLines(changes[0], nodes);

        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y;

        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }
    },
    []
  );

  return (
    <div
      className="vinci-example"
      style={{ width: "100vw", height: "100vh", outline: "1px solid red" }}
    >
      <ExtensionManagerProvider value={extensionManager}>
        <ReactFlow
          nodeTypes={extensionManager.nodeTypes}
          nodes={vinceStore.nodes}
          edges={vinceStore.edges}
          onNodesChange={(changes) => {
            buildHelperLines(changes, vinceStore.nodes);
            vinceStore.onNodesChange(changes);
          }}
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
          <Toolbar />
          <MiniMap />
          <HelperLinesRenderer
            horizontal={helperLineHorizontal}
            vertical={helperLineVertical}
          />
        </ReactFlow>
      </ExtensionManagerProvider>
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
