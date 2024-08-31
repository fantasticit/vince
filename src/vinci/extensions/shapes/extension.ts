import { v7 as uuid } from "uuid";

import { Extension } from "../../extension-manager";
import { ShapeNode } from "./node";

export const Shape = Extension.create({
  name: "shape",
  addNode() {
    return ShapeNode;
  },
  addPlugins() {
    return [
      {
        key: "shape",
        handleDrop(extensionManager, reactflow, evt) {
          const type = evt.dataTransfer?.getData("vince/drop-to-add-shape");

          if (type) {
            const position = reactflow.screenToFlowPosition({
              x: evt.clientX,
              y: evt.clientY,
            });
            const node = {
              id: uuid(),
              type: "shape",
              position,
              style: { width: 100, height: 100 },
              data: {
                type,
                color: "#3F8AE2",
                html: "",
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
