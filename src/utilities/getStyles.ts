import { getNodesWithStyles } from './getNodesWithStyles';
import { NodeWithStyle } from './hasStyle';

const getStyleIds = (node: NodeWithStyle) =>
  [node.fillStyleId, node.effectStyleId, node.textStyleId, node.gridStyleId].filter((id) => id && typeof id === "string") as string[]

export type styleData = {
  id: string,
  name: string,
  remote: boolean
  type?: "PAINT" | "EFFECT" | "TEXT" | "GRID",
  description?: string,
  nodes?: NodeWithStyle[]
}

const getStyleData = async (figma: PluginAPI, styleId: string): Promise<styleData> => {
  // get style data from figma
  try {
    const figmaStyleData = await figma.getStyleByIdAsync(styleId)
    if (!figmaStyleData) throw new Error("Style not found in figma");
    // return styleData object
    return {
      id: styleId,
      name: figmaStyleData.name,
      type: figmaStyleData.type,
      description: figmaStyleData.description,
      remote: figmaStyleData.remote
    }
  } catch (error) {
    console.log(`Error getting style data for ${styleId}`, error)
    // return styleData object
    return {
      id: styleId,
      name: "Broken style",
      remote: true
    }
  }
}


export const getStyles = async (figma: PluginAPI, page: PageNode | DocumentNode = figma.currentPage): Promise<Record<string, styleData>> => {
  const styleById = {} as Record<string, styleData>;
  const styleData = [] as Promise<styleData>[]
  // get nodes with styles
  const nodes = getNodesWithStyles(page);
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