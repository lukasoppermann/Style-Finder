import * as React from "react";
import styles from "./Header.module.css";

type Props = {
  children: string;
};

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.72532 10.6822C8.80993 11.3949 7.65791 11.8181 6.40854 11.8181C3.42032 11.8181 1 9.39757 1 6.40906C1 3.42055 3.42032 1 6.40854 1C9.39676 1 11.8171 3.42055 11.8171 6.40906C11.8171 7.65855 11.3925 8.81068 10.6813 9.72617L15 14.0439L14.0427 15L9.72532 10.6822ZM10.4649 6.40906C10.4649 8.64976 8.64902 10.4659 6.40854 10.4659C4.16805 10.4659 2.35213 8.64976 2.35213 6.40906C2.35213 4.16836 4.16805 2.35227 6.40854 2.35227C8.64902 2.35227 10.4649 4.16836 10.4649 6.40906Z"
    />
  </svg>
);

const Header = ({ children }: Props) => {
  return (
    <header className={styles.Header}>
      <h2 className={styles.HeaderList}>{children}</h2>
      <h2 className={styles.HeaderSearch}>
        <SearchIcon />
        Find matching styles
      </h2>
    </header>
  );
};

export default Header;

