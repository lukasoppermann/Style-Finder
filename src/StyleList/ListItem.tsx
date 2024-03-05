import * as React from "react";
import styles from "./ListItem.module.css";
import { FigmaStyle } from "../plugin";
import StyleSvg from "./StyleSvgs";

type Props = {
  style: FigmaStyle;
};

const ListItem = ({ style: { id, name, type, nodes, description } }: Props) => (
  <li className={styles.ListItem} data-style-id={id} title={description}>
    <StyleSvg type={type} />
    {name} <span className={styles.ListItemCount}>{nodes.length}</span>
  </li>
);

export default ListItem;
