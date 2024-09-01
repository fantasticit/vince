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
        handleDrop(_, reactflow, evt) {
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
              style: { width: 46, height: 22 },
              data: {
                html: "文本",
              },
              selected: true,
            };
            const nodes = reactflow.getNodes();
            reactflow.setNodes([
              ...nodes.map((node) => {
                return {
                  ...node,
                  selected: false,
                };
              }),
              node,
            ]);
            return true;
          }

          return false;
        },
      },
    ];
  },
});
