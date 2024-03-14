import { getFromStore, setToStore } from './store'

export type SettingKey = 'LOCAL_STYLES_OPEN' | 'REMOTE_STYLES_OPEN'

export type Settings = {
  LOCAL_STYLES_OPEN: boolean
  REMOTE_STYLES_OPEN: boolean
}

export const defaultSettings: Settings = {
  LOCAL_STYLES_OPEN: true,
  REMOTE_STYLES_OPEN: true
}

export const setSetting = (figma: PluginAPI, key: SettingKey, value: unknown): void => {
  // get current values
  const settings = getFromStore(figma, 'SETTINGS') || defaultSettings
  // update value
  settings[key] = value
  // save to store
  setToStore(figma, 'SETTINGS', settings)
}