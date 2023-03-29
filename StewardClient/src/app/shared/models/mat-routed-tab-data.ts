/** Used to build routable mat tabs */
export interface MatRoutedTabData {
  name: string;
  path: string;

  /** Hides the routed tab option. This will need to be implemented on HTML files that utilize MatRoutedTabData. */
  hide?: boolean;
}
