export type NodeWithStyle = SceneNode & {
  fillStyleId: string
  effectStyleId: string
  textStyleId: string
  gridStyleId: string
  strokeStyleId: string
};

const hasRangeStyle = (node: SceneNode, fields: "textStyleId" | "fillStyleId"): node is NodeWithStyle => {
  return node.type === "TEXT" && node.getStyledTextSegments([fields]).length > 1
}

export const hasFillStyle = (node: SceneNode): node is NodeWithStyle => {
  return ("fillStyleId" in node && typeof node.fillStyleId === "string" && node.fillStyleId !== "") || hasRangeStyle(node, "fillStyleId")
}

export const hasTextStyle = (node: SceneNode): node is NodeWithStyle => {
  return ("textStyleId" in node && typeof node.textStyleId === "string" && node.textStyleId !== "") || hasRangeStyle(node, "textStyleId")
}

export const hasEffectStyle = (node: SceneNode): node is NodeWithStyle => {
  return "effectStyleId" in node && typeof node.effectStyleId === "string" && node.effectStyleId !== ""
}

export const hasGridStyle = (node: SceneNode): node is NodeWithStyle => {
  return "gridStyleId" in node && typeof node.gridStyleId === "string" && node.gridStyleId !== ""
}

export const hasStrokeStyle = (node: SceneNode): node is NodeWithStyle => {
  return "strokeStyleId" in node && typeof node.strokeStyleId === "string" && node.strokeStyleId !== ""
}