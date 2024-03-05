import * as React from "react";
import styles from "./Header.module.css";

type Props = {
  children: string;
  onRefresh: () => void;
};

const Header = ({ children, onRefresh }: Props) => {
  return (
    <h2 className={styles.Header}>
      {children} <button onClick={onRefresh}>↻</button>
    </h2>
  );
};

export default Header;
