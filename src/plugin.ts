import { getSortedStyles } from './utilities/getSortedStyles';
import { getStyles } from './utilities/getStyles';
import { NodeWithStyle } from './utilities/hasStyle';
import { SettingKey, defaultSettings, setSetting } from './utilities/settings';
import { getFromStore } from './utilities/store';

figma.showUI(__html__, {
  width: 300,
  height: 400,
  themeColors: true
});

export type FigmaStyle = {
  id: string
  name: string
  type?: "PAINT" | "EFFECT" | "TEXT" | "GRID"
  description: string
  remote: string
  nodes: NodeWithStyle[]
}

const calcUiHeight = (figma: PluginAPI, localStyleCount: number, remoteStyleCount: number,): number => {
  const headerHeight = 48
  const footerHeight = 40
  // no items
  if (!localStyleCount && !remoteStyleCount) return headerHeight + footerHeight + 48

  const listHeaderHeight = 36
  const listMargin = 2 * 8
  const height = headerHeight + footerHeight + 2 * listHeaderHeight + listMargin + (localStyleCount ? localStyleCount * 40 : 40) + (remoteStyleCount ? remoteStyleCount * 40 : 40)
  const maxHeight = parseInt(`${figma.viewport.bounds.height * figma.viewport.zoom}`) - 100
  // return max height if height is greater than max height
  if (height > maxHeight) return maxHeight
  // otherwise return height
  return height
}

const runPlugin = async () => {
  // get settings
  let settings = {
    ...defaultSettings,
    ...getFromStore(figma, 'SETTINGS')
  }
  figma.ui.postMessage({
    settings,
    loading: true,
  })
  // await figma.currentPage.loadAsync();
  // get all nodes in current page with style
  let stylesById = await getStyles(figma, settings);
  let remoteStyles = getSortedStyles(Object.values(stylesById).filter(style => style.remote))
  let localStyles = getSortedStyles(Object.values(stylesById).filter(style => !style.remote))
  // resize ui
  figma.ui.resize(300, calcUiHeight(figma, localStyles.length, remoteStyles.length));
  //
  figma.ui.postMessage({
    remoteStyles,
    localStyles,
    settings,
    currentPage: figma.currentPage.name,
    loading: false,
  })

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
      // update settings
      settings = {
        ...defaultSettings,
        ...getFromStore(figma, 'SETTINGS')
      }

      if (Object.keys(msg.data).some((key: SettingKey) => refreshOnUpdate.includes(key))) {
        stylesById = await getStyles(figma, settings);
        remoteStyles = getSortedStyles(Object.values(stylesById).filter(style => style.remote))
        localStyles = getSortedStyles(Object.values(stylesById).filter(style => !style.remote))
        figma.ui.resize(300, calcUiHeight(figma, localStyles.length, remoteStyles.length));
      }

      // refresh ui
      figma.ui.postMessage({
        remoteStyles,
        localStyles,
        settings,
        currentPage: figma.currentPage.name,
        loading: false,
      })
    }

    if (msg.type === 'refresh') {
      stylesById = await getStyles(figma, settings);
      remoteStyles = getSortedStyles(Object.values(stylesById).filter(style => style.remote))
      localStyles = getSortedStyles(Object.values(stylesById).filter(style => !style.remote))
      figma.ui.resize(300, calcUiHeight(figma, localStyles.length, remoteStyles.length));
      figma.ui.postMessage({
        remoteStyles,
        localStyles,
        settings,
        currentPage: figma.currentPage.name,
        loading: false,
      })
    }
  }
}

runPlugin()

figma.on('currentpagechange', () => {
  runPlugin()
})