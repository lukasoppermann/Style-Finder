import { getNodesWithStyles } from './getNodesWithStyles';
import { NodeWithStyle } from './hasStyle';
import { Settings } from './settings';

const getRangeStyleIds = (node: NodeWithStyle, settings: Settings) => {
  if (node.type === "TEXT") {
    return node.getStyledTextSegments(["textStyleId", "fillStyleId"]).flatMap(segment => [(settings.SHOW_PAINT ? segment.fillStyleId : undefined), (settings.SHOW_TEXT ? segment.textStyleId : undefined)])
  }
  return []
}

const getStyleIds = (node: NodeWithStyle, settings: Settings) =>
  [
    (settings.SHOW_PAINT ? node.fillStyleId : undefined),
    (settings.SHOW_PAINT ? node.strokeStyleId : undefined),
    (settings.SHOW_EFFECT ? node.effectStyleId : undefined),
    (settings.SHOW_TEXT ? node.textStyleId : undefined),
    (settings.SHOW_GRID ? node.gridStyleId : undefined),
    ...getRangeStyleIds(node, settings)
  ].filter((id) => id && typeof id === "string") as string[]

export type styleData = {
  id: string,
  name: string,
  type?: "PAINT" | "EFFECT" | "TEXT" | "GRID",
  description?: string,
  remote: boolean
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


export const getStyles = async (figma: PluginAPI, settings: Settings, page: PageNode | DocumentNode = figma.currentPage): Promise<Record<string, styleData>> => {
  const styleById = {} as Record<string, styleData>;
  const styleData = [] as Promise<styleData>[]
  // get nodes with styles
  const nodes = getNodesWithStyles(page, settings);

  for (const node of nodes) {
    // get ids for all styles that are set on a node
    const styleIds = getStyleIds(node, settings);
    //
    for (const styleId of styleIds) {
      if (!styleById[styleId]) {
        // @ts-expect-error: not all properties are set
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