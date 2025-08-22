// Dashboard Components Export
// Centralized export for all dashboard components

// Existing dashboard components
export { ProjectDashboard } from "./ProjectDashboard";
export { VipInvestorDashboard } from "./VipInvestorDashboard";
export { BannedUserDashboard } from "./BannedUserDashboard";
export { PendingUserDashboard } from "./PendingUserDashboard";
export { RejectedUserDashboard } from "./RejectedUserDashboard";

// New analytics and metrics components
export { MetricsOverview } from './MetricsOverview';
export { PerformanceAnalytics } from './PerformanceAnalytics';

// Types and interfaces
export type { MetricData, MetricsOverviewProps } from './MetricsOverview';
export type { PerformanceData, PerformanceAnalyticsProps } from './PerformanceAnalytics';

// Re-export chart components for convenience
export {
  BaseChart,
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  useChartColors,
  useLineChartData,
  useBarChartData,
  usePieChartData,
  CHART_COLORS,
  CHART_THEMES,
  DEFAULT_CHART_CONFIG
} from '../charts';

export type {
  ChartDataPoint,
  LineChartDataPoint,
  BarChartDataPoint,
  PieChartDataPoint,
  LineConfig,
  BarConfig,
  BaseChartProps,
  LineChartProps,
  BarChartProps,
  PieChartProps
} from '../charts';

// Note: AdminDashboard and InvestorDashboard are imported from existing files
// and don't need to be re-exported here
