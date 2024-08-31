import { Button, Icon, Dropdown, Tabs, TabPane } from "@douyinfe/semi-ui";
import { DragEvent, useRef } from "react";

import { ShapeRenderer, ShapeRendererType } from "../../../extensions/shapes";

import styles from "./index.module.scss";

const IconShapes = () => {
  function CustomIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.9998 1L6 11H18L11.9998 1ZM11.9998 4.8873L14.4676 9H9.53232L11.9998 4.8873ZM6.75 20C5.23122 20 4 18.7688 4 17.25C4 15.7312 5.23122 14.5 6.75 14.5C8.26878 14.5 9.5 15.7312 9.5 17.25C9.5 18.7688 8.26878 20 6.75 20ZM6.75 22C9.37335 22 11.5 19.8734 11.5 17.25C11.5 14.6266 9.37335 12.5 6.75 12.5C4.12665 12.5 2 14.6266 2 17.25C2 19.8734 4.12665 22 6.75 22ZM15 15.5V19.5H19V15.5H15ZM13 21.5V13.5H21V21.5H13Z"></path>
      </svg>
    );
  }

  return <Icon svg={<CustomIcon />} />;
};

const Shapes: Array<{
  title: string;
  shapes: Array<{ name: string; type: ShapeRendererType }>;
}> = [
  {
    title: "基础图形",
    shapes: [
      {
        name: "圆形",
        type: "circle",
      },
      {
        name: "cylinder",
        type: "cylinder",
      },
      {
        name: "diamond",
        type: "diamond",
      },
      {
        name: "hexagon",
        type: "hexagon",
      },
      {
        name: "parallelogram",
        type: "parallelogram",
      },
    ],
  },
];

const ShapePlaceholderRenderer = ({ type }: { type: ShapeRendererType }) => {
  const dragImageRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setData("vince/drop-to-add-shape", type);

    if (dragImageRef.current) {
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };

  return (
    <div className={styles.shapeRenderer} draggable onDragStart={onDragStart}>
      <ShapeRenderer
        type={type}
        fill="transparent"
        strokeWidth={1}
        stroke="#595959"
        width={28}
        height={28}
      />
      <div className={styles.dragImage} ref={dragImageRef}>
        <ShapeRenderer
          type={type}
          width={80}
          height={80}
          fill="#3F8AE2"
          fillOpacity={0.7}
          stroke="#3F8AE2"
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export const ShapesToolbar = () => {
  return (
    <Dropdown
      position={"rightTop"}
      zIndex={100}
      spacing={16}
      render={
        <div className={styles.wrap}>
          <Tabs>
            {Shapes.map((group) => {
              return (
                <TabPane tab={group.title} itemKey={group.title}>
                  <div className={styles.shapeGrid}>
                    {group.shapes.map((shape) => {
                      return (
                        <ShapePlaceholderRenderer
                          key={shape.name}
                          type={shape.type}
                        />
                      );
                    })}
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      }
    >
      <Button type="tertiary" icon={<IconShapes />} />
    </Dropdown>
  );
};
