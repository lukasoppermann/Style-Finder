import { NodeWithStyle, hasEffectStyle, hasFillStyle, hasGridStyle, hasTextStyle } from './hasStyle';
import { Settings } from './settings';

export const getNodesWithStyles = (parent: PageNode | DocumentNode, settings: Settings): NodeWithStyle[] => parent.findAllWithCriteria({
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
  .filter(n => (settings.SHOW_PAINT && hasFillStyle(n)) || (settings.SHOW_EFFECT && hasEffectStyle(n)) || (settings.SHOW_TEXT && hasTextStyle(n)) || (settings.SHOW_GRID && hasGridStyle(n))) as NodeWithStyle[];