import { calcUiHeight } from './calcUiHeight';
import { getSortedStyles } from './getSortedStyles';
import { getStyles, styleData } from './getStyles';
import { defaultSettings } from './settings';
import { getFromStore } from './store';

export const loadUi = async (figma: PluginAPI, stylesById?: Record<string, styleData>) => {
  // get settings
  const settings = {
    ...defaultSettings,
    ...getFromStore(figma, 'SETTINGS')
  }
  // fetch nodes and styles if not provided
  if (!stylesById) {
    stylesById = await getStyles(figma, settings);
  }
  const remoteStyles = getSortedStyles(Object.values(stylesById).filter(style => style.remote))
  const localStyles = getSortedStyles(Object.values(stylesById).filter(style => !style.remote))
  // resize ui
  figma.ui.resize(300, calcUiHeight(figma, localStyles.length, remoteStyles.length));
  // post data to UI
  figma.ui.postMessage({
    remoteStyles,
    localStyles,
    settings,
    currentPage: figma.currentPage.name
  })
  // return styles
  return stylesById
}