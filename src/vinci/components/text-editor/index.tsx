import React from "react";
import styles from "./index.module.scss";

export const TextEditor: React.FC<{
  value: string;
  onChange?: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className={styles.inputWrap}
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
    />
  );
};
