import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { BigCatProductPrice, ProductPricingService } from '@services/api-v2/product-pricing/product-pricing.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { takeUntil } from 'rxjs/operators';

/** Product Pricing page. */
@Component({
  templateUrl: './product-pricing.component.html',
  styleUrls: ['./product-pricing.component.scss'],
})
export class ProductPricingComponent extends BaseComponent implements OnInit{
  public products: Map<string, string>;
  public productPrices = new BetterMatTableDataSource<BigCatProductPrice>([]);

  public getProductsMoniter: ActionMonitor = new ActionMonitor('GET Product IDs');
  public getProductPriceMonitor: ActionMonitor = new ActionMonitor('GET Product Price');

  public columnsToDisplay = ['currencyCode', 'listPrice', 'msrp', 'wholesalePrice'];
  
  public formControls = {
    productId: new FormControl(null, [Validators.required]),
  };
  public formGroup = new FormGroup(this.formControls);


  constructor(readonly priceService: ProductPricingService) {
    super();
  }

  /** Angular Hook */
  ngOnInit(): void {
    this.getProductsMoniter = this.getProductsMoniter.repeat();

    this.priceService.getProductIds$()
      .pipe(this.getProductsMoniter.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(productMap => {
        this.products = productMap;
      })
  }

  /** Lookup product price catalog and fill in table */
  productSelectionChanged(event: MatOptionSelectionChange) {
    if (!event.isUserInput) {
      return;
    }

    const productId = event.source.value;

    this.getProductPriceMonitor = this.getProductPriceMonitor.repeat();
    this.priceService.getPricingByProductId$(productId)
      .pipe(this.getProductPriceMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(priceCatalog => {
        this.productPrices.data = priceCatalog;
      })
  }
}
