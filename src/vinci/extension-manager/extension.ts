/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeProps } from "@xyflow/react";
import { ComponentType } from "react";
import { IExtensionConfig } from "./type";

export class Extension {
  static create(config: IExtensionConfig) {
    return new Extension(config);
  }

  constructor(public config: IExtensionConfig) {
    this.config = config;
  }

  getNodeType(): [
    string,
    ComponentType<
      NodeProps & {
        data: any;
        type: any;
      }
    >
  ] {
    return [this.config.name, this.config.addNode()];
  }

  getPlugins() {
    return this.config.addPlugins?.() || [];
  }
}
