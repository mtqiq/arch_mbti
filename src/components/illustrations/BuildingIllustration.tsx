interface Props {
  architectName: string;
  size?: number;
  color?: string;
}

export default function BuildingIllustration({ architectName, size = 140, color = "#6C5CE7" }: Props) {
  const s = size;
  const ground = s * 0.88;
  const lightColor = color + "40";
  const midColor = color + "80";

  const building = buildings[architectName];
  if (!building) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x={s * 0.25} y={s * 0.3} width={s * 0.5} height={s * 0.58} rx={4} fill={lightColor} stroke={color} strokeWidth={1.5} />
        <line x1={s * 0.1} y1={ground} x2={s * 0.9} y2={ground} stroke={color} strokeWidth={2} />
      </svg>
    );
  }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {building(s, color, lightColor, midColor, ground)}
      {/* Ground line */}
      <line x1={s * 0.05} y1={ground} x2={s * 0.95} y2={ground} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

type BuildingRenderer = (s: number, c: string, lc: string, mc: string, g: number) => React.ReactNode;

const buildings: Record<string, BuildingRenderer> = {
  // 丹下健三 - 代々木体育館 (swooping curved roof)
  "丹下健三": (s, c, lc, mc, g) => (
    <>
      <path d={`M ${s*0.15} ${g} Q ${s*0.15} ${s*0.4} ${s*0.5} ${s*0.2} Q ${s*0.85} ${s*0.4} ${s*0.85} ${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      <path d={`M ${s*0.5} ${s*0.2} L ${s*0.5} ${s*0.08}`} stroke={c} strokeWidth={2} />
      <path d={`M ${s*0.3} ${s*0.55} Q ${s*0.5} ${s*0.45} ${s*0.7} ${s*0.55}`} stroke={mc} strokeWidth={1} />
    </>
  ),

  // 前川國男 - 東京文化会館 (angular modernist)
  "前川國男": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.15} y={s*0.35} width={s*0.7} height={s*0.53} fill={lc} stroke={c} strokeWidth={1.5} />
      <path d={`M ${s*0.1} ${s*0.35} L ${s*0.9} ${s*0.35}`} stroke={c} strokeWidth={2} />
      <path d={`M ${s*0.1} ${s*0.28} L ${s*0.5} ${s*0.2} L ${s*0.9} ${s*0.28}`} stroke={c} strokeWidth={1.5} fill={lc} />
      {[0.25, 0.4, 0.55, 0.7].map(x => <rect key={x} x={s*x} y={s*0.45} width={s*0.08} height={s*0.35} fill={mc} rx={1} />)}
    </>
  ),

  // 藤本壮介 - House NA (transparent glass box stack)
  "藤本壮介": (s, c, lc, _mc, g) => (
    <>
      {[
        { x: 0.3, y: 0.6, w: 0.4, h: 0.28 },
        { x: 0.35, y: 0.38, w: 0.35, h: 0.25 },
        { x: 0.25, y: 0.2, w: 0.3, h: 0.22 },
      ].map((b, i) => (
        <rect key={i} x={s*b.x} y={s*b.y} width={s*b.w} height={s*b.h} fill={lc} stroke={c} strokeWidth={1} rx={1} />
      ))}
      {/* Thin columns */}
      {[0.35, 0.5, 0.62].map(x => <line key={x} x1={s*x} y1={s*0.2} x2={s*x} y2={g} stroke={c} strokeWidth={0.8} />)}
    </>
  ),

  // 永山祐子 - ドバイ万博日本館 (origami fold)
  "永山祐子": (s, c, lc, mc, g) => (
    <>
      <polygon points={`${s*0.2},${g} ${s*0.35},${s*0.25} ${s*0.5},${s*0.5} ${s*0.65},${s*0.2} ${s*0.8},${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      <line x1={s*0.35} y1={s*0.25} x2={s*0.5} y2={s*0.5} stroke={mc} strokeWidth={1} />
      <line x1={s*0.65} y1={s*0.2} x2={s*0.5} y2={s*0.5} stroke={mc} strokeWidth={1} />
    </>
  ),

  // 山本理顕 - 横須賀美術館 (half buried circles)
  "山本理顕": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.15} y={s*0.45} width={s*0.7} height={s*0.43} fill={lc} stroke={c} strokeWidth={1.5} rx={4} />
      {[0.3, 0.5, 0.7].map(x => <circle key={x} cx={s*x} cy={s*0.45} r={s*0.1} fill="white" stroke={c} strokeWidth={1.5} />)}
      <rect x={s*0.15} y={s*0.55} width={s*0.7} height={s*0.33} fill={lc} stroke={c} strokeWidth={0} />
      <line x1={s*0.15} y1={s*0.45} x2={s*0.85} y2={s*0.45} stroke={c} strokeWidth={1.5} />
      <rect x={s*0.15} y={s*0.55} width={s*0.7} height={s*0.33} fill="none" stroke={c} strokeWidth={0} />
      {[0.3, 0.5, 0.7].map(x => <circle key={x} cx={s*x} cy={s*0.45} r={s*0.04} fill={mc} />)}
    </>
  ),

  // 手塚貴晴＋手塚由比 - ふじようちえん (oval ring building)
  "手塚貴晴＋手塚由比": (s, c, lc, _mc, g) => (
    <>
      <ellipse cx={s*0.5} cy={s*0.55} rx={s*0.38} ry={s*0.22} fill="none" stroke={c} strokeWidth={s*0.06} opacity={0.2} />
      <ellipse cx={s*0.5} cy={s*0.55} rx={s*0.38} ry={s*0.22} fill="none" stroke={c} strokeWidth={1.5} />
      <ellipse cx={s*0.5} cy={s*0.55} rx={s*0.28} ry={s*0.14} fill={lc} stroke={c} strokeWidth={1} strokeDasharray="3 2" />
      {/* Tree in center */}
      <circle cx={s*0.5} cy={s*0.48} r={s*0.06} fill="#00B894" opacity={0.5} />
      <line x1={s*0.5} y1={s*0.54} x2={s*0.5} y2={s*0.6} stroke="#00B894" strokeWidth={1.5} />
    </>
  ),

  // 隈研吾 - 国立競技場 (layered wood eaves)
  "隈研吾": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.15} y={s*0.4} width={s*0.7} height={s*0.48} fill={lc} stroke={c} strokeWidth={1.5} rx={s*0.06} />
      {[0.35, 0.45, 0.55, 0.65, 0.75].map((y, i) => (
        <line key={i} x1={s*0.1} y1={s*y} x2={s*0.9} y2={s*y} stroke={mc} strokeWidth={1.5} strokeLinecap="round" />
      ))}
      <ellipse cx={s*0.5} cy={s*0.4} rx={s*0.38} ry={s*0.08} fill={lc} stroke={c} strokeWidth={1.5} />
    </>
  ),

  // 坂茂 - 紙の教会 (paper tube structure)
  "坂茂": (s, c, lc, mc, g) => (
    <>
      {/* Paper tube columns in oval */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const x = s * 0.5 + Math.cos(angle) * s * 0.25;
        const y1 = s * 0.35 + Math.sin(angle) * s * 0.08;
        return <line key={i} x1={x} y1={y1} x2={x} y2={g} stroke={c} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />;
      })}
      {/* Roof curve */}
      <path d={`M ${s*0.15} ${s*0.4} Q ${s*0.5} ${s*0.15} ${s*0.85} ${s*0.4}`} stroke={c} strokeWidth={1.5} fill={lc} />
      <line x1={s*0.5} y1={s*0.23} x2={s*0.5} y2={s*0.12} stroke={c} strokeWidth={1.5} />
    </>
  ),

  // 黒川紀章 - 中銀カプセルタワー (stacked capsules)
  "黒川紀章": (s, c, lc, mc, g) => (
    <>
      {/* Central shaft */}
      <rect x={s*0.42} y={s*0.15} width={s*0.16} height={s*0.73} fill={mc} rx={2} />
      {/* Capsule modules */}
      {[
        { x: 0.22, y: 0.25 }, { x: 0.62, y: 0.2 },
        { x: 0.2, y: 0.45 }, { x: 0.6, y: 0.4 },
        { x: 0.22, y: 0.65 }, { x: 0.62, y: 0.6 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={s*p.x} y={s*p.y} width={s*0.2} height={s*0.16} rx={s*0.02} fill={lc} stroke={c} strokeWidth={1.2} />
          <circle cx={s*p.x + s*0.1} cy={s*p.y + s*0.08} r={s*0.04} fill="none" stroke={mc} strokeWidth={1} />
        </g>
      ))}
    </>
  ),

  // 磯崎新 - 北九州市立美術館 (twin barrel vaults)
  "磯崎新": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.15} y={s*0.5} width={s*0.7} height={s*0.38} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Twin barrel vaults protruding */}
      <path d={`M ${s*0.2} ${s*0.5} L ${s*0.2} ${s*0.25} Q ${s*0.3} ${s*0.15} ${s*0.4} ${s*0.25} L ${s*0.4} ${s*0.5}`} fill={lc} stroke={c} strokeWidth={1.5} />
      <path d={`M ${s*0.6} ${s*0.5} L ${s*0.6} ${s*0.25} Q ${s*0.7} ${s*0.15} ${s*0.8} ${s*0.25} L ${s*0.8} ${s*0.5}`} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Windows */}
      <rect x={s*0.25} y={s*0.28} width={s*0.1} height={s*0.15} fill={mc} rx={1} />
      <rect x={s*0.65} y={s*0.28} width={s*0.1} height={s*0.15} fill={mc} rx={1} />
    </>
  ),

  // 伊東豊雄 - せんだいメディアテーク (transparent layers with tubes)
  "伊東豊雄": (s, c, lc, mc, g) => (
    <>
      {/* Floor plates */}
      {[0.25, 0.4, 0.55, 0.7].map(y => (
        <rect key={y} x={s*0.18} y={s*y} width={s*0.64} height={s*0.03} fill={mc} rx={1} />
      ))}
      {/* Wavy tube columns */}
      {[0.3, 0.5, 0.7].map(x => (
        <path key={x} d={`M ${s*x} ${s*0.25} Q ${s*(x+0.05)} ${s*0.35} ${s*(x-0.03)} ${s*0.45} Q ${s*(x+0.04)} ${s*0.55} ${s*(x-0.02)} ${s*0.65} L ${s*x} ${s*0.73}`} stroke={c} strokeWidth={2} fill="none" />
      ))}
      {/* Glass facade */}
      <rect x={s*0.18} y={s*0.25} width={s*0.64} height={s*0.48} fill={lc} stroke={c} strokeWidth={1.5} rx={2} />
      {/* Re-draw tubes on top */}
      {[0.3, 0.5, 0.7].map(x => (
        <path key={x} d={`M ${s*x} ${s*0.25} Q ${s*(x+0.05)} ${s*0.35} ${s*(x-0.03)} ${s*0.45} Q ${s*(x+0.04)} ${s*0.55} ${s*(x-0.02)} ${s*0.65} L ${s*x} ${s*0.73}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.6} />
      ))}
    </>
  ),

  // 石上純也 - KAIT工房 (delicate columns, transparent)
  "石上純也": (s, c, _lc, _mc, g) => (
    <>
      <rect x={s*0.12} y={s*0.3} width={s*0.76} height={s*0.58} fill="white" fillOpacity={0.3} stroke={c} strokeWidth={1} rx={1} />
      {/* Many thin random columns */}
      {[0.18, 0.24, 0.32, 0.38, 0.45, 0.52, 0.58, 0.65, 0.72, 0.78, 0.82].map(x => (
        <line key={x} x1={s*x} y1={s*0.3} x2={s*x} y2={g} stroke={c} strokeWidth={0.7} opacity={0.4} />
      ))}
      <line x1={s*0.12} y1={s*0.3} x2={s*0.88} y2={s*0.3} stroke={c} strokeWidth={1.5} />
    </>
  ),

  // 安藤忠雄 - 光の教会 (concrete box with cross of light)
  "安藤忠雄": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.2} y={s*0.25} width={s*0.6} height={s*0.63} fill={mc} stroke={c} strokeWidth={1.5} />
      {/* Cross of light */}
      <rect x={s*0.45} y={s*0.3} width={s*0.1} height={s*0.5} fill="#FFF9C4" />
      <rect x={s*0.28} y={s*0.45} width={s*0.44} height={s*0.08} fill="#FFF9C4" />
      {/* Cross lines */}
      <line x1={s*0.45} y1={s*0.3} x2={s*0.45} y2={s*0.8} stroke={c} strokeWidth={0.5} />
      <line x1={s*0.55} y1={s*0.3} x2={s*0.55} y2={s*0.8} stroke={c} strokeWidth={0.5} />
      <line x1={s*0.28} y1={s*0.45} x2={s*0.72} y2={s*0.45} stroke={c} strokeWidth={0.5} />
      <line x1={s*0.28} y1={s*0.53} x2={s*0.72} y2={s*0.53} stroke={c} strokeWidth={0.5} />
    </>
  ),

  // 槇文彦 - スパイラル (spiral facade)
  "槇文彦": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.2} y={s*0.25} width={s*0.35} height={s*0.63} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Cone/spiral element */}
      <path d={`M ${s*0.55} ${s*0.25} L ${s*0.8} ${s*0.25} L ${s*0.8} ${g} L ${s*0.55} ${g} Z`} fill={lc} stroke={c} strokeWidth={1.5} />
      <path d={`M ${s*0.58} ${s*0.25} Q ${s*0.75} ${s*0.35} ${s*0.62} ${s*0.5} Q ${s*0.72} ${s*0.65} ${s*0.6} ${s*0.78}`} stroke={mc} strokeWidth={1.5} fill="none" />
      {/* Windows grid */}
      {[0.35, 0.5, 0.65].map(y => [0.28, 0.38, 0.48].map(x => (
        <rect key={`${x}${y}`} x={s*x} y={s*y} width={s*0.06} height={s*0.08} fill={mc} rx={1} />
      )))}
    </>
  ),

  // 妹島和世 - 金沢21世紀美術館 (perfect circle)
  "妹島和世": (s, c, lc, mc, _g) => (
    <>
      <circle cx={s*0.5} cy={s*0.55} r={s*0.32} fill={lc} stroke={c} strokeWidth={1.5} />
      <circle cx={s*0.5} cy={s*0.55} r={s*0.28} fill="white" fillOpacity={0.5} stroke={c} strokeWidth={0.8} strokeDasharray="4 3" />
      {/* Inner rooms */}
      <rect x={s*0.38} y={s*0.42} width={s*0.1} height={s*0.1} fill={mc} rx={1} opacity={0.5} />
      <rect x={s*0.52} y={s*0.48} width={s*0.12} height={s*0.08} fill={mc} rx={1} opacity={0.5} />
      <rect x={s*0.42} y={s*0.58} width={s*0.08} height={s*0.12} fill={mc} rx={1} opacity={0.5} />
    </>
  ),

  // 藤森照信 - たんぽぽの家 (house with plants growing)
  "藤森照信": (s, c, lc, _mc, g) => (
    <>
      {/* Simple house shape */}
      <path d={`M ${s*0.25} ${s*0.45} L ${s*0.5} ${s*0.22} L ${s*0.75} ${s*0.45} Z`} fill="#8D6E63" stroke={c} strokeWidth={1.5} />
      <rect x={s*0.28} y={s*0.45} width={s*0.44} height={s*0.43} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Plants on roof */}
      <circle cx={s*0.4} cy={s*0.28} r={s*0.04} fill="#00B894" opacity={0.7} />
      <circle cx={s*0.5} cy={s*0.22} r={s*0.05} fill="#00B894" opacity={0.7} />
      <circle cx={s*0.6} cy={s*0.3} r={s*0.04} fill="#00B894" opacity={0.7} />
      <circle cx={s*0.45} cy={s*0.25} r={s*0.03} fill="#00B894" opacity={0.5} />
      {/* Door */}
      <rect x={s*0.44} y={s*0.62} width={s*0.12} height={s*0.26} fill="#8D6E63" rx={s*0.06} />
    </>
  ),

  // 谷口吉生 - 法隆寺宝物館 (minimal glass box with water)
  "谷口吉生": (s, c, lc, mc, g) => (
    <>
      {/* Water surface */}
      <rect x={s*0.1} y={s*0.72} width={s*0.8} height={s*0.16} fill={c} opacity={0.1} rx={1} />
      {/* Building */}
      <rect x={s*0.25} y={s*0.3} width={s*0.5} height={s*0.45} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Glass wall */}
      <rect x={s*0.25} y={s*0.38} width={s*0.5} height={s*0.3} fill={mc} opacity={0.3} />
      {/* Overhang roof */}
      <line x1={s*0.18} y1={s*0.3} x2={s*0.82} y2={s*0.3} stroke={c} strokeWidth={2.5} />
      {/* Columns */}
      {[0.32, 0.68].map(x => <line key={x} x1={s*x} y1={s*0.3} x2={s*x} y2={s*0.75} stroke={c} strokeWidth={1.5} />)}
    </>
  ),

  // 内藤廣 - 海の博物館 (barrel vault roofs)
  "内藤廣": (s, c, lc, mc, g) => (
    <>
      {/* Multiple barrel vaults */}
      {[0.2, 0.42, 0.64].map(x => (
        <path key={x} d={`M ${s*x} ${g} L ${s*x} ${s*0.45} Q ${s*(x+0.1)} ${s*0.28} ${s*(x+0.2)} ${s*0.45} L ${s*(x+0.2)} ${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      ))}
      {/* Horizontal tie */}
      <line x1={s*0.2} y1={s*0.55} x2={s*0.84} y2={s*0.55} stroke={mc} strokeWidth={1} />
    </>
  ),

  // 中村拓志 - リボンチャペル (spiral ribbon)
  "中村拓志": (s, c, lc, mc, g) => (
    <>
      {/* Two intertwining spiral paths */}
      <path d={`M ${s*0.35} ${g} Q ${s*0.25} ${s*0.6} ${s*0.4} ${s*0.45} Q ${s*0.55} ${s*0.3} ${s*0.5} ${s*0.2} Q ${s*0.45} ${s*0.12} ${s*0.5} ${s*0.08}`} stroke={c} strokeWidth={3} fill="none" opacity={0.7} />
      <path d={`M ${s*0.65} ${g} Q ${s*0.75} ${s*0.6} ${s*0.6} ${s*0.45} Q ${s*0.45} ${s*0.3} ${s*0.5} ${s*0.2} Q ${s*0.55} ${s*0.12} ${s*0.5} ${s*0.08}`} stroke={mc} strokeWidth={3} fill="none" opacity={0.5} />
    </>
  ),

  // 堀部安嗣 - 竹林寺納骨堂 (simple horizontal lines in landscape)
  "堀部安嗣": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.15} y={s*0.5} width={s*0.7} height={s*0.2} fill={lc} stroke={c} strokeWidth={1.5} />
      <line x1={s*0.1} y1={s*0.5} x2={s*0.9} y2={s*0.5} stroke={c} strokeWidth={2} />
      <line x1={s*0.12} y1={s*0.7} x2={s*0.88} y2={s*0.7} stroke={c} strokeWidth={1.5} />
      {/* Trees */}
      {[0.15, 0.25, 0.78, 0.85].map(x => (
        <g key={x}>
          <line x1={s*x} y1={s*0.3} x2={s*x} y2={s*0.5} stroke="#00B894" strokeWidth={1} opacity={0.5} />
          <circle cx={s*x} cy={s*0.28} r={s*0.04} fill="#00B894" opacity={0.3} />
        </g>
      ))}
    </>
  ),

  // 吉村順三 - 軽井沢の山荘 (stilted mountain cabin)
  "吉村順三": (s, c, lc, mc, g) => (
    <>
      {/* Stilts */}
      {[0.3, 0.5, 0.7].map(x => <line key={x} x1={s*x} y1={s*0.5} x2={s*x} y2={g} stroke={c} strokeWidth={2} />)}
      {/* Cabin body */}
      <rect x={s*0.22} y={s*0.35} width={s*0.56} height={s*0.18} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Pitched roof */}
      <path d={`M ${s*0.18} ${s*0.35} L ${s*0.5} ${s*0.2} L ${s*0.82} ${s*0.35} Z`} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Window */}
      <rect x={s*0.35} y={s*0.38} width={s*0.3} height={s*0.1} fill={mc} rx={1} opacity={0.5} />
    </>
  ),

  // 篠原一男 - 白の家 (geometric white house)
  "篠原一男": (s, c, lc, _mc, g) => (
    <>
      <rect x={s*0.25} y={s*0.42} width={s*0.5} height={s*0.46} fill="white" stroke={c} strokeWidth={1.5} />
      <path d={`M ${s*0.2} ${s*0.42} L ${s*0.5} ${s*0.2} L ${s*0.8} ${s*0.42} Z`} fill="white" stroke={c} strokeWidth={1.5} />
      {/* Central symbolic element */}
      <line x1={s*0.5} y1={s*0.42} x2={s*0.5} y2={s*0.75} stroke={c} strokeWidth={1} opacity={0.3} />
      <rect x={s*0.42} y={s*0.55} width={s*0.16} height={s*0.2} fill="none" stroke={c} strokeWidth={1} />
    </>
  ),

  // 西沢立衛 - 豊島美術館 (organic shell on landscape)
  "西沢立衛": (s, c, lc, _mc, g) => (
    <>
      {/* Organic dome shape */}
      <path d={`M ${s*0.15} ${g} Q ${s*0.2} ${s*0.35} ${s*0.5} ${s*0.3} Q ${s*0.8} ${s*0.35} ${s*0.85} ${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Opening */}
      <ellipse cx={s*0.6} cy={s*0.45} rx={s*0.06} ry={s*0.04} fill="white" stroke={c} strokeWidth={0.8} />
      {/* Water drop inside */}
      <circle cx={s*0.45} cy={s*0.7} r={s*0.02} fill={c} opacity={0.3} />
      <circle cx={s*0.5} cy={s*0.72} r={s*0.015} fill={c} opacity={0.2} />
    </>
  ),

  // 石山修武 - 幻庵 (wild organic structure)
  "石山修武": (s, c, lc, mc, g) => (
    <>
      <path d={`M ${s*0.2} ${g} Q ${s*0.15} ${s*0.5} ${s*0.3} ${s*0.35} Q ${s*0.45} ${s*0.2} ${s*0.55} ${s*0.25} Q ${s*0.7} ${s*0.3} ${s*0.75} ${s*0.4} Q ${s*0.85} ${s*0.55} ${s*0.8} ${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      <circle cx={s*0.45} cy={s*0.45} r={s*0.08} fill={mc} opacity={0.4} />
      <circle cx={s*0.6} cy={s*0.5} r={s*0.06} fill={mc} opacity={0.3} />
    </>
  ),

  // 原広司 - 京都駅ビル (grand stepped atrium)
  "原広司": (s, c, lc, mc, g) => (
    <>
      {/* Stepped form */}
      <polygon points={`${s*0.1},${g} ${s*0.1},${s*0.4} ${s*0.3},${s*0.35} ${s*0.5},${s*0.2} ${s*0.7},${s*0.25} ${s*0.9},${s*0.3} ${s*0.9},${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Glass atrium */}
      <path d={`M ${s*0.35} ${s*0.35} L ${s*0.5} ${s*0.2} L ${s*0.65} ${s*0.3}`} stroke={mc} strokeWidth={1} fill={mc} opacity={0.3} />
      {/* Grid lines */}
      {[0.45, 0.55, 0.65, 0.75].map(y => (
        <line key={y} x1={s*0.1} y1={s*y} x2={s*0.9} y2={s*y} stroke={c} strokeWidth={0.5} opacity={0.3} />
      ))}
    </>
  ),

  // 青木淳 - 青森県立美術館 (white geometric cuts)
  "青木淳": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.18} y={s*0.3} width={s*0.64} height={s*0.58} fill="white" stroke={c} strokeWidth={1.5} />
      {/* Cut/trench */}
      <rect x={s*0.3} y={s*0.3} width={s*0.15} height={s*0.58} fill={lc} stroke={c} strokeWidth={0.8} />
      <rect x={s*0.55} y={s*0.3} width={s*0.12} height={s*0.35} fill={lc} stroke={c} strokeWidth={0.8} />
      {/* Minimal entrance */}
      <rect x={s*0.44} y={s*0.7} width={s*0.12} height={s*0.18} fill={mc} rx={1} />
    </>
  ),

  // 坂本一成 - House SA (abstract residential composition)
  "坂本一成": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.2} y={s*0.4} width={s*0.3} height={s*0.48} fill={lc} stroke={c} strokeWidth={1.5} />
      <rect x={s*0.45} y={s*0.3} width={s*0.35} height={s*0.58} fill="white" stroke={c} strokeWidth={1.5} />
      {/* Offset roof */}
      <line x1={s*0.15} y1={s*0.4} x2={s*0.55} y2={s*0.4} stroke={c} strokeWidth={2} />
      <line x1={s*0.4} y1={s*0.3} x2={s*0.85} y2={s*0.3} stroke={c} strokeWidth={2} />
      <rect x={s*0.55} y={s*0.45} width={s*0.15} height={s*0.12} fill={mc} rx={1} opacity={0.4} />
    </>
  ),

  // 長谷川逸子 - 湘南台文化センター (sphere/globe building)
  "長谷川逸子": (s, c, lc, mc, _g) => (
    <>
      <circle cx={s*0.5} cy={s*0.45} r={s*0.28} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Grid on sphere */}
      <ellipse cx={s*0.5} cy={s*0.45} rx={s*0.28} ry={s*0.1} fill="none" stroke={mc} strokeWidth={0.8} />
      <ellipse cx={s*0.5} cy={s*0.45} rx={s*0.1} ry={s*0.28} fill="none" stroke={mc} strokeWidth={0.8} />
      {/* Base */}
      <rect x={s*0.3} y={s*0.7} width={s*0.4} height={s*0.15} fill={lc} stroke={c} strokeWidth={1.5} rx={2} />
    </>
  ),

  // 村野藤吾 - 日生劇場 (curved ornamental interior)
  "村野藤吾": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.2} y={s*0.3} width={s*0.6} height={s*0.58} fill={lc} stroke={c} strokeWidth={1.5} rx={s*0.03} />
      {/* Curved ornamental ceiling */}
      <path d={`M ${s*0.2} ${s*0.3} Q ${s*0.35} ${s*0.22} ${s*0.5} ${s*0.3} Q ${s*0.65} ${s*0.22} ${s*0.8} ${s*0.3}`} stroke={mc} strokeWidth={1.5} fill="none" />
      <path d={`M ${s*0.25} ${s*0.35} Q ${s*0.37} ${s*0.28} ${s*0.5} ${s*0.35} Q ${s*0.63} ${s*0.28} ${s*0.75} ${s*0.35}`} stroke={mc} strokeWidth={1} fill="none" opacity={0.5} />
      {/* Arched entrance */}
      <path d={`M ${s*0.38} ${g} L ${s*0.38} ${s*0.65} Q ${s*0.5} ${s*0.55} ${s*0.62} ${s*0.65} L ${s*0.62} ${g}`} fill={mc} opacity={0.4} />
    </>
  ),

  // 竹山聖 - OXY乃木坂 (angular modern)
  "竹山聖": (s, c, lc, mc, g) => (
    <>
      <polygon points={`${s*0.2},${g} ${s*0.25},${s*0.3} ${s*0.75},${s*0.25} ${s*0.8},${g}`} fill={lc} stroke={c} strokeWidth={1.5} />
      <line x1={s*0.25} y1={s*0.3} x2={s*0.75} y2={s*0.25} stroke={c} strokeWidth={2} />
      {/* Angular windows */}
      <polygon points={`${s*0.35},${s*0.45} ${s*0.45},${s*0.42} ${s*0.45},${s*0.6} ${s*0.35},${s*0.62}`} fill={mc} opacity={0.4} />
      <polygon points={`${s*0.55},${s*0.4} ${s*0.65},${s*0.38} ${s*0.65},${s*0.55} ${s*0.55},${s*0.58}`} fill={mc} opacity={0.4} />
    </>
  ),

  // 藤井厚二 - 聴竹居 (traditional Japanese with modern twist)
  "藤井厚二": (s, c, lc, mc, g) => (
    <>
      <rect x={s*0.2} y={s*0.45} width={s*0.6} height={s*0.43} fill={lc} stroke={c} strokeWidth={1.5} />
      {/* Japanese-style roof */}
      <path d={`M ${s*0.12} ${s*0.45} Q ${s*0.2} ${s*0.38} ${s*0.5} ${s*0.28} Q ${s*0.8} ${s*0.38} ${s*0.88} ${s*0.45}`} fill="#8D6E63" stroke={c} strokeWidth={1.5} />
      {/* Engawa / veranda */}
      <rect x={s*0.18} y={s*0.72} width={s*0.64} height={s*0.06} fill={mc} rx={1} opacity={0.3} />
      {/* Shoji grid */}
      {[0.32, 0.44, 0.56, 0.68].map(x => <line key={x} x1={s*x} y1={s*0.48} x2={s*x} y2={s*0.7} stroke={c} strokeWidth={0.5} opacity={0.3} />)}
      <line x1={s*0.22} y1={s*0.58} x2={s*0.78} y2={s*0.58} stroke={c} strokeWidth={0.5} opacity={0.3} />
    </>
  ),

  // 中川エリカ - 桃山ハウス (open, landscape-blending)
  "中川エリカ": (s, c, lc, mc, g) => (
    <>
      {/* Low horizontal house */}
      <rect x={s*0.15} y={s*0.55} width={s*0.7} height={s*0.25} fill={lc} stroke={c} strokeWidth={1.5} rx={2} />
      {/* Flat roof with slight angle */}
      <line x1={s*0.1} y1={s*0.55} x2={s*0.9} y2={s*0.52} stroke={c} strokeWidth={2} />
      {/* Large openings */}
      <rect x={s*0.25} y={s*0.58} width={s*0.2} height={s*0.18} fill={mc} rx={1} opacity={0.3} />
      <rect x={s*0.55} y={s*0.58} width={s*0.22} height={s*0.18} fill={mc} rx={1} opacity={0.3} />
      {/* Landscape elements */}
      {[0.12, 0.88, 0.92].map(x => (
        <g key={x}>
          <circle cx={s*x} cy={s*0.6} r={s*0.05} fill="#00B894" opacity={0.3} />
        </g>
      ))}
    </>
  ),
};
