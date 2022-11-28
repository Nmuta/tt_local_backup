import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
} from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { GameTitle, UserRole } from '@models/enums';
import { UserModelWithPermissions } from '@models/user.model';
import { Select } from '@ngxs/store';
import {
  PermissionAttributeList,
  PermissionsService,
} from '@services/api-v2/permissions/permissions.service';
import { PermAttribute, PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { UserService } from '@services/user';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import {
  EndpointKeyMemoryState,
  EndpointKeyMemoryModel,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { cloneDeep, find, keys, sortBy } from 'lodash';
import {
  debounceTime,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  VerifyUserPermissionChangeDialogComponent,
  VerifyUserPermissionChangeDialogData,
} from './components/verify-user-permissions-change-dialog/verify-user-permissions-change-dialog.component';
import { VerifyUserSwitchDialogComponent } from './components/verify-user-switch-dialong/verify-user-switch-dialog.component';
import { buildTreeWithFeaturesTopLevel } from './helpers/build-top-level-feature-permissions-tree';
import { buildTreeWithTitlesTopLevel } from './helpers/build-top-level-titles-permissions-tree';

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

export type TitleEnvironments = { [key: string]: string[] };

enum TreeView {
  FeatureTopLevel = 'FeatureTopLevel',
  TitleTopLevel = 'TitleTopLevel',
}

/** Displays the Steward permission management tool. */
@Component({
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
})
export class PermissionManagementComponent extends BaseComponent implements OnInit {
  @Select(EndpointKeyMemoryState) public endpointKeys$: Observable<EndpointKeyMemoryModel>;
  public allPermAttributes = keys(PermAttributeName);

  public getUsersActionMonitor = new ActionMonitor('GET all Steward users');
  public allUsers: UserModelWithPermissions[];
  public filteredUsers: UserModelWithPermissions[];
  public selectedUser: UserModelWithPermissions;
  public selectedUserHasPermChanges: boolean = false;
  public selectUserToManage$ = new Subject<UserModelWithPermissions>();
  public nameFilterFormControl = new FormControl(null);

  public getPermissionsActionMonitor = new ActionMonitor('GET permision attributes');
  public titleEnvironments: TitleEnvironments = {
    [GameTitle.FM8]: [],
    [GameTitle.FM7]: [],
    [GameTitle.FH5]: [],
    [GameTitle.FH4]: [],
  };

  /** Tree views & filters */
  public treeViews: string[] = keys(TreeView);
  public selectedTreeView = TreeView.FeatureTopLevel;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<AttributeTreeFlatNode, AttributeTreeNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<AttributeTreeNode, AttributeTreeFlatNode>();
  treeControl: FlatTreeControl<AttributeTreeFlatNode>;
  treeFlattener: MatTreeFlattener<AttributeTreeNode, AttributeTreeFlatNode>;
  dataSource: MatTreeFlatDataSource<AttributeTreeNode, AttributeTreeFlatNode>;
  defaultFeatureTopLevelTreeNodes: AttributeTreeNode[];
  defaultTitleTopLevelTreeNodes: AttributeTreeNode[];

  public get managePermissionCardSubtitle(): string {
    if (!this.selectedUser) {
      return 'Select user to view & manage their permissions';
    }

    return `${this.selectedUser.name} | ${this.selectedUser.emailAddress}`;
  }

  public get isUserSelected(): boolean {
    return !!this.selectedUser;
  }

  public get selectedUserId(): string {
    return this.selectedUser?.objectId ?? '';
  }

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly permissionsService: PermissionsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<AttributeTreeFlatNode>(this.getLevel, this.isExpandable);

    this.initStewardUsersList();
    this.initAttributeTree();

    let pendingUser: UserModelWithPermissions;
    this.selectUserToManage$
      .pipe(
        filter(() => this.getPermissionsActionMonitor.isDone),
        filter(v => !!v),
        tap(v => (pendingUser = v)),
        // Check for pending changes before switching
        switchMap(() => {
          if (!this.selectedUserHasPermChanges) return of(true);

          const dialogRef = this.dialog.open(VerifyUserSwitchDialogComponent);
          return dialogRef.afterClosed();
        }),
        filter(v => !!v),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.selectedUserHasPermChanges = false;
        this.selectedUser = pendingUser;
        this.setTreesSelectedAttributes(this.selectedUser.attributes);
      });

    this.nameFilterFormControl.valueChanges
      .pipe(debounceTime(HCI.TypingToAutoSearchDebounceMillis), takeUntil(this.onDestroy$))
      .subscribe(value => {
        let users = cloneDeep(this.allUsers);
        const filterValue = value.toLowerCase().trim();
        if (filterValue.length > 0) {
          users = users.filter(
            user =>
              user.name.toLowerCase().includes(filterValue) ||
              user.emailAddress.toLowerCase().includes(filterValue),
          );
        }

        this.filteredUsers = users;
      });
  }

  /** Opens the verify user permissions change dialog that will save permissions. */
  public savePermissionChanges(): void {
    if (!this.selectedUser) return;

    const updatedPerms = this.getSelectedPermsFromFlatTree();
    const dialogRef = this.dialog.open(VerifyUserPermissionChangeDialogComponent, {
      data: {
        currentPerms: this.selectedUser.attributes,
        updatedPerms: updatedPerms,
        user: this.selectedUser,
      } as VerifyUserPermissionChangeDialogData,
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  /** Sets the attribute key to current user perms. */
  public setTreesSelectedAttributes(selectedAttributes: PermAttribute[]): void {
    let attributeTree: AttributeTreeNode[] = [];
    switch (this.selectedTreeView) {
      case TreeView.FeatureTopLevel:
        attributeTree = cloneDeep(this.defaultFeatureTopLevelTreeNodes);
        break;
      case TreeView.TitleTopLevel:
        attributeTree = cloneDeep(this.defaultTitleTopLevelTreeNodes);
        break;
      default:
        throw new Error(`Invalid selectedTreeView: ${this.selectedTreeView}`);
    }

    attributeTree = this.setAttributesInTree(attributeTree, selectedAttributes);
    this.dataSource.data = attributeTree;
  }

  /** Toggle the node selection. Select/deselect all the descendants node. */
  public todoItemSelectionToggle(node: AttributeTreeFlatNode): void {
    this.selectedUserHasPermChanges = true;
    const descendants = this.treeControl.getDescendants(node);
    const descendantsPartiallySelected = this.descendantsPartiallySelected(node);
    node.isChecked = descendantsPartiallySelected ? node.isChecked : !node.isChecked;
    descendants.forEach(x => (x.isChecked = node.isChecked));
  }

  /** Toggle the node selection. Select/deselect all the descendants node. */
  public todoLeafItemSelectionToggle(node: AttributeTreeFlatNode): void {
    this.selectedUserHasPermChanges = true;
    node.isChecked = !node.isChecked;
    const parent = this.getParentNode(node);
    if (!!parent) {
      const siblings = this.treeControl.getDescendants(parent);
      parent.isChecked = !!siblings.find(x => x.isChecked);
    }
  }

  /** Whether part of the descendants are selected. */
  public descendantsPartiallySelected(node: AttributeTreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const checkedValuesExist = !!descendants.find(x => x.isChecked);
    const uncheckedValuesExist = !!descendants.find(x => !x.isChecked);

    return checkedValuesExist && uncheckedValuesExist;
  }

  /** Event when tree view selection is changed. */
  public treeViewChange(event: MatSelectChange): void {
    this.selectedTreeView = event.value;
    this.setTreesSelectedAttributes(this.getSelectedPermsFromFlatTree());
  }

  /** Undo permission changes. */
  public undoChanges(): void {
    this.selectedUserHasPermChanges = false;
    this.setTreesSelectedAttributes(this.selectedUser.attributes);
  }

  /** Whether the node has a child */
  public hasChild = (_: number, _nodeData: AttributeTreeFlatNode) => _nodeData.expandable;

  private initStewardUsersList(): void {
    this.userService
      .getAllStewardUsers$()
      .pipe(this.getUsersActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(users => {
        const nonAdminUsers = users.filter(user => user.role !== UserRole.LiveOpsAdmin);

        this.allUsers = sortBy(nonAdminUsers, user => {
          return user.name;
        }) as UserModelWithPermissions[];

        this.filteredUsers = cloneDeep(this.allUsers);
      });
  }

  private initAttributeTree(): void {
    this.endpointKeys$
      .pipe(
        filter(latest => {
          return (
            latest.Apollo.length > 0 &&
            latest.Sunrise.length > 0 &&
            latest.Woodstock.length > 0 &&
            latest.Steelhead.length > 0
          );
        }),
        tap(latest => {
          this.titleEnvironments[GameTitle.FM8] = latest.Steelhead;
          this.titleEnvironments[GameTitle.FM7] = latest.Apollo;
          this.titleEnvironments[GameTitle.FH5] = latest.Woodstock;
          this.titleEnvironments[GameTitle.FH4] = latest.Sunrise;
        }),
        switchMap(() =>
          this.permissionsService
            .getAllPermissionAttributes$()
            .pipe(this.getPermissionsActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$)),
        ),
        // Sort featre attribute list
        map(attributes => {
          const nonSubjectAttributes: PermissionAttributeList = {};
          const ugcAttributes: PermissionAttributeList = {};
          for (const key in attributes) {
            if (key.toLowerCase().includes('ugc')) {
              ugcAttributes[key] = attributes[key];
            } else {
              nonSubjectAttributes[key] = attributes[key];
            }
          }

          return { ...nonSubjectAttributes, ...ugcAttributes };
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(attributes => {
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.defaultFeatureTopLevelTreeNodes = buildTreeWithFeaturesTopLevel(
          attributes,
          this.titleEnvironments,
        );
        this.defaultTitleTopLevelTreeNodes = buildTreeWithTitlesTopLevel(
          attributes,
          this.titleEnvironments,
        );
        this.dataSource.data = [];
      });
  }

  /** Returns level of node in tree sturcture. */
  private getLevel = (node: AttributeTreeFlatNode) => node?.level;

  /** Whether the node is expandable. */
  private isExpandable = (node: AttributeTreeFlatNode) => node.expandable;

  /** Retrieves the nodes children. */
  private getChildren = (node: AttributeTreeNode): AttributeTreeNode[] => node.children;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private transformer = (node: AttributeTreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode?.name === node.name ? existingNode : new AttributeTreeFlatNode();
    flatNode.attribute = node.attribute;
    flatNode.name = node.name;
    flatNode.isChecked = node.isChecked;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  /**
   * Get the parent node of a node
   * From - https://material.angular.io/components/tree/examples#tree-checklist
   */
  private getParentNode(node: AttributeTreeFlatNode): AttributeTreeFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  private setAttributesInTree(
    nodes: AttributeTreeNode[],
    selectedAttributes: PermAttribute[],
  ): AttributeTreeNode[] {
    return nodes.map(node => {
      if (!!node.attribute) {
        const hasAttribute = !!find(selectedAttributes, {
          attribute: node.attribute.attribute,
          title: node.attribute.title,
          environment: node.attribute.environment,
        });

        node.isChecked = hasAttribute;
      }

      if (node.children.length > 0) {
        node.children = this.setAttributesInTree(node.children, selectedAttributes);
        const childrenCheckedCount = node.children.filter(child => child.isChecked).length;
        if (childrenCheckedCount === node.children.length) {
          node.isChecked = true;
        }
      }

      return node;
    });
  }

  private getSelectedPermsFromFlatTree(): PermAttribute[] {
    const nodes = this.treeControl.dataNodes;
    const selectedPerms: PermAttribute[] = [];

    for (const node of nodes) {
      if (!!node.attribute && node.isChecked) {
        selectedPerms.push(node.attribute);
      }
    }

    return selectedPerms;
  }
}
