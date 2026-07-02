/**
 * Smoothed weekly-average weight line with a dashed clay goal line.
 * Pure/presentational RSC. Geometry is computed in canonical lb; the caller
 * passes display-formatted labels separately.
 */
type Props = {
  /** Weekly averages, oldest → newest, in lb. */
  valuesLb: number[];
  goalLb: number;
  goalLabel: string; // e.g. "142"
};

const W = 320;
const H = 120;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

function catmullRomPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let dpath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    dpath += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return dpath;
}

export default function TrendChart({ valuesLb, goalLb, goalLabel }: Props) {
  const values = valuesLb.length ? valuesLb : [goalLb];
  const all = [...values, goalLb];
  let min = Math.min(...all);
  let max = Math.max(...all);
  if (max === min) {
    min -= 1;
    max += 1;
  }
  const chartH = H - PAD_TOP - PAD_BOTTOM;
  const scaleY = (v: number) => PAD_TOP + ((max - v) / (max - min)) * chartH;
  const n = values.length;
  const pts = values.map((v, i) => ({
    x: n === 1 ? W : (i / (n - 1)) * W,
    y: scaleY(v),
  }));
  const goalY = scaleY(goalLb);
  const end = pts[pts.length - 1];

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1={goalY}
        x2={W}
        y2={goalY}
        stroke="#C06B4E"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        opacity="0.55"
      />
      <path
        d={catmullRomPath(pts)}
        fill="none"
        stroke="#33302B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={end.x} cy={end.y} r="5" fill="#33302B" />
      {/* goalLabel is rendered by the caption row below the chart */}
      <title>{`goal ${goalLabel}`}</title>
    </svg>
  );
}
