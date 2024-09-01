/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Node, NodeTypes, ReactFlowInstance } from "@xyflow/react";
import { Extension } from "./extension";
import { IPlugin } from "./type";

export class ExtensionManager {
  constructor(
    public reactflow: ReactFlowInstance,
    public extensions: Extension[]
  ) {
    this.reactflow = reactflow;
    this.extensions = extensions;
  }

  get nodeTypes(): NodeTypes {
    return this.extensions.reduce((memo, ext) => {
      const [type, component] = ext.getNodeType();
      memo[type] = component;
      return memo;
    }, {} as NodeTypes);
  }

  get plugins() {
    return this.extensions.reduce((memo, ext) => {
      return memo.concat(ext?.getPlugins?.());
    }, [] as IPlugin[]);
  }

  private runPlugin<T extends `${keyof IPlugin}`>(
    type: "series" | "breakOnTrue",
    pluginType: T,
    ...callArgs: any[]
  ) {
    const plugins = this.plugins;

    let done;
    let cursor = 0;

    do {
      const plugin = plugins[cursor++];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      done = plugin?.[pluginType]?.(this, this.reactflow, ...callArgs);
      console.log(pluginType, done);
    } while (
      (type === "breakOnTrue" ? !done : true) &&
      cursor < plugins.length
    );
  }

  doLayout(nodes: Node[], edges: Edge[]) {
    return this.runPlugin("series", "doLayout", nodes, edges);
  }

  handleDrop(evt: React.DragEvent) {
    return this.runPlugin("breakOnTrue", "handleDrop", evt);
  }

  handleClick(evt: React.MouseEvent) {
    return this.runPlugin("breakOnTrue", "handleClick", evt);
  }

  onNodeDoubleClick(event: React.MouseEvent, node: Node) {
    return this.runPlugin("breakOnTrue", "onNodeDoubleClick", event, node);
  }

  onNodeDragStart(event: React.MouseEvent, node: Node, nodes: Node[]) {
    return this.runPlugin("breakOnTrue", "onNodeDragStart", event, node, nodes);
  }

  onNodeDrag(event: React.MouseEvent, node: Node, nodes: Node[]) {
    return this.runPlugin("breakOnTrue", "onNodeDrag", event, node, nodes);
  }

  onNodeDragStop(event: React.MouseEvent, node: Node, nodes: Node[]) {
    return this.runPlugin("breakOnTrue", "onNodeDragStop", event, node, nodes);
  }

  onNodesDelete(nodes: Node[]) {
    return this.runPlugin("breakOnTrue", "onNodesDelete", nodes);
  }
}
