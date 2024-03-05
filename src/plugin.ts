import { getStyles } from './utilities/getStyles';
import { NodeWithStyle } from './utilities/hasStyle';

figma.showUI(__html__, {
  width: 300,
  height: 400,
  themeColors: true
});

export type FigmaStyle = {
  id: string
  name: string
  type: null | "PAINT" | "EFFECT" | "TEXT" | "GRID"
  description: string
  remote: string
  nodes: NodeWithStyle[]
}

const calcUiHeight = (styleCount: number) => 50 + (styleCount * 36)

const runPlugin = async () => {
  await figma.currentPage.loadAsync();
  // get all nodes in current page with styles
  let stylesById = await getStyles(figma);
  // resize ui
  figma.ui.resize(300, calcUiHeight(Object.values(stylesById).length));
  //
  figma.ui.postMessage({
    styles: Object.values(stylesById)
  })

  figma.ui.onmessage = async (msg: { type: string, data: string }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'selectNodes') {
      const styleId = msg.data
      // @ts-ignore
      figma.currentPage.selection = stylesById[styleId].nodes;
      figma.viewport.scrollAndZoomIntoView(stylesById[styleId].nodes);
      figma.notify(`Selected ${stylesById[styleId].nodes.length} nodes with style "${stylesById[styleId].name}"`)
    }

    if (msg.type === 'refresh') {
      stylesById = await getStyles(figma);
      figma.ui.resize(300, calcUiHeight(Object.values(stylesById).length));
      figma.ui.postMessage({
        styles: Object.values(stylesById)
      })
    }
  }
}

runPlugin()