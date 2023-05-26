import { getRisk } from '../src/api/service/risk';

describe('Risk calculation', () => {
  it('returns null (ineligible) if the income, house or vehicle is missing', done => {
    const risk = getRisk({
      age: 35,
      dependents: 2,
      house: null,
      income: 0,
      marital_status: 'married',
      risk_questions: [0, 0, 0],
      vehicle: null,
    });
    expect(risk.auto).toBe(null);
    expect(risk.disability).toBe(null);
    expect(risk.home).toBe(null);
    done();
  });

  it('Calculates initial risk based on the questions', done => {
    const risk = getRisk({
      age: 35,
      dependents: 2,
      house: { ownership_status: 'owned' },
      income: 1,
      marital_status: 'married',
      risk_questions: [1, 1, 1],
      vehicle: { year: 2018 },
    });
    expect(risk.auto).toBe(3);
    expect(risk.disability).toBe(3);
    expect(risk.home).toBe(3);
    expect(risk.life).toBe(5);
    done();
  });

  it('Increases the auto risk if the year is newer than 2018', done => {
    const risk = getRisk({
      age: 35,
      dependents: 2,
      house: { ownership_status: 'owned' },
      income: 1,
      marital_status: 'married',
      risk_questions: [0, 0, 0],
      vehicle: { year: 2019 },
    });
    expect(risk.auto).toBe(1);
    done();
  });

  it('Leaves auto risk unchanged if the year is older than 2018', done => {
    const risk = getRisk({
      age: 35,
      dependents: 2,
      house: { ownership_status: 'owned' },
      income: 1,
      marital_status: 'married',
      risk_questions: [0, 0, 0],
      vehicle: { year: 2017 },
    });
    expect(risk.auto).toBe(0);
    done();
  });
});
