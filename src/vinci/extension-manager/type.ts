/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, DragEvent, MouseEvent } from "react";
import { Edge, Node, NodeProps, ReactFlowInstance } from "@xyflow/react";
import { ExtensionManager } from "./manager";

export interface IPlugin {
  doLayout?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    nodes: Node[],
    edges: Edge[]
  ) => void;

  handleDrop?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    e: DragEvent
  ) => boolean;

  handleClick?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    e: MouseEvent
  ) => boolean;

  onNodeDragStart?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    event: React.MouseEvent,
    node: Node,
    nodes: Node[]
  ) => void;

  onNodeDrag?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    event: React.MouseEvent,
    node: Node,
    nodes: Node[]
  ) => void;

  onNodeDragStop?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    event: React.MouseEvent,
    node: Node,
    nodes: Node[]
  ) => void;

  onNodesDelete?: (
    extensionManager: ExtensionManager,
    reactFlowInstance: ReactFlowInstance,
    nodes: Node[]
  ) => void;
}

export interface IExtensionConfig {
  name: string;

  addNode: () => ComponentType<
    NodeProps & {
      data: any;
      type: any;
    }
  >;

  addPlugins: () => IPlugin[];
}
