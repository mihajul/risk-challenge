import { Request, Response } from 'express';
import { RiskRequest, RiskResponse, RiskType } from '../../interfaces/risk';
import { getRisk } from '../service/risk';

function mapScoreToCategory(score: number | null): RiskType {
  if (score === null) {
    return 'ineligible';
  } else if (score <= 0) {
    return 'economic';
  } else if (score <= 2) {
    return 'regular';
  } else {
    return 'responsible';
  }
}

export const calculateRisk = (req: Request<RiskRequest>, res: Response<RiskResponse>) => {
  const riskRequest = req.body;

  const riskScore = getRisk(riskRequest);

  return res.json({
    auto: mapScoreToCategory(riskScore.auto),
    disability: mapScoreToCategory(riskScore.disability),
    home: mapScoreToCategory(riskScore.home),
    life: mapScoreToCategory(riskScore.life),
  });
};
