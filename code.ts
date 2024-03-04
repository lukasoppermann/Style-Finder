 // This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

type NodeWithStyle = SceneNode & {
  fillStyleId: string
  effectStyleId: string
  textStyleId: string
  gridStyleId: string
};

const hasFillStyle = (node: SceneNode): node is NodeWithStyle => {
  return "fillStyleId" in node && typeof node.fillStyleId === "string" && node.fillStyleId !== ""
}

const hasEffectStyle = (node: SceneNode): node is NodeWithStyle => {
  return "effectStyleId" in node && typeof node.effectStyleId === "string" && node.effectStyleId !== ""
}

const hasTextStyle = (node: SceneNode): node is NodeWithStyle => {
  return "textStyleId" in node && typeof node.textStyleId === "string" && node.textStyleId !== ""
}

const hasGridStyle = (node: SceneNode): node is NodeWithStyle => {
  return "gridStyleId" in node && typeof node.gridStyleId === "string" && node.gridStyleId !== ""
}

const getStyleIds = (node: NodeWithStyle) =>
  [node.fillStyleId, node.effectStyleId, node.textStyleId, node.gridStyleId].filter(Boolean) as string[]

const getStyleData = (style: { id: string, data: BaseStyle }) => {
  if (!style.data) {
    return {
      id: style.id,
      name: "Broken style",
      type: null,
      description: null,
      remote: true
    }
  }
  return {
    id: style.id,
    name: style.data.name,
    type: style.data.type,
    description: style.data.description,
    remote: style.data.remote
  }
}

const getStylesById = async (nodes: NodeWithStyle[]): Promise<Record<string, unknown>> => { 
  const styleById = {} as Record<string, unknown>;
  const styleData = []

  for (const node of nodes) {
    const styleIds = getStyleIds(node);
    for (const styleId of styleIds) {
      if (!styleById[styleId]) {
        styleData.push({
          id: styleId,
          data: await figma.getStyleByIdAsync(styleId)
        })
        styleById[styleId] = {
          id: styleId,
          nodes: []
        }
      }
      // @ts-ignore
      styleById[styleId].nodes.push(node)
    }
  }

  await Promise.all(styleData
    // @ts-ignore
    .map(async (style: { id: string, data: BaseStyle }) => {
      styleById[style.id] = {
        ...getStyleData(style),
        // @ts-ignore
        nodes: styleById[style.id].nodes.map(n => {
          return {
            id: n.id,
            name: n.name,
          }
        }),
      };
    }))
  
  return styleById;
}

const getNodesWithStyles = async (figma: PluginAPI): Promise<NodeWithStyle[]> => figma.currentPage.findAllWithCriteria({
    types: ["BOOLEAN_OPERATION",
      "COMPONENT",
      "COMPONENT_SET",
      "ELLIPSE",
      "FRAME",
      "INSTANCE",
      "LINE",
      "POLYGON",
      "RECTANGLE",
      "SHAPE_WITH_TEXT",
      "STAMP",
      "STAR",
      "STICKY",
      "TEXT",
      "VECTOR",]
  })
    .filter(n => hasFillStyle(n) || hasEffectStyle(n) || hasTextStyle(n) || hasGridStyle(n)) as NodeWithStyle[];


const runPlugin = async () => {
  await figma.currentPage.loadAsync();
  // get all nodes in current page with styles
  let stylesById = await getStylesById(await getNodesWithStyles(figma));

  figma.ui.postMessage({
    styles: stylesById
  })



  // const styleById = nodes.map(n => {
  //   return {
  //     id: style.id,
  //     name: style.name,
  //     type: style.type,
  //     description: style.description,
  //     remote: style.remote,

  //   };
  
  // })) 


    // as Record<string, {
    //   id: string,
    //   name: string,
    //   type: string,
    //   description: string,
    //   remote: boolean,
    //   nodes: SceneNode[],
  // } >
  
  // for (const node of nodes) {
  //   const style = figma.getStyleByIdAsync(node.fillStyleId);
  //   styleById[node.fillStyleId] = style;
  // }

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = async (msg: { type: string, data: string }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'selectNodes') {
      const styleId = msg.data
      // @ts-ignore
      figma.currentPage.selection = stylesById[styleId].nodes;
    }

    if (msg.type === 'refresh') { 
      stylesById = await getStylesById(await getNodesWithStyles(figma));

      figma.ui.postMessage({
        styles: stylesById
      })
    }
    // for (let i = 0; i < msg.count; i++) {
    //   const rect = figma.createRectangle();
    //   rect.x = i * 150;
    //   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
    //   figma.currentPage.appendChild(rect);
    //   nodes.push(rect);
    // }
    // figma.currentPage.selection = nodes;
    // figma.viewport.scrollAndZoomIntoView(nodes);

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
  }
}

runPlugin()