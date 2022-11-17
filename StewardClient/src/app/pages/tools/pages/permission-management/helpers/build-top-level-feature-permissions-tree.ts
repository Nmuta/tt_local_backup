import { GameTitle } from '@models/enums';
import { PermissionAttributeList } from '@services/api-v2/permissions/permissions.service';
import { PermAttribute, PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { AttributeTreeNode, TitleEnvironments } from '../permission-management.component';

/**
 * Builds the permission attributes tree structure with features at the top level.
 */
export function buildTreeWithFeaturesTopLevel(
  permList: PermissionAttributeList,
  titleEnvironments: TitleEnvironments,
): AttributeTreeNode[] {
  const returnArray: AttributeTreeNode[] = [];
  for (const key in permList) {
    const value = permList[key];
    const attributeName = getPermAttributeNameFromKey(key);
    const hasTitles = value.length > 0;
    const topLevelAttribute: PermAttribute = !hasTitles
      ? { attribute: attributeName, title: '', environment: '' }
      : null;
    returnArray.push({
      attribute: topLevelAttribute,
      name: attributeName,
      isChecked: false,
      children: generateTitleTreeNodes(attributeName, value, titleEnvironments),
    } as AttributeTreeNode);
  }

  return returnArray;
}

function generateTitleTreeNodes(
  attributeName: PermAttributeName,
  titles: GameTitle[],
  titleEnvironments: TitleEnvironments,
): AttributeTreeNode[] {
  if (titles.length <= 0) return [];

  return titles.map(title => {
    const environments = titleEnvironments[title];
    return {
      attribute: undefined,
      name: title,
      isChecked: false,
      children: generateEnvironmentTreeNodes(attributeName, title, environments),
    } as AttributeTreeNode;
  });
}

function generateEnvironmentTreeNodes(
  attributeName: PermAttributeName,
  title: GameTitle,
  environments: string[],
): AttributeTreeNode[] {
  return environments.map(environment => {
    return {
      attribute: { attribute: attributeName, title: title, environment: environment },
      name: environment,
      isChecked: false,
      children: [],
    } as AttributeTreeNode;
  });
}

function getPermAttributeNameFromKey(key: string): PermAttributeName {
  return (key[0].toUpperCase() + key.substring(1)) as PermAttributeName;
}
