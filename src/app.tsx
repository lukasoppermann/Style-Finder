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
  const [figmaStyles, setFigmaStyles] = React.useState<FigmaStyle[]>();

  React.useEffect(() => {
    onmessage = (event) => {
      const styles = event.data.pluginMessage.styles as FigmaStyle[];
      setFigmaStyles(styles);
    };
  }, []);

  return (
    <main className={styles.app}>
      <Header onRefresh={postMessage("refresh")}>Styles</Header>
      {figmaStyles ? (
        <StyleList styles={figmaStyles} postMessage={postMessage} />
      ) : (
        "Loading..."
      )}
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);

// {
/* <h2>Styles<button id="refresh">↻</button></h2>
<ul id="allStyles">

</ul>
<script>
  const list = document.getElementById('allStyles');
  const refresh = document.getElementById('refresh');

  const selectStyles = (e) => {
    if(e.target.dataset.styleid !== undefined) {
    console.log("selected", e.target, e.target.dataset, e.target.dataset.styleid)
    parent.postMessage({ pluginMessage: { type: 'selectNodes', data: e.target.dataset.styleid } }, '*')
    }
  }

  const makeStyleItem = (style) => {
    return `
      <li data-styleId="${style.id}">
        ${style.name} <span>${style.type}</span>
      </li>
    `
  }

  list.innerHTML = "Loading..."

  list.addEventListener('click', (e) => {
    selectStyles(e)
  })

  refresh.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'refresh' } }, '*')
  })

  onmessage = (event) => {
    const {styles} = event.data.pluginMessage
    list.innerHTML = Object.values(styles).map(style => makeStyleItem(style)).join("")
  }

</script> */
// }
