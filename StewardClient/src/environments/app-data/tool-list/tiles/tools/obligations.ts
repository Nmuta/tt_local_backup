import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import {
  HomeTileInfoInternal,
  AppIcon,
  NavbarTool,
  CommonAccessLevels,
  HomeTileRestrictionType,
} from '../../helpers';

export const obligationsTile = <HomeTileInfoInternal>{
  icon: AppIcon.DeveloperTool,
  tool: NavbarTool.DataObligation,
  oldToolRoutes: ['data-pipeline-obligation'],
  accessList: CommonAccessLevels.DataPipelineAppOnly,
  title: 'Obligation',
  subtitle: 'A data pipeline tool',
  supportedTitles: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Configure Data Activity processing',
  shortDescription: [`Configure Data Activity processing`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/obligation/obligation.module').then(
      m => m.DataPipelineObligationModule,
    ),
  hideFromUnauthorized: true,
  restriction: {
    requiredPermissions: [PermAttributeName.UpdateObligationPipeline],
    action: HomeTileRestrictionType.Disable,
  },
};
