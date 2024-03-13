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
  const [figmaLocalStyles, setFigmaLocalStyles] =
    React.useState<FigmaStyle[]>(null);
  const [figmaRemoteStyles, setFigmaRemoteStyles] =
    React.useState<FigmaStyle[]>(null);
  const [currentPage, setCurrentPage] = React.useState<string>(null);
  const [localStylesOpen, setLocalStylesOpen] = React.useState(true);
  const [remoteStylesOpen, setRemoteStylesOpen] = React.useState(true);

  React.useEffect(() => {
    onmessage = (event) => {
      // set local styles
      const localStyles = event.data.pluginMessage.localStyles as FigmaStyle[];
      setFigmaLocalStyles(localStyles);
      // set remote styles
      const remoteStyles = event.data.pluginMessage
        .remoteStyles as FigmaStyle[];
      setFigmaRemoteStyles(remoteStyles);
      // set current Page
      const currentPage = event.data.pluginMessage.currentPage as string;
      setCurrentPage(currentPage);
    };
  }, []);

  return (
    <main className={styles.app}>
      <Header
        onRefresh={() => {
          setFigmaLocalStyles(null);
          setFigmaRemoteStyles(null);
          postMessage("refresh")();
        }}
      >
        {currentPage ? `Styles on ${currentPage}` : "Styles"}
      </Header>
      {figmaLocalStyles === null && figmaRemoteStyles === null ? (
        <div className={styles.loading}>Loading...</div>
      ) : figmaLocalStyles.length === 0 && figmaRemoteStyles.length === 0 ? (
        <div className={styles.noStyles}>No styles on this page</div>
      ) : (
        <>
          <StyleList
            styles={figmaLocalStyles}
            title="Local styles"
            postMessage={postMessage}
            isOpen={localStylesOpen}
            onToggle={() => setLocalStylesOpen(!localStylesOpen)}
          />
          <StyleList
            styles={figmaRemoteStyles}
            title="Remote styles"
            postMessage={postMessage}
            isOpen={remoteStylesOpen}
            onToggle={() => setRemoteStylesOpen(!remoteStylesOpen)}
          />
        </>
      )}
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
