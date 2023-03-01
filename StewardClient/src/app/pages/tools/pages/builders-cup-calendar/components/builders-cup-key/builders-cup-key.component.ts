import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS,
} from '@angular/material/checkbox';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/**
 * Node for Builders Cup Key items.
 */
export class BuildersCupKeyNode {
  children: BuildersCupKeyNode[];
  isChecked: boolean;
  item: string;
}

/** Flat item representing node in Builders Cup Key tree structure. */
export class BuildersCupKeyFlatNode {
  item: string;
  level: number;
  isChecked: boolean;
  expandable: boolean;
}

/** Modal component to display Builder's Cup key. */
@Component({
  selector: 'builders-cup-key',
  templateUrl: './builders-cup-key.component.html',
  styleUrls: ['./builders-cup-key.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
})
export class BuildersCupKeyComponent implements OnChanges {
  /** Filter criteria. */
  @Input() public filterCriteria: Map<string, string[]>;
  /** Output when results are filtered. */
  @Output() public filterResults = new EventEmitter<Map<string, string[]>>();

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<BuildersCupKeyFlatNode, BuildersCupKeyNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<BuildersCupKeyNode, BuildersCupKeyFlatNode>();

  treeControl: FlatTreeControl<BuildersCupKeyFlatNode>;
  treeFlattener: MatTreeFlattener<BuildersCupKeyNode, BuildersCupKeyFlatNode>;
  dataSource: MatTreeFlatDataSource<BuildersCupKeyNode, BuildersCupKeyFlatNode>;

  /** Lifecycle hook. */
  ngOnChanges(): void {
    if (!this.filterCriteria) {
      return;
    }

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<BuildersCupKeyFlatNode>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataSource.data = this.buildFileTree(this.filterCriteria);
  }

  /** Emit list of values to filter on. */
  public sendFilterResults(): void {
    const resultMap = new Map<string, string[]>();

    for (const node of this.dataSource.data) {
      if (this.nestedNodeMap?.get(node)?.isChecked) {
        const series = node.item;
        const playlists = node.children
          .filter(child => this.nestedNodeMap?.get(child)?.isChecked)
          .map(filteredNode => filteredNode.item);
        resultMap.set(series, playlists);
      }
    }

    this.filterResults.emit(resultMap);
  }

  /**
   * Build the file structure tree.
   */
  buildFileTree(map: Map<string, string[]>): BuildersCupKeyNode[] {
    const returnArray: BuildersCupKeyNode[] = [];
    for (const keyValuePair of map) {
      returnArray.push({
        item: keyValuePair[0],
        isChecked: true,
        children: keyValuePair[1].map(x => {
          return { item: x, children: [], isChecked: true };
        }),
      });
    }

    return returnArray;
  }

  /** Toggle all nodes on/off. */
  public toggleAll(toggleOn: boolean): void {
    this.treeControl.dataNodes.forEach(node => {
      const descendants = this.treeControl.getDescendants(node);
      node.isChecked = toggleOn;
      descendants.forEach(x => (x.isChecked = toggleOn));

      this.sendFilterResults();
    });
  }

  /** Toggle the node selection. Select/deselect all the descendants node. */
  public itemSelectionToggle(node: BuildersCupKeyFlatNode): void {
    const descendants = this.treeControl.getDescendants(node);
    const descendantsPartiallySelected = this.descendantsPartiallySelected(node);
    node.isChecked = descendantsPartiallySelected ? node.isChecked : !node.isChecked;
    descendants.forEach(x => (x.isChecked = node.isChecked));

    this.sendFilterResults();
  }

  /** Toggle the node selection. Select/deselect all the descendants node. */
  public leafItemSelectionToggle(node: BuildersCupKeyFlatNode): void {
    node.isChecked = !node.isChecked;
    const parent = this.getParentNode(node);
    const siblings = this.treeControl.getDescendants(parent);

    parent.isChecked = !!siblings.find(x => x.isChecked);

    this.sendFilterResults();
  }

  /** Whether part of the descendants are selected. */
  public descendantsPartiallySelected(node: BuildersCupKeyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const checkedValuesExist = !!descendants.find(x => x.isChecked);
    const uncheckedValuesExist = !!descendants.find(x => !x.isChecked);

    return checkedValuesExist && uncheckedValuesExist;
  }

  /** Whether the node has a child */
  public hasChild = (_: number, _nodeData: BuildersCupKeyFlatNode) => _nodeData.expandable;

  /** Returns level of node in tree sturcture. */
  private getLevel = (node: BuildersCupKeyFlatNode) => node.level;

  /** Whether the node is expandable. */
  private isExpandable = (node: BuildersCupKeyFlatNode) => node.expandable;

  /** Retrieves the nodes children. */
  private getChildren = (node: BuildersCupKeyNode): BuildersCupKeyNode[] => node.children;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private transformer = (node: BuildersCupKeyNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode?.item === node.item
        ? existingNode
        : new BuildersCupKeyFlatNode();
    flatNode.item = node.item;
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
  private getParentNode(node: BuildersCupKeyFlatNode): BuildersCupKeyFlatNode | null {
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
}
