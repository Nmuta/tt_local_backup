import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS,
} from '@angular/material/checkbox';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/**
 * Node for Racers Cup Key items.
 */
export class RacersCupKeyNode {
  children: RacersCupKeyNode[];
  isChecked: boolean;
  item: string;
}

/** Flat item representing node in Racers Cup Key tree structure. */
export class RacersCupKeyFlatNode {
  item: string;
  level: number;
  isChecked: boolean;
  expandable: boolean;
}

/** Modal component to display Racer's Cup key. */
@Component({
  selector: 'racers-cup-key',
  templateUrl: './racers-cup-key.component.html',
  styleUrls: ['./racers-cup-key.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
})
export class RacersCupKeyComponent implements OnChanges {
  /** REVIEW-COMMENT: Filter criteria. */
  @Input() public filterCriteria: Map<string, string[]>;
  /** REVIEW-COMMENT: Output when results are filtered. */
  @Output() public filterResults = new EventEmitter<Map<string, string[]>>();

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<RacersCupKeyFlatNode, RacersCupKeyNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<RacersCupKeyNode, RacersCupKeyFlatNode>();

  treeControl: FlatTreeControl<RacersCupKeyFlatNode>;
  treeFlattener: MatTreeFlattener<RacersCupKeyNode, RacersCupKeyFlatNode>;
  dataSource: MatTreeFlatDataSource<RacersCupKeyNode, RacersCupKeyFlatNode>;

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
    this.treeControl = new FlatTreeControl<RacersCupKeyFlatNode>(this.getLevel, this.isExpandable);
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
  buildFileTree(map: Map<string, string[]>): RacersCupKeyNode[] {
    const returnArray: RacersCupKeyNode[] = [];
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
  public ToggleAll(toggleOn: boolean): void {
    this.treeControl.dataNodes.forEach(node => {
      const descendants = this.treeControl.getDescendants(node);
      node.isChecked = toggleOn;
      descendants.forEach(x => (x.isChecked = toggleOn));

      this.sendFilterResults();
    });
  }

  /** Toggle the node selection. Select/deselect all the descendants node. */
  public ItemSelectionToggle(node: RacersCupKeyFlatNode): void {
    const descendants = this.treeControl.getDescendants(node);
    const descendantsPartiallySelected = this.descendantsPartiallySelected(node);
    node.isChecked = descendantsPartiallySelected ? node.isChecked : !node.isChecked;
    descendants.forEach(x => (x.isChecked = node.isChecked));

    this.sendFilterResults();
  }

  /** Toggle the node selection. Select/deselect all the descendants node. */
  public LeafItemSelectionToggle(node: RacersCupKeyFlatNode): void {
    node.isChecked = !node.isChecked;
    const parent = this.getParentNode(node);
    const siblings = this.treeControl.getDescendants(parent);

    parent.isChecked = !!siblings.find(x => x.isChecked);

    this.sendFilterResults();
  }

  /** Whether part of the descendants are selected. */
  public descendantsPartiallySelected(node: RacersCupKeyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const checkedValuesExist = !!descendants.find(x => x.isChecked);
    const uncheckedValuesExist = !!descendants.find(x => !x.isChecked);

    return checkedValuesExist && uncheckedValuesExist;
  }

  /** Whether the node has a child */
  public hasChild = (_: number, _nodeData: RacersCupKeyFlatNode) => _nodeData.expandable;

  /** Returns level of node in tree sturcture. */
  private getLevel = (node: RacersCupKeyFlatNode) => node.level;

  /** Whether the node is expandable. */
  private isExpandable = (node: RacersCupKeyFlatNode) => node.expandable;

  /** Retrieves the nodes children. */
  private getChildren = (node: RacersCupKeyNode): RacersCupKeyNode[] => node.children;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private transformer = (node: RacersCupKeyNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode?.item === node.item ? existingNode : new RacersCupKeyFlatNode();
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
  private getParentNode(node: RacersCupKeyFlatNode): RacersCupKeyFlatNode | null {
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
