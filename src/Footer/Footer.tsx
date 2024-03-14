import * as React from "react";
import styles from "./Footer.module.css";

type Props = {
  children?: string;
};
const Footer = ({ children }: Props) => {
  return (
    <section className={styles.Footer}>
      {/* <button onClick={() => {}}>↻</button> */}
    </section>
  );
};

export default Footer;
