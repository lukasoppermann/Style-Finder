import { getFromStore, setToStore } from './store'


export type Settings = {
  LOCAL_STYLES_OPEN: boolean
  REMOTE_STYLES_OPEN: boolean
  SHOW_PAINT: boolean
  SHOW_TEXT: boolean
  SHOW_EFFECT: boolean
  SHOW_GRID: boolean
}

export type SettingKey = keyof Settings

export const defaultSettings: Settings = {
  LOCAL_STYLES_OPEN: true,
  REMOTE_STYLES_OPEN: true,
  SHOW_PAINT: true,
  SHOW_TEXT: true,
  SHOW_EFFECT: true,
  SHOW_GRID: true
}

export const setSetting = (figma: PluginAPI, key: SettingKey, value: unknown): void => {
  // get current values
  const settings = {
    ...defaultSettings,
    ...getFromStore(figma, 'SETTINGS')
  }
  // update value
  settings[key] = value
  // save to store
  setToStore(figma, 'SETTINGS', settings)
}