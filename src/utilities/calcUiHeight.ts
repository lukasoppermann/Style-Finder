export const calcUiHeight = (figma: PluginAPI, localStyleCount: number, remoteStyleCount: number,): number => {
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