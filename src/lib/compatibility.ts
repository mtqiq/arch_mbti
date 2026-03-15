export interface ParticipantScores {
  axis: string;
  average: number;
}

export interface PairResult {
  indexA: number;
  indexB: number;
  score: number;
}

export interface TeamResult {
  teamScore: number;
  pairs: PairResult[];
  balance: AxisBalance;
}

export interface AxisBalance {
  coverage: number; // 0-100: how well the team covers all 4 axes
  dominant: string; // most represented tendency
  weak: string; // least represented tendency
}

/**
 * 2人の相性スコアを算出（0-100）
 * 各軸のスコア差をベースに、相補性ボーナス・エコーチェンバーペナルティを加味
 */
export function calculatePairScore(
  scoresA: ParticipantScores[],
  scoresB: ParticipantScores[]
): number {
  let total = 0;
  let highDiffCount = 0;
  let lowDiffCount = 0;

  for (let i = 0; i < 4; i++) {
    const diff = Math.abs(scoresA[i].average - scoresB[i].average);

    // diff 0→25, diff 1→~17, diff 2→~9, diff 3→~3, diff 4→0
    const axisScore = 25 * Math.pow(Math.max(0, 1 - diff / 4), 1.5);
    total += axisScore;

    if (diff >= 2.5) highDiffCount++;
    if (diff <= 0.5) lowDiffCount++;
  }

  // 1-2軸が大きく異なる場合は相補性ボーナス
  if (highDiffCount >= 1 && highDiffCount <= 2) {
    total += 5;
  }

  // 全軸がほぼ同じだとエコーチェンバーペナルティ
  if (lowDiffCount >= 4) {
    total -= 8;
  }

  // 全軸が大きく異なると衝突ペナルティ
  if (highDiffCount >= 3) {
    total -= 5;
  }

  return Math.round(Math.max(0, Math.min(100, total)));
}

/**
 * チーム（3-4人）の相性スコアを算出
 * 全ペアの平均60% + 最弱ペア40% + 軸カバレッジボーナス
 */
export function calculateTeamScore(
  allScores: ParticipantScores[][]
): TeamResult {
  const n = allScores.length;
  const pairs: PairResult[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({
        indexA: i,
        indexB: j,
        score: calculatePairScore(allScores[i], allScores[j]),
      });
    }
  }

  const avgScore =
    pairs.reduce((sum, p) => sum + p.score, 0) / pairs.length;
  const minScore = Math.min(...pairs.map((p) => p.score));

  // 60% average + 40% weakest link
  let teamScore = Math.round(avgScore * 0.6 + minScore * 0.4);

  // 軸カバレッジの算出
  const balance = calculateAxisBalance(allScores);

  // カバレッジが高いチームにはボーナス（最大+8）
  teamScore += Math.round((balance.coverage / 100) * 8);

  teamScore = Math.max(0, Math.min(100, teamScore));

  return { teamScore, pairs, balance };
}

/**
 * チーム内の4軸カバレッジを算出
 * 各軸について、チーム内に両方向のメンバーがいるかを評価
 */
function calculateAxisBalance(allScores: ParticipantScores[][]): AxisBalance {
  const axes = ["EI", "SN", "TF", "JP"];
  const labels: Record<string, [string, string]> = {
    EI: ["社交建築", "瞑想建築"],
    SN: ["素材主義", "概念主義"],
    TF: ["構造論理", "空間感性"],
    JP: ["完結主義", "即興主義"],
  };

  let coveredAxes = 0;
  let maxBias = 0;
  let maxBiasLabel = "";
  let minBias = Infinity;
  let minBiasLabel = "";

  for (let axIdx = 0; axIdx < 4; axIdx++) {
    const axisName = axes[axIdx];
    const values = allScores.map((s) => s[axIdx].average);
    const hasLeft = values.some((v) => v < 2.5);
    const hasRight = values.some((v) => v > 3.5);

    if (hasLeft && hasRight) {
      coveredAxes++;
    }

    // チーム全体の偏り
    const avgVal = values.reduce((a, b) => a + b, 0) / values.length;
    const bias = Math.abs(avgVal - 3);

    if (bias > maxBias) {
      maxBias = bias;
      maxBiasLabel = avgVal < 3 ? labels[axisName][0] : labels[axisName][1];
    }
    if (bias < minBias) {
      minBias = bias;
      minBiasLabel = avgVal < 3 ? labels[axisName][0] : labels[axisName][1];
    }
  }

  return {
    coverage: Math.round((coveredAxes / 4) * 100),
    dominant: maxBiasLabel,
    weak: minBiasLabel,
  };
}

/**
 * スコアに応じた相性ラベルを返す
 */
export function getScoreLabel(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 85)
    return {
      label: "最高の共鳴",
      color: "#FF6B6B",
      description: "同じ事務所を構えるべきレベル",
    };
  if (score >= 70)
    return {
      label: "好相性",
      color: "#F59E0B",
      description: "コンペでチームを組むと強い",
    };
  if (score >= 50)
    return {
      label: "刺激的な関係",
      color: "#6C5CE7",
      description: "ぶつかりながら高め合える",
    };
  if (score >= 30)
    return {
      label: "異質な存在",
      color: "#636E72",
      description: "理解し合うには時間がかかる",
    };
  return {
    label: "建築思想の衝突",
    color: "#2D3436",
    description: "設計会議は紛糾必至",
  };
}
