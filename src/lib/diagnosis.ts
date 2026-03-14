import { questions, type Axis } from "@/data/questions";
import { mbtiTypes } from "@/data/types";

export interface AxisScore {
  axis: Axis;
  average: number; // 1-5, <3 = left letter, >3 = right letter
  letter: string;
}

export interface DiagnosisResult {
  typeCode: string;
  axisScores: AxisScore[];
  architectCandidates: [string, string];
  selectedArchitectIndex: number;
}

/**
 * 各軸5問のスコア平均を算出し、4軸の組み合わせで16タイプを判定
 * answers: { [questionId]: 1-5 }
 * 1=完全にA寄り, 5=完全にB寄り
 * A寄り(低い値) = E, S, T, J
 * B寄り(高い値) = I, N, F, P
 */
export function calculateDiagnosis(
  answers: Record<number, number>
): DiagnosisResult {
  const axisQuestions: Record<Axis, number[]> = {
    EI: [],
    SN: [],
    TF: [],
    JP: [],
  };

  for (const q of questions) {
    axisQuestions[q.axis].push(answers[q.id]);
  }

  const letterMap: Record<Axis, [string, string]> = {
    EI: ["E", "I"],
    SN: ["S", "N"],
    TF: ["T", "F"],
    JP: ["J", "P"],
  };

  const axisScores: AxisScore[] = (["EI", "SN", "TF", "JP"] as Axis[]).map(
    (axis) => {
      const scores = axisQuestions[axis];
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      const [leftLetter, rightLetter] = letterMap[axis];
      return {
        axis,
        average,
        letter: average <= 3 ? leftLetter : rightLetter,
      };
    }
  );

  const typeCode = axisScores.map((s) => s.letter).join("");
  const typeData = mbtiTypes[typeCode];

  // 建築家候補2名のうち、回答パターンでより近い方を仮選定
  // 各軸の偏りの強さ（中心3からの距離）で判定
  // 偏りが強い = 1番目の建築家（よりアイコニックな方）
  // 偏りが弱い = 2番目の建築家（よりニュアンスのある方）
  const totalDeviation = axisScores.reduce(
    (sum, s) => sum + Math.abs(s.average - 3),
    0
  );
  const selectedArchitectIndex = totalDeviation >= 4 ? 0 : 1;

  return {
    typeCode,
    axisScores,
    architectCandidates: [
      typeData.architects[0].name,
      typeData.architects[1].name,
    ],
    selectedArchitectIndex,
  };
}
