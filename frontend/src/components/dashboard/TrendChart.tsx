import { CHART_GRID_Y, CHART_WIDTH, type TrendChart as TrendData } from '../../utils/dashboardStats';

export function TrendChart({ trend }: { trend: TrendData }) {
  return (
    <div className="chart-body">
      <svg
        className="chart-svg"
        viewBox={`0 0 ${CHART_WIDTH} 240`}
        role="img"
        aria-label={`Spending and shift income. ${trend.caption}.`}
      >
        {CHART_GRID_Y.map((y) => (
          <line key={y} className="chart-grid" x1="0" y1={y} x2={CHART_WIDTH} y2={y} />
        ))}
        <polygon className="chart-area" points={trend.area} />
        <polyline className="chart-income" points={trend.incomeLine} />
        <polyline className="chart-line" points={trend.spendLine} />
        {trend.points.map((pt, i) => (
          <circle key={i} className="chart-dot" cx={pt.x} cy={pt.y} r="4" />
        ))}
      </svg>
      <div className="chart-labels">
        {trend.labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}
