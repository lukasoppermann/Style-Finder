import * as React from "react";
import styles from "./Footer.module.css";
import StyleSvg from "../StyleList/StyleSvgs";
import { SettingKey, Settings } from "../utilities/settings";

type Props = {
  settings: Settings;
};

const postMessage = (type: string, data?: unknown) => () => {
  parent.postMessage({ pluginMessage: { type, data } }, "*");
};

const Footer = ({ settings }: Props) => {
  return (
    <section className={styles.Footer}>
      <div className={styles.FooterLeftItems}>
        <button
          title={
            settings.SHOW_PAINT ? "Hide color styles" : "Show color styles"
          }
          data-enabled={settings.SHOW_PAINT || undefined}
          onClick={postMessage("storeSettings", {
            ["SHOW_PAINT" as SettingKey]: !settings.SHOW_PAINT,
          })}
        >
          <StyleSvg type="PAINT" />
        </button>
        <button
          title={settings.SHOW_TEXT ? "Hide text styles" : "Show text styles"}
          data-enabled={settings.SHOW_TEXT || undefined}
          onClick={postMessage("storeSettings", {
            ["SHOW_TEXT" as SettingKey]: !settings.SHOW_TEXT,
          })}
        >
          <StyleSvg type="TEXT" />
        </button>
        <button
          title={
            settings.SHOW_EFFECT ? "Hide effect styles" : "Show effect styles"
          }
          data-enabled={settings.SHOW_EFFECT || undefined}
          onClick={postMessage("storeSettings", {
            ["SHOW_EFFECT" as SettingKey]: !settings.SHOW_EFFECT,
          })}
        >
          <StyleSvg type="EFFECT" />
        </button>
        <button
          title={settings.SHOW_GRID ? "Hide grid styles" : "Show grid styles"}
          data-enabled={settings.SHOW_GRID || undefined}
          onClick={postMessage("storeSettings", {
            ["SHOW_GRID" as SettingKey]: !settings.SHOW_GRID,
          })}
        >
          <StyleSvg type="GRID" />
        </button>
      </div>
      <div className={styles.FooterRightItems}>
        <button
          data-enabled
          title="Refetch data from nodes"
          onClick={postMessage("refresh")}
        >
          ↻
        </button>
      </div>
    </section>
  );
};

export default Footer;
