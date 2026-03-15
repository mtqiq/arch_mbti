import { architectVisuals } from "@/data/illustrationData";

interface Props {
  name: string;
  size?: number;
  bgColor?: string;
}

export default function ArchitectPortrait({ name, size = 160, bgColor = "#6C5CE7" }: Props) {
  const visuals = architectVisuals[name];
  if (!visuals) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-primary/20 flex items-center justify-center text-4xl"
      >
        🏗️
      </div>
    );
  }

  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const headR = s * 0.16;
  const bodyY = cy + headR * 0.7;
  const skinColor = "#F5CBA7";
  const { gender, hairStyle, glasses, hairColor, outfitColor } = visuals;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={s * 0.48} fill={bgColor} opacity="0.15" />
      <circle cx={cx} cy={cy} r={s * 0.42} fill={bgColor} opacity="0.08" />

      {/* Body / shoulders */}
      <ellipse cx={cx} cy={bodyY + headR * 1.5} rx={headR * 1.8} ry={headR * 1.3} fill={outfitColor} />
      {/* Collar / neck */}
      <rect x={cx - headR * 0.25} y={bodyY - headR * 0.15} width={headR * 0.5} height={headR * 0.6} rx={2} fill={skinColor} />

      {/* Head */}
      <circle cx={cx} cy={cy - headR * 0.1} r={headR} fill={skinColor} />

      {/* Hair */}
      {renderHair(cx, cy - headR * 0.1, headR, hairStyle, hairColor, gender)}

      {/* Eyes */}
      <circle cx={cx - headR * 0.3} cy={cy - headR * 0.15} r={headR * 0.08} fill="#2D3436" />
      <circle cx={cx + headR * 0.3} cy={cy - headR * 0.15} r={headR * 0.08} fill="#2D3436" />
      {/* Eye highlights */}
      <circle cx={cx - headR * 0.27} cy={cy - headR * 0.18} r={headR * 0.03} fill="white" />
      <circle cx={cx + headR * 0.33} cy={cy - headR * 0.18} r={headR * 0.03} fill="white" />

      {/* Mouth - subtle smile */}
      <path
        d={`M ${cx - headR * 0.15} ${cy + headR * 0.2} Q ${cx} ${cy + headR * 0.35} ${cx + headR * 0.15} ${cy + headR * 0.2}`}
        stroke="#C0A080"
        strokeWidth={headR * 0.04}
        fill="none"
        strokeLinecap="round"
      />

      {/* Glasses */}
      {glasses && (
        <>
          <circle cx={cx - headR * 0.3} cy={cy - headR * 0.12} r={headR * 0.2} stroke="#555" strokeWidth={headR * 0.04} fill="none" />
          <circle cx={cx + headR * 0.3} cy={cy - headR * 0.12} r={headR * 0.2} stroke="#555" strokeWidth={headR * 0.04} fill="none" />
          <line x1={cx - headR * 0.1} y1={cy - headR * 0.12} x2={cx + headR * 0.1} y2={cy - headR * 0.12} stroke="#555" strokeWidth={headR * 0.03} />
          <line x1={cx - headR * 0.5} y1={cy - headR * 0.15} x2={cx - headR * 0.6} y2={cy - headR * 0.2} stroke="#555" strokeWidth={headR * 0.03} />
          <line x1={cx + headR * 0.5} y1={cy - headR * 0.15} x2={cx + headR * 0.6} y2={cy - headR * 0.2} stroke="#555" strokeWidth={headR * 0.03} />
        </>
      )}

      {/* Blush marks for female characters */}
      {gender === "female" && (
        <>
          <ellipse cx={cx - headR * 0.45} cy={cy + headR * 0.05} rx={headR * 0.1} ry={headR * 0.06} fill="#FFB8B8" opacity="0.5" />
          <ellipse cx={cx + headR * 0.45} cy={cy + headR * 0.05} rx={headR * 0.1} ry={headR * 0.06} fill="#FFB8B8" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

function renderHair(
  cx: number,
  cy: number,
  r: number,
  style: string,
  color: string,
  gender: string
) {
  switch (style) {
    case "short":
      return (
        <>
          <path
            d={`M ${cx - r * 0.9} ${cy - r * 0.3} Q ${cx - r * 0.95} ${cy - r * 1.1} ${cx} ${cy - r * 1.15} Q ${cx + r * 0.95} ${cy - r * 1.1} ${cx + r * 0.9} ${cy - r * 0.3}`}
            fill={color}
          />
        </>
      );
    case "swept":
      return (
        <>
          <path
            d={`M ${cx - r * 0.85} ${cy - r * 0.2} Q ${cx - r * 0.9} ${cy - r * 1.2} ${cx + r * 0.3} ${cy - r * 1.2} Q ${cx + r * 1.1} ${cy - r * 1.1} ${cx + r * 0.95} ${cy - r * 0.15}`}
            fill={color}
          />
          <path
            d={`M ${cx - r * 0.85} ${cy - r * 0.2} Q ${cx - r * 1.0} ${cy - r * 0.8} ${cx - r * 0.6} ${cy - r * 1.05} Q ${cx - r * 0.2} ${cy - r * 1.2} ${cx + r * 0.3} ${cy - r * 1.2}`}
            fill={color}
            opacity="0.8"
          />
        </>
      );
    case "long":
      return (
        <>
          <path
            d={`M ${cx - r * 0.9} ${cy - r * 0.2} Q ${cx - r * 0.95} ${cy - r * 1.1} ${cx} ${cy - r * 1.15} Q ${cx + r * 0.95} ${cy - r * 1.1} ${cx + r * 0.9} ${cy - r * 0.2}`}
            fill={color}
          />
          {/* Long side hair */}
          <path
            d={`M ${cx - r * 0.9} ${cy - r * 0.2} Q ${cx - r * 1.1} ${cy + r * 0.2} ${cx - r * 1.05} ${cy + r * 1.0} Q ${cx - r * 0.95} ${cy + r * 1.3} ${cx - r * 0.7} ${cy + r * 1.4}`}
            fill={color}
          />
          <path
            d={`M ${cx + r * 0.9} ${cy - r * 0.2} Q ${cx + r * 1.1} ${cy + r * 0.2} ${cx + r * 1.05} ${cy + r * 1.0} Q ${cx + r * 0.95} ${cy + r * 1.3} ${cx + r * 0.7} ${cy + r * 1.4}`}
            fill={color}
          />
        </>
      );
    case "bald":
      return (
        <path
          d={`M ${cx - r * 0.7} ${cy - r * 0.5} Q ${cx - r * 0.6} ${cy - r * 1.0} ${cx} ${cy - r * 1.05} Q ${cx + r * 0.6} ${cy - r * 1.0} ${cx + r * 0.7} ${cy - r * 0.5}`}
          fill={color}
          opacity="0.3"
        />
      );
    case "bob":
      return (
        <>
          <path
            d={`M ${cx - r * 0.95} ${cy - r * 0.1} Q ${cx - r * 1.0} ${cy - r * 1.1} ${cx} ${cy - r * 1.15} Q ${cx + r * 1.0} ${cy - r * 1.1} ${cx + r * 0.95} ${cy - r * 0.1}`}
            fill={color}
          />
          {/* Bob sides */}
          <rect x={cx - r * 1.05} y={cy - r * 0.2} width={r * 0.35} height={r * 0.9} rx={r * 0.1} fill={color} />
          <rect x={cx + r * 0.7} y={cy - r * 0.2} width={r * 0.35} height={r * 0.9} rx={r * 0.1} fill={color} />
        </>
      );
    case "curly":
      return (
        <>
          {/* Curly mass */}
          <circle cx={cx - r * 0.5} cy={cy - r * 0.8} r={r * 0.35} fill={color} />
          <circle cx={cx} cy={cy - r * 0.95} r={r * 0.35} fill={color} />
          <circle cx={cx + r * 0.5} cy={cy - r * 0.8} r={r * 0.35} fill={color} />
          <circle cx={cx - r * 0.75} cy={cy - r * 0.5} r={r * 0.3} fill={color} />
          <circle cx={cx + r * 0.75} cy={cy - r * 0.5} r={r * 0.3} fill={color} />
          {gender === "male" && (
            <>
              <circle cx={cx - r * 0.85} cy={cy - r * 0.15} r={r * 0.22} fill={color} />
              <circle cx={cx + r * 0.85} cy={cy - r * 0.15} r={r * 0.22} fill={color} />
            </>
          )}
        </>
      );
    case "spiky":
      return (
        <>
          <polygon points={`${cx - r * 0.6},${cy - r * 0.6} ${cx - r * 0.3},${cy - r * 1.3} ${cx},${cy - r * 0.7}`} fill={color} />
          <polygon points={`${cx - r * 0.2},${cy - r * 0.7} ${cx + r * 0.1},${cy - r * 1.4} ${cx + r * 0.4},${cy - r * 0.7}`} fill={color} />
          <polygon points={`${cx + r * 0.2},${cy - r * 0.6} ${cx + r * 0.6},${cy - r * 1.2} ${cx + r * 0.8},${cy - r * 0.5}`} fill={color} />
          <path
            d={`M ${cx - r * 0.8} ${cy - r * 0.3} Q ${cx - r * 0.8} ${cy - r * 0.9} ${cx} ${cy - r * 0.95} Q ${cx + r * 0.8} ${cy - r * 0.9} ${cx + r * 0.8} ${cy - r * 0.3}`}
            fill={color}
          />
        </>
      );
    case "parted":
    default:
      return (
        <>
          <path
            d={`M ${cx - r * 0.9} ${cy - r * 0.3} Q ${cx - r * 0.95} ${cy - r * 1.1} ${cx - r * 0.2} ${cy - r * 1.15} Q ${cx + r * 0.4} ${cy - r * 1.2} ${cx + r * 0.9} ${cy - r * 1.0} Q ${cx + r * 0.95} ${cy - r * 0.7} ${cx + r * 0.9} ${cy - r * 0.3}`}
            fill={color}
          />
          {/* Part line */}
          <line
            x1={cx - r * 0.2} y1={cy - r * 1.1}
            x2={cx - r * 0.15} y2={cy - r * 0.6}
            stroke={color} strokeWidth={r * 0.03} opacity="0.3"
          />
        </>
      );
  }
}
