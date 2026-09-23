/**
 * Score calculation dispatch for development modules.
 * Each module can register a custom scorer; unregistered modules use the default.
 */

type ScoreResult = {
  sectionScores: Record<string, number>;
  overallScore: number;
  recommendation: string;
};

type ScoreCalculator = (formData: Record<string, any>) => ScoreResult;

const registry = new Map<string, ScoreCalculator>();

export function registerScorer(moduleType: string, calc: ScoreCalculator) {
  registry.set(moduleType, calc);
}

export function calculateScores(moduleType: string, formData: Record<string, any>): ScoreResult {
  const custom = registry.get(moduleType);
  if (custom) return custom(formData);
  return defaultScoreCalculator(formData);
}

function defaultScoreCalculator(formData: Record<string, any>): ScoreResult {
  const sectionScores: Record<string, number> = {};
  const scoreKeys: string[] = [];

  for (const [key, value] of Object.entries(formData)) {
    if (key.endsWith("Score") && typeof value === "number" && value >= 0 && value <= 100) {
      sectionScores[key] = value;
      scoreKeys.push(key);
    }
  }

  const overallScore = scoreKeys.length > 0
    ? Math.round(scoreKeys.reduce((sum, k) => sum + sectionScores[k], 0) / scoreKeys.length)
    : 0;

  let recommendation = "Continue Development";
  if (overallScore >= 90) recommendation = "Approve for Production";
  else if (overallScore >= 80) recommendation = "Approve with Minor Revisions";
  else if (overallScore >= 70) recommendation = "Revisions Required";
  else if (overallScore >= 50) recommendation = "Major Rework Needed";
  else if (overallScore > 0) recommendation = "Not Ready - Restart Assessment";

  return { sectionScores, overallScore, recommendation };
}
