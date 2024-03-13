import * as React from "react";
import styles from "./StyleList.module.css";
import ListItem from "./ListItem";
import { FigmaStyle } from "../plugin";

type Props = {
  styles?: FigmaStyle[];
  title: string;
  isOpen?: boolean;
  onToggle?: () => void;
  postMessage: (type: string, data?: unknown) => () => void;
};

const StyleList = ({
  styles: figmaStyles = [],
  title,
  isOpen = true,
  onToggle: onToggleHandler,
  postMessage,
}: Props) => {
  const detailsRef = React.useRef<HTMLDetailsElement>(null);
  // clickHandler
  const onClickHandler = (e: React.MouseEvent) => {
    const styleId = (e.target as HTMLElement).dataset.styleId;
    if (styleId === undefined) return;
    postMessage("selectNodes", styleId)();
  };
  // details toggle
  detailsRef.current?.addEventListener("toggle", () => {
    console.log("toggle");
    onToggleHandler();
  });
  // return list
  return (
    <details
      ref={detailsRef}
      className={styles.StyleList}
      onClick={onClickHandler}
      open={isOpen}
      {...(figmaStyles.length === 0 && { "data-empty": undefined })}
      {...(figmaStyles.length === 0 ? { "data-empty": true } : {})}
    >
      {title && (
        <summary>
          <svg
            className={styles.arrow}
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="6"
            viewBox="0 0 6 6"
          >
            <path fillRule="nonzero" d="m3 5 3-4H0l3 4z"></path>
          </svg>
          {title}
        </summary>
      )}
      {figmaStyles.length > 0 ? (
        figmaStyles.map((style) => <ListItem key={style.id} style={style} />)
      ) : (
        <div className={styles.noStyles}>No styles on this page</div>
      )}
    </details>
  );
};
export default StyleList;
