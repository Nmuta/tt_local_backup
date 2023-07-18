/** Use to produce a named dropdown menu for the given component. */
export const LOAD_EXTERNAL_DROPDOWN_MENU = () =>
  import('../../../../app/shared/modules/nav/external-dropdown/external-dropdown.component').then(
    m => m.ExternalDropdownComponent,
  );
