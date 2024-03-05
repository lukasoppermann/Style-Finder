import { NodeWithStyle, hasEffectStyle, hasFillStyle, hasGridStyle, hasTextStyle } from './hasStyle';

export const getNodesWithStyles = (parent: PageNode | DocumentNode): NodeWithStyle[] => parent.findAllWithCriteria({
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