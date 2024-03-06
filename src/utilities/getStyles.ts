import { getNodesWithStyles } from './getNodesWithStyles';
import { NodeWithStyle } from './hasStyle';

const getStyleIds = (node: NodeWithStyle) =>
  [node.fillStyleId, node.effectStyleId, node.textStyleId, node.gridStyleId].filter(Boolean) as string[]

export type styleData = {
  id: string,
  name: string,
  remote: boolean
  type?: null | "PAINT" | "EFFECT" | "TEXT" | "GRID",
  description?: string,
  nodes?: NodeWithStyle[]
}

const getStyleData = async (figma: PluginAPI, styleId: string): Promise<styleData> => {
  // get style data from figma
  const figmaStyleData = await figma.getStyleByIdAsync(styleId)
  // return styleData object
  if (!figmaStyleData) {
    return {
      id: styleId,
      name: "Broken style",
      remote: true
    }
  }
  return {
    id: styleId,
    name: figmaStyleData.name,
    type: figmaStyleData.type,
    description: figmaStyleData.description,
    remote: figmaStyleData.remote
  }
}


export const getStyles = async (figma: PluginAPI): Promise<Record<string, styleData>> => {
  const styleById = {} as Record<string, styleData>;
  const styleData = [] as Promise<styleData>[]
  // get nodes with styles
  const nodes = getNodesWithStyles(figma.currentPage);
  for (const node of nodes) {
    // get ids for all styles that are set on a node
    const styleIds = getStyleIds(node);
    //
    for (const styleId of styleIds) {
      if (!styleById[styleId]) {
        // @ts-ignore
        styleById[styleId] = {
          id: styleId,
          nodes: []
        }
        styleData.push(getStyleData(figma, styleId))
      }
      // add node to array
      styleById[styleId].nodes.push(node)
    }
  }
  // await style data
  await Promise.all(styleData).then((data) => data
    // @ts-ignore
    .map(style => {
      styleById[style.id] = {
        ...style,
        ...styleById[style.id]
      }
    })
  )
  // return data
  return styleById;
}