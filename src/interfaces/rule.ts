import { RiskRequest } from './risk';

export type RuleExpression = {
  field: keyof RiskRequest | string;
  operator: string;
  value: string | number | null | Date;
};

export type Rule = {
  expression: RuleExpression[];
  lineOfInsurance: string[];
  result: number | null;
};

export type RuleSet = Rule[];
