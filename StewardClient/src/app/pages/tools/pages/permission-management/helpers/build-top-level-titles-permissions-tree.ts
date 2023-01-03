import { GameTitle } from '@models/enums';
import { PermissionAttributeList } from '@services/api-v2/permissions/permissions.service';
import {
  getPermAttributeNameFromKey,
  PermAttributeName,
} from '@services/perm-attributes/perm-attributes';
import { includes, keys } from 'lodash';
import { AttributeTreeNode, TitleEnvironments } from '../permission-management.component';

/**
 * Builds the permission attributes tree structure with titles at the top level.
 */
export function buildTreeWithTitlesTopLevel(
  permList: PermissionAttributeList,
  titleEnvironments: TitleEnvironments,
): AttributeTreeNode[] {
  const returnArray: AttributeTreeNode[] = [];
  const attributesWithoutTitles = keys(permList)
    .filter(perm => permList[perm]?.length <= 0)
    .map(
      perm =>
        ({
          attribute: { attribute: perm, title: '', environment: '' },
          name: perm,
          isChecked: false,
          children: [],
        } as AttributeTreeNode),
    );
  returnArray.push(...attributesWithoutTitles);

  const availableTitles = getAvailableTitlesFromAttributesList(permList);
  for (const title of availableTitles) {
    const environments = titleEnvironments[title];
    returnArray.push({
      attribute: null,
      name: title,
      isChecked: false,
      children: generateEnvironmentTreeNodes(permList, title, environments),
    } as AttributeTreeNode);
  }

  return returnArray;
}

function generateEnvironmentTreeNodes(
  permList: PermissionAttributeList,
  title: GameTitle,
  environments: string[],
): AttributeTreeNode[] {
  return environments.map(environment => {
    return {
      attribute: null,
      name: environment,
      isChecked: false,
      children: generateAttributeTreeNodes(permList, title, environment),
    } as AttributeTreeNode;
  });
}

function generateAttributeTreeNodes(
  permList: PermissionAttributeList,
  title: GameTitle,
  environment: string,
): AttributeTreeNode[] {
  const attributesWithTitle: PermAttributeName[] = [];
  for (const key in permList) {
    const titles = permList[key];
    if (includes(titles, title)) {
      attributesWithTitle.push(getPermAttributeNameFromKey(key));
    }
  }

  return attributesWithTitle.map(attributeName => {
    return {
      attribute: { attribute: attributeName, title: title, environment: environment },
      name: attributeName,
      isChecked: false,
      children: [],
    } as AttributeTreeNode;
  });
}

function getAvailableTitlesFromAttributesList(permList: PermissionAttributeList): GameTitle[] {
  const availableTitles: GameTitle[] = [];
  for (const key in permList) {
    const titles = permList[key];
    const hasTitles = titles.length > 0;
    if (!hasTitles) continue; // These attributes need to be added manually to top level as they have no title

    for (const title of titles) {
      if (!includes(availableTitles, title)) {
        availableTitles.push(title as GameTitle);
      }
    }
  }

  return availableTitles;
}
