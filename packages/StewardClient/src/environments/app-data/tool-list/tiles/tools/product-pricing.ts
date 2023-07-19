import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const productPricingTile = <HomeTileInfoInternal>{
  icon: AppIcon.ProductPricing,
  tool: NavbarTool.ProductPricing,
  title: 'Product Pricing',
  subtitle: 'View price catalog information for various products',
  supportedTitles: [],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View price catalog information.',
  shortDescription: [
    'Tool for comparing price of a product across various markets and currencies.',
  ],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/product-pricing/product-pricing.module').then(
      m => m.ProductPricingModule,
    ),
};
