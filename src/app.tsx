import * as React from "react";
import * as ReactDOM from "react-dom/client";
import styles from "./app.module.css";
import Header from "./Header";
import StyleList from "./StyleList";
import Footer from "./Footer/Footer";
import { Settings, defaultSettings, SettingKey } from "./utilities/settings";
import { styleData } from "./utilities/getStyles";

const postMessage = (type: string, data?: unknown) => () => {
  parent.postMessage({ pluginMessage: { type, data } }, "*");
};

const App = () => {
  const [figmaLocalStyles, setFigmaLocalStyles] =
    React.useState<styleData[]>(null);
  const [figmaRemoteStyles, setFigmaRemoteStyles] =
    React.useState<styleData[]>(null);
  const [currentPage, setCurrentPage] = React.useState<string>(null);
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  React.useEffect(() => {
    onmessage = (event) => {
      // set local styles
      const localStyles = event.data.pluginMessage.localStyles as styleData[];
      setFigmaLocalStyles(localStyles);
      // set remote styles
      const remoteStyles = event.data.pluginMessage.remoteStyles as styleData[];
      setFigmaRemoteStyles(remoteStyles);
      // set current Page
      const currentPage = event.data.pluginMessage.currentPage as string;
      setCurrentPage(currentPage);
      // set settings
      const storedSettings = event.data.pluginMessage.settings as Settings;
      setSettings(storedSettings);
    };
    postMessage("refresh")();
  }, []);

  return (
    <main className={styles.app}>
      <Header>{currentPage ? `Styles on ${currentPage}` : "Styles"}</Header>
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
            isOpen={settings.LOCAL_STYLES_OPEN}
            onToggle={postMessage("storeSettings", {
              ["LOCAL_STYLES_OPEN" as SettingKey]: !settings.LOCAL_STYLES_OPEN,
            })}
            noStylesMessage="No local styles on this page"
          />
          <StyleList
            styles={figmaRemoteStyles}
            title="Remote styles"
            postMessage={postMessage}
            isOpen={settings.REMOTE_STYLES_OPEN}
            onToggle={postMessage("storeSettings", {
              ["REMOTE_STYLES_OPEN" as SettingKey]:
                !settings.REMOTE_STYLES_OPEN,
            })}
            noStylesMessage="No remote styles on this page"
          />
        </>
      )}
      <Footer settings={settings} />
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
