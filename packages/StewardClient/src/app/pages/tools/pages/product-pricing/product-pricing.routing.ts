import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPricingComponent } from './product-pricing.component';

const routes: Routes = [
  {
    path: '',
    component: ProductPricingComponent,
  },
];

/** Defines the product pricing routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPricingRouterModule {}
