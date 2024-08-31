import { Button, Icon, Tooltip } from "@douyinfe/semi-ui";
import { DragEvent, useRef } from "react";

import styles from "./index.module.scss";

const IconText = () => {
  function CustomIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
      >
        <path d="M13 6V21H11V6H5V4H19V6H13Z"></path>
      </svg>
    );
  }

  return <Icon svg={<CustomIcon />} />;
};

export const TextToolbar = () => {
  const dragImageRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setData("vince/drop-to-add-text", "text");

    if (dragImageRef.current) {
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };

  return (
    <div className={styles.wrap} draggable onDragStart={onDragStart}>
      <Tooltip content="文本" position={"rightTop"}>
        <Button type="tertiary" icon={<IconText />} />
      </Tooltip>

      <div className={styles.dragImage} ref={dragImageRef}>
        <Button type="tertiary" size="small" icon={<IconText />} />
      </div>
    </div>
  );
};
