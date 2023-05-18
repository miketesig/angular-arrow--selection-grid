import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { sampleProducts } from './products';
import {
  GridComponent,
  GridDataResult,
  RowArgs,
  SelectableSettings,
} from '@progress/kendo-angular-grid';

@Component({
  selector: 'my-app',
  template: `
        <div class="example-config">
            <input #findThis (keyup)="handleKeyup($event)" placeholder="trova..." [(ngModel)]="filterText">
            <pre>Selected: {{this.selectedItem?.ProductName}}</pre>
        </div>

        <kendo-grid 
        [data]="gridView"
        [skip]="skip"
        [pageable]="false"
        [navigable]="true"
        [height]="500"
        [selectable]="selectableSettings"
        kendoGridSelectBy="ProductID"
        [(selectedKeys)]="mySelection"
        (selectionChange)="changeSelection($event)"
        (dblclick)="onDblClick($event)"       
        >
            <kendo-grid-column field="ProductName" title="Product Name" [width]="150"> </kendo-grid-column>
            <kendo-grid-column field="FirstOrderedOn" title="First Ordered On" [width]="240" filter="date" format="{0:d}">
            </kendo-grid-column>
            <kendo-grid-column field="UnitPrice" title="Unit Price" [width]="180" filter="numeric" format="{0:c}"> </kendo-grid-column>
            <kendo-grid-column field="Discontinued" [width]="120" filter="boolean">
                <ng-template kendoGridCellTemplate let-dataItem>
                    <input type="checkbox" [checked]="dataItem.Discontinued" disabled />
                </ng-template>
            </kendo-grid-column>
        </kendo-grid>
    `,
  styles: [
    `
            .window-content {
                display: flex;
                flex-direction: column;
            }
        `,
  ],
})
export class AppComponent {
  @ViewChild('findThis', { static: false }) findThis: ElementRef;
  public gridView: GridDataResult;
  public items: any[] = sampleProducts;
  public mySelection: number[] = [1];
  public pageSize = 500;
  public skip = 0;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public filterText;
  public selectedItem;

  constructor() {
    this.loadItems();
  }

  ngAfterViewInit() {
    //disabilitare se si vuole editare roba qui
    //this.findThis?.nativeElement.focus();
  }

  changeSelection(item) {
    if (item.selectedRows[0]) {
      this.selectedItem = item.selectedRows[0].dataItem;
      console.log(item.selectedRows[0].dataItem);
    }
  }

  onDblClick(e) {
    console.log('Double click-->close the window (maybe)');
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length,
    };
  }

  // Use an arrow function to capture the 'this' execution context of the class.
  public isRowSelected = (e: RowArgs): boolean => {
    console.log(this.gridView, e);
    return e.index === 1;
  };

  handleKeyup(event) {
    switch (event.key) {
      case 'ArrowUp': {
        this.skip = Math.max(0, this.skip - 1);
        if (this.filterText) {
          this.applyFilter(this.filterText);
        } else {
          this.loadItems();
        }
        this.mySelection = [this.gridView.data[0].ProductID];
        break;
      }

      case 'ArrowDown': {
        if (this.gridView.data.length === 1) {
          return;
        }
        this.skip++;
        if (this.filterText) {
          this.applyFilter(this.filterText);
        } else {
          this.loadItems();
        }
        this.mySelection = [this.gridView.data[0].ProductID];
        break;
      }

      case 'Enter': {
        if (this.gridView.data[0]) {
          this.selectedItem = this.gridView.data[0];
        }
        break;
      }

      case 'ArrowLeft':
        break;
      case 'ArrowRight':
        break;

      default: {
        this.applyFilter(this.filterText);
        break;
      }
    }
  }

  public applyFilter(val): void {
    const filter: FilterDescriptor = {
      operator: 'contains',
      value: val,
      field: 'ProductName',
    };

    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length,
    };

    this.gridView.data = filterBy(sampleProducts, filter);
    this.gridView.data = this.gridView.data.slice(
      this.skip,
      this.skip + this.pageSize
    );
  }
}
