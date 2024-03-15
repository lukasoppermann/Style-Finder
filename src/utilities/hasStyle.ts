export type NodeWithStyle = SceneNode & {
  fillStyleId: string
  effectStyleId: string
  textStyleId: string
  gridStyleId: string
  strokeStyleId: string
};

export const hasFillStyle = (node: SceneNode): node is NodeWithStyle => {
  return "fillStyleId" in node && typeof node.fillStyleId === "string" && node.fillStyleId !== ""
}

export const hasEffectStyle = (node: SceneNode): node is NodeWithStyle => {
  return "effectStyleId" in node && typeof node.effectStyleId === "string" && node.effectStyleId !== ""
}

export const hasTextStyle = (node: SceneNode): node is NodeWithStyle => {
  return "textStyleId" in node && typeof node.textStyleId === "string" && node.textStyleId !== ""
}

export const hasGridStyle = (node: SceneNode): node is NodeWithStyle => {
  return "gridStyleId" in node && typeof node.gridStyleId === "string" && node.gridStyleId !== ""
}

export const hasStrokeStyle = (node: SceneNode): node is NodeWithStyle => {
  return "strokeStyleId" in node && typeof node.strokeStyleId === "string" && node.strokeStyleId !== ""
}