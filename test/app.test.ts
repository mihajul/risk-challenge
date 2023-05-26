import request from 'supertest';

import app from '../src/app';

describe('app', () => {
  it('responds with a not found message', done => {
    request(app).get('/what-is-this-even').set('Accept', 'application/json').expect('Content-Type', /json/).expect(404, done);
  });
});

describe('POST /api/v1/risk', () => {
  it('responds with a json message', done => {
    request(app)
      .post('/api/v1/risk')
      .set('Accept', 'application/json')
      .send({
        age: 35,
        dependents: 2,
        house: { ownership_status: 'owned' },
        income: 0,
        marital_status: 'married',
        risk_questions: [0, 0, 0],
        vehicle: { year: 2018 },
      })
      .expect('Content-Type', /json/)
      .expect(
        200,
        {
          auto: 'economic',
          disability: 'ineligible',
          home: 'economic',
          life: 'regular',
        },
        done
      );
  });
});
