import { loadUi } from './utilities/loadUI';
import { SettingKey, setSetting } from './utilities/settings';

figma.showUI(__html__, {
  width: 300,
  height: 400,
  themeColors: true
});

const runPlugin = async () => {
  // await figma.currentPage.loadAsync();
  // get all nodes in current page with style
  let stylesById

  figma.ui.onmessage = async (msg: { type: string, data: unknown }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'selectNodes') {
      const styleId = msg.data as string
      figma.currentPage.selection = stylesById[styleId].nodes;
      figma.viewport.scrollAndZoomIntoView(stylesById[styleId].nodes);
      figma.notify(`Selected ${stylesById[styleId].nodes.length} nodes with style "${stylesById[styleId].name}"`)
    }
    // store settings
    if (msg.type === 'storeSettings') {
      const refreshOnUpdate: SettingKey[] = ["SHOW_EFFECT", "SHOW_GRID", "SHOW_PAINT", "SHOW_TEXT"]
      const data = msg.data as Record<SettingKey, string | boolean>
      for (const key in data) {
        setSetting(figma, key as SettingKey, data[key])
      }

      if (Object.keys(msg.data).some((key: SettingKey) => refreshOnUpdate.includes(key))) {
        stylesById = await loadUi(figma)
      } else {
        stylesById = await loadUi(figma, stylesById)
      }

    }

    if (msg.type === 'refresh') {
      stylesById = await loadUi(figma)
    }
  }

  figma.on('currentpagechange', async () => {
    stylesById = await loadUi(figma)
  })
}

runPlugin()