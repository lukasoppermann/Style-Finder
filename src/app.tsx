import * as React from "react";
import * as ReactDOM from "react-dom/client";
import styles from "./app.module.css";
import Header from "./Header";
import StyleList from "./StyleList";
import { FigmaStyle } from "./plugin";

const postMessage = (type: string, data?: unknown) => () => {
  parent.postMessage({ pluginMessage: { type, data } }, "*");
};

const App = () => {
  const [figmaStyles, setFigmaStyles] = React.useState<FigmaStyle[]>(null);
  const [currentPage, setCurrentPage] = React.useState<string>(null);

  React.useEffect(() => {
    onmessage = (event) => {
      const styles = event.data.pluginMessage.styles as FigmaStyle[];
      const currentPage = event.data.pluginMessage.currentPage as string;
      setFigmaStyles(styles);
      setCurrentPage(currentPage);
    };
  }, []);

  return (
    <main className={styles.app}>
      <Header
        onRefresh={() => {
          setFigmaStyles(null);
          postMessage("refresh")();
        }}
      >
        {currentPage ? `Styles on ${currentPage}` : "Styles"}
      </Header>
      {figmaStyles === null ? (
        <div className={styles.loading}>Loading...</div>
      ) : figmaStyles.length === 0 ? (
        <div className={styles.noStyles}>No styles on this page</div>
      ) : (
        <StyleList styles={figmaStyles} postMessage={postMessage} />
      )}
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
