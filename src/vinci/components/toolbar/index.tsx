import { MindToolbar } from "./mind";
import { ShapesToolbar } from "./shapes";
import { TextToolbar } from "./text";

import styles from "./index.module.scss";

export const Toolbar = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.innerWrap}>
        <ShapesToolbar />
        <TextToolbar />
        <MindToolbar />
      </div>
    </div>
  );
};
