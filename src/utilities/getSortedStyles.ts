import { styleData } from './getStyles'

const typeOrder = {
  "PAINT": 1,
  "EFFECT": 2,
  "TEXT": 3,
  "GRID": 4
}

export const getSortedStyles = (stylesById: Record<string, styleData>): styleData[] => {
  const styles = Object.values(stylesById)
  styles.sort((a, b) => {
    if (typeOrder[a.type] < typeOrder[b.type]) return -1
    if (typeOrder[a.type] > typeOrder[b.type]) return 1
    return 0
  })
  return styles
}