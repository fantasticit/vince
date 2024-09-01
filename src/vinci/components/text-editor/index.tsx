import React, { useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { Extension, useExtensionManager } from "../../extension-manager";

import styles from "./index.module.scss";

export const Tiptap: React.FC<{
  value: string;
  onChange: (arg: string, size: [number, number]) => void;
}> = ({ value, onChange }) => {
  const extensionManager = useExtensionManager();

  const $container = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        spellCheck: false,
      },
    },
  });

  useEffect(() => {
    if (!editor) return () => {};

    const handler = () => {
      const offsetWidth = $container.current!.scrollWidth;
      const offsetHeight = $container.current!.scrollHeight;

      onChange(editor.getHTML(), [offsetWidth, offsetHeight]);
    };

    editor.on("update", handler);

    return () => editor.off("update", handler);
  }, [editor, onChange]);

  useEffect(() => {
    const remove = extensionManager.registerExtension(
      Extension.create({
        name: "text-editor",
        addPlugins() {
          return [
            {
              handleClick(_, __, e) {
                if (
                  $container.current &&
                  !$container.current.contains(e.target as HTMLElement)
                ) {
                  editor?.commands?.blur();
                }

                return false;
              },
              onNodeDragStart() {
                editor?.commands?.blur();
                return false;
              },
            },
          ];
        },
      })
    );

    return remove;
  }, [editor, extensionManager]);

  return (
    <div ref={$container} style={{ boxSizing: "content-box", minWidth: 16 }}>
      <EditorContent editor={editor} />
    </div>
  );
};

export const TextEditor: React.FC<{
  value: string;
  onChange: (value: string, size: [number, number]) => void;
}> = ({ value, onChange }) => {
  return (
    <div className={styles.inputWrap} style={{ display: "inline-block" }}>
      <Tiptap value={value} onChange={onChange} />
    </div>
  );
};
