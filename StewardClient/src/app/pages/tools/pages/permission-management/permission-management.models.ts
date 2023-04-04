import { GuidLikeString } from '@models/extended-types';
import { UserModel } from '@models/user.model';
import { PermAttribute } from '@services/perm-attributes/perm-attributes';

/**
 * Node for permission attribute tree items.
 */
export class AttributeTreeNode {
  children: AttributeTreeNode[];
  isChecked: boolean;
  attribute: PermAttribute;
  name: string;
  disabled?: boolean;
}

/** Flat Node for permission attribute tree items. */
export class AttributeTreeFlatNode {
  attribute: PermAttribute;
  name: string;
  level: number;
  isChecked: boolean;
  expandable: boolean;
  disabled?: boolean;
}

/** Key/Value pairing for titles and their environments */
export type TitleEnvironments = { [key: string]: string[] };

/** Represents a Steward team. */
export type StewardTeam = {
  name: string;
  members: GuidLikeString[];

  // Client-only
  teamLead: UserModel;
};
