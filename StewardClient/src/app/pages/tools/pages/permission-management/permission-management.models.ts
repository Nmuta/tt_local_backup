import { PermAttribute } from '@services/perm-attributes/perm-attributes';

/**
 * Node for permission attribute tree items.
 */
export class AttributeTreeNode {
  children: AttributeTreeNode[];
  isChecked: boolean;
  attribute: PermAttribute;
  name: string;
}

/** Flat Node for permission attribute tree items. */
export class AttributeTreeFlatNode {
  attribute: PermAttribute;
  name: string;
  level: number;
  isChecked: boolean;
  expandable: boolean;
}

/** Key/Value pairing for titles and their environments */
export type TitleEnvironments = { [key: string]: string[] };
