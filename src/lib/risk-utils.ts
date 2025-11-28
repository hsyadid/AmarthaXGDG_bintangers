// Risk threshold utilities
// Risk values in database are stored as decimals (0-1)
// Display values are multiplied by 100 to show as percentages (0-100%)

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface RiskThresholds {
  low: number;      // < 10
  moderate: number; // 10 - 20
  high: number;     // > 20
}

export const RISK_THRESHOLDS: RiskThresholds = {
  low: 0.10,   // 10%
  moderate: 0.20,  // 20%
  high: 0.20,  // 20%
};

/**
 * Determine risk level based on risk score
 * @param riskScore - Risk score (can be 0-1 decimal or 0-100 percentage)
 * @returns Risk level classification
 */
export function getRiskLevel(riskScore: number): RiskLevel {
  // Normalize to 0-1 range if it's in percentage (0-100)
  const normalizedScore = riskScore > 1 ? riskScore / 100 : riskScore;
  
  if (normalizedScore < 0.10) {
    return 'low';
  } else if (normalizedScore >= 0.10 && normalizedScore < 0.20) {
    return 'moderate';
  } else {
    return 'high';
  }
}

/**
 * Check if risk score is high risk
 * @param riskScore - Risk score from database (0-1) or display value (0-100)
 * @returns true if high risk (>20% or >0.20)
 */
export function isHighRisk(riskScore: number): boolean {
  return riskScore > RISK_THRESHOLDS.high;
}

/**
 * Check if risk score is moderate risk
 * @param riskScore - Risk score from database (0-100)
 * @returns true if moderate risk (10-20%)
 */
export function isModerateRisk(riskScore: number): boolean {
  return riskScore >= RISK_THRESHOLDS.low && riskScore <= RISK_THRESHOLDS.moderate;
}

/**
 * Check if risk score is low risk
 * @param riskScore - Risk score from database (0-100)
 * @returns true if low risk (<10%)
 */
export function isLowRisk(riskScore: number): boolean {
  return riskScore < RISK_THRESHOLDS.low;
}

/**
 * Get background color class for risk score
 * @param riskScore - Risk score from database (0-100)
 * @returns Tailwind CSS background color class
 */
export function getRiskScoreBgColor(riskScore: number): string {
  const level = getRiskLevel(riskScore);
  switch (level) {
    case 'low':
      return 'bg-green-50';
    case 'moderate':
      return 'bg-yellow-50';
    case 'high':
      return 'bg-red-50';
  }
}

/**
 * Get text color class for risk score
 * @param riskScore - Risk score from database (0-100)
 * @returns Tailwind CSS text color class
 */
export function getRiskScoreTextColor(riskScore: number): string {
  const level = getRiskLevel(riskScore);
  switch (level) {
    case 'low':
      return 'text-green-600';
    case 'moderate':
      return 'text-yellow-600';
    case 'high':
      return 'text-red-600';
  }
}

/**
 * Calculate trend based on current and previous risk scores
 * @param currentRisk - Current risk score
 * @param previousRisk - Previous risk score (from 1 week ago)
 * @returns 'up' if risk increased, 'down' if decreased, 'stable' if unchanged
 */
export function calculateTrend(currentRisk: number, previousRisk: number | null): 'up' | 'down' | 'stable' {
  if (previousRisk === null) {
    return 'stable';
  }
  
  const difference = currentRisk - previousRisk;
  
  // Consider changes less than 0.01 (1%) as stable
  if (Math.abs(difference) < 0.01) {
    return 'stable';
  }
  
  return difference > 0 ? 'up' : 'down';
}
