import * as React from "react";
import styles from "./StyleList.module.css";
import ListItem from "./ListItem";
import { FigmaStyle } from "../plugin";

type Props = {
  styles: FigmaStyle[];
  postMessage: (type: string, data?: unknown) => () => void;
};

const StyleList = ({ styles: figmaStyles = [], postMessage }: Props) => {
  // clickHandler
  const onClickHandler = (e: React.MouseEvent) => {
    const styleId = (e.target as HTMLElement).dataset.styleId;
    if (styleId === undefined) return;
    postMessage("selectNodes", styleId)();
  };
  // return list
  return (
    <ul className={styles.StyleList} onClick={onClickHandler}>
      {figmaStyles.map((style) => (
        <ListItem key={style.id} style={style} />
      ))}
    </ul>
  );
};
export default StyleList;
