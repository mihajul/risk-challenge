import { RiskRequest } from '../../interfaces/risk';

import dayjs from 'dayjs';
import { RuleExpression, RuleSet } from '../../interfaces/rule';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export const getRisk = (riskRequest: RiskRequest): { [key: string]: number | null } => {
  const riskScore: { [key: string]: number | null } = {
    auto: 0,
    disability: 0,
    home: 0,
    life: 0,
  };

  const linesOfInsurance = ['auto', 'disability', 'home', 'life'];
  for (const line of linesOfInsurance) {
    riskScore[line] = calculateBaseScore(riskRequest.risk_questions);
  }
  const rules: RuleSet = getRules();
  for (const rule of rules) {
    if (evaluateRule(riskRequest, rule.expression)) {
      for (const line of rule.lineOfInsurance) {
        if (riskScore[line] === null || rule.result === null) {
          riskScore[line] = null;
        } else {
          riskScore[line] = (riskScore[line] ?? 0) + rule.result;
        }
      }
    }
  }

  return riskScore;
};

const getRules = (): RuleSet => {
  return [
    { expression: [{ field: 'income', operator: '=', value: 0 }], lineOfInsurance: ['disability'], result: null },
    { expression: [{ field: 'vehicle', operator: '=', value: null }], lineOfInsurance: ['auto'], result: null },
    { expression: [{ field: 'house', operator: '=', value: null }], lineOfInsurance: ['home'], result: null },
    { expression: [{ field: 'age', operator: '>', value: 60 }], lineOfInsurance: ['disability', 'life'], result: null },
    { expression: [{ field: 'age', operator: '<', value: 30 }], lineOfInsurance: ['auto', 'disability', 'home', 'life'], result: -2 },
    {
      expression: [
        { field: 'age', operator: '>=', value: 30 },
        { field: 'age', operator: '<', value: 40 },
      ],
      lineOfInsurance: ['auto', 'disability', 'home', 'life'],
      result: -1,
    },
    { expression: [{ field: 'income', operator: '>', value: 200000 }], lineOfInsurance: ['auto', 'disability', 'home', 'life'], result: -1 },
    { expression: [{ field: 'house.ownership_status', operator: '=', value: 'mortgaged' }], lineOfInsurance: ['home', 'disability'], result: 1 },
    { expression: [{ field: 'dependents', operator: '>', value: 0 }], lineOfInsurance: ['life', 'disability'], result: 1 },
    { expression: [{ field: 'marital_status', operator: '=', value: 'married' }], lineOfInsurance: ['life'], result: 1 },
    { expression: [{ field: 'marital_status', operator: '=', value: 'married' }], lineOfInsurance: ['disability'], result: -1 },
    { expression: [{ field: 'vehicle.year', operator: '>', value: dayjs().add(-5, 'year').toISOString() }], lineOfInsurance: ['auto'], result: 1 },
  ];
};

const evaluateRule = (riskRequest: RiskRequest, expression: RuleExpression[]): boolean => {
  for (const condition of expression) {
    const { field, operator, value } = condition;

    const fieldValue = getFieldFromRiskRequest(field as string, riskRequest);
    if (!evaluateExpression(fieldValue, operator, value)) {
      return false;
    }
  }

  return true;
};

const getFieldFromRiskRequest = (field: string, riskRequest: any): any => {
  if (field.includes('.')) {
    const [nestedField, subField] = field.split('.');
    const nested = riskRequest[nestedField as keyof RiskRequest];
    if (nested === null) {
      return null;
    }
    return nested[subField];
  }

  return riskRequest[field as keyof RiskRequest];
};
const evaluateExpression = (fieldValue: any, operator: string, value: any): boolean => {
  const isDateValue = dayjs(value).isValid();

  if (isDateValue && value) {
    if (fieldValue == null) {
      return false;
    }
    dayjs.extend(customParseFormat);
    const fieldValueAsDate = dayjs(fieldValue.toString(), 'YYYY');
    const valueAsDate = dayjs(value);

    switch (operator) {
      case '=':
        return fieldValueAsDate.isSame(valueAsDate);
      case '>':
        return fieldValueAsDate.isAfter(valueAsDate);
      case '<':
        return fieldValueAsDate.isBefore(valueAsDate);
      default:
        return false;
    }
  } else {
    switch (operator) {
      case '=':
        return fieldValue === value;
      case '>':
        return fieldValue > value;
      case '<':
        return fieldValue < value;
      case '>=':
        return fieldValue >= value;
      case '<=':
        return fieldValue <= value;
      default:
        return false;
    }
  }
};

const calculateBaseScore = (riskQuestions: number[]) => riskQuestions.reduce((acc, value) => acc + value, 0);
