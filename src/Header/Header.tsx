import * as React from "react";
import styles from "./Header.module.css";

type Props = {
  children: string;
  onRefresh: () => void;
};

const Header = ({ children, onRefresh }: Props) => {
  return (
    <header className={styles.Header}>
      <h2>{children}</h2>
      <button onClick={onRefresh}>↻</button>
    </header>
  );
};

export default Header;
