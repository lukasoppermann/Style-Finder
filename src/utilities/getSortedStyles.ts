import { styleData } from './getStyles'

const typeOrder = {
  "PAINT": 1,
  "EFFECT": 2,
  "TEXT": 3,
  "GRID": 4
}

export const getSortedStyles = (styles: styleData[]): styleData[] => {
  styles.sort((a, b) => {

    if (a.type === undefined || b.type !== undefined && typeOrder[a.type] < typeOrder[b.type]) return -1
    if (b.type === undefined || typeOrder[a.type] > typeOrder[b.type]) return 1
    return 0
  })
  return styles
}