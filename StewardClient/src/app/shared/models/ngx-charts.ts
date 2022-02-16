/** Top level results for NGX line chart. */
export interface NgxLineChartResults {
  name: string;
  series: NgxLineChartSeries[];
}

/** Single series of NGX line chart data points. */
export interface NgxLineChartSeries {
  name: string;
  value: number;
}

/** NGX line chart click event. */
export interface NgxLineChartClickEvent {
  series: string;
  name: string;
  value: number;
}

/**
 * Theme colors for standard deviation thresholds: red, orange, yellow, green.
 * Order is applied to series order.
 */
export const LINE_CHART_SD_THRESHOLD_COLORS: string[] = [
  '#fb4646', // Red
  '#fb9540', // Orange
  '#ffe254', // Yellow
  '#5cab3c', // Green
  '#ffe254', // Yellow
  '#fb9540', // Orange
  '#fb4646', // Red
];
