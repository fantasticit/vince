import { v7 as uuid } from "uuid";

import { Extension } from "../../extension-manager";

import { TextNode } from "./node";

export const Text = Extension.create({
  name: "text",
  addNode() {
    return TextNode;
  },
  addPlugins() {
    return [
      {
        key: "text",
        handleDrop(extensionManager, reactflow, evt) {
          const type = evt.dataTransfer?.getData("vince/drop-to-add-text");

          if (type) {
            const position = reactflow.screenToFlowPosition({
              x: evt.clientX,
              y: evt.clientY,
            });
            const node = {
              id: uuid(),
              type: "text",
              position,
              style: { width: 80, height: 32 },
              data: {
                html: "文本",
              },
              selected: true,
            };
            reactflow.addNodes(node);
            return true;
          }

          return false;
        },
      },
    ];
  },
});
