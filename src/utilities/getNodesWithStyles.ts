import { NodeWithStyle, hasEffectStyle, hasFillStyle, hasGridStyle, hasTextStyle, hasStrokeStyle } from './hasStyle';
import { Settings } from './settings';

const isValidNode = (node: SceneNode): node is NodeWithStyle => ["BOOLEAN_OPERATION",
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
  "VECTOR",].includes(node.type)

const hasRequestStyles = (n: NodeWithStyle, settings: Settings) =>
  (settings.SHOW_PAINT && hasFillStyle(n))
  || (settings.SHOW_EFFECT && hasEffectStyle(n))
  || (settings.SHOW_TEXT && hasTextStyle(n))
  || (settings.SHOW_GRID && hasGridStyle(n))
  || (settings.SHOW_PAINT && hasStrokeStyle(n))

export const getNodesWithStyles = (parent: PageNode | DocumentNode, settings: Settings): NodeWithStyle[] => parent.findAll((n) => isValidNode(n) && hasRequestStyles(n, settings)) as NodeWithStyle[]
