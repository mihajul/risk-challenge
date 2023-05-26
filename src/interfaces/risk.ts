export type RiskRequest = {
  age: number;
  dependents: number;
  house: {
    ownership_status: 'owned' | 'mortgaged';
  } | null;
  income: number;
  marital_status: 'single' | 'married';
  risk_questions: [0 | 1, 0 | 1, 0 | 1];
  vehicle: {
    year: number;
  } | null;
};

export type RiskType = 'economic' | 'regular' | 'responsible' | 'ineligible';

export type RiskResponse = {
  auto: RiskType;
  disability: RiskType;
  home: RiskType;
  life: RiskType;
};
